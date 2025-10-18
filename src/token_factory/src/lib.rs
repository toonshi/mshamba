use candid::{CandidType, Encode, Nat, Principal};
use ic_cdk::api::management_canister::main::{
    create_canister, install_code, CanisterSettings, CreateCanisterArgument, InstallCodeArgument,
};
use icrc_ledger_types::icrc::generic_value::Value;
use icrc_ledger_types::icrc1::account::Account;
use serde::{Deserialize, Serialize};

// Embed the ICRC-1 ledger WASM at compile time
const ICRC1_LEDGER_WASM: &[u8] = include_bytes!("assets/icrc1_ledger.wasm.gz");

// Type definitions for ICRC-1 ledger initialization
#[derive(Debug, Serialize, Deserialize, CandidType, Clone)]
pub struct FeatureFlags {
    pub icrc2: bool,
}

#[derive(Deserialize, CandidType, Clone, Debug, Serialize)]
pub struct InitArgs {
    pub minting_account: Account,
    pub fee_collector_account: Option<Account>,
    pub initial_balances: Vec<(Account, Nat)>,
    pub transfer_fee: Nat,
    pub decimals: Option<u8>,
    pub token_name: String,
    pub token_symbol: String,
    pub metadata: Vec<(String, Value)>,
    pub archive_options: ArchiveOptions,
    pub max_memo_length: Option<u16>,
    pub feature_flags: Option<FeatureFlags>,
    pub maximum_number_of_accounts: Option<u64>,
    pub accounts_overflow_trim_quantity: Option<u64>,
}

#[derive(Serialize, Deserialize, CandidType, Clone, Debug)]
pub struct ArchiveOptions {
    pub trigger_threshold: usize,
    pub num_blocks_to_archive: usize,
    pub node_max_memory_size_bytes: Option<u64>,
    pub max_message_size_bytes: Option<u64>,
    pub controller_id: Principal,
    pub more_controller_ids: Option<Vec<Principal>>,
    pub cycles_for_archive_creation: Option<u64>,
    pub max_transactions_per_response: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize, CandidType)]
pub enum LedgerArg {
    Init(InitArgs),
    Upgrade(Option<UpgradeArgs>),
}

#[derive(Debug, Serialize, Deserialize, CandidType)]
pub struct UpgradeArgs {}

// Input parameters for creating a new farm token
#[derive(CandidType, Deserialize)]
pub struct CreateTokenParams {
    pub token_name: String,
    pub token_symbol: String,
    pub token_logo: Option<String>,
    pub decimals: u8,
    pub total_supply: Nat,
    pub transfer_fee: Nat,
    pub minting_account_owner: Principal,  // Usually the farm owner or DAO
}

#[ic_cdk::update]
async fn create_farm_token(params: CreateTokenParams) -> Result<Principal, String> {
    ic_cdk::println!("Creating farm token: {} ({})", params.token_name, params.token_symbol);

    // Set up the minting account (farm owner)
    let minting_account = Account {
        owner: params.minting_account_owner,
        subaccount: None,
    };

    // Fee collector account (same as minting account for now)
    let fee_collector_account = Some(Account {
        owner: params.minting_account_owner,
        subaccount: None,
    });

    // Metadata including logo if provided
    let mut metadata = vec![];
    if let Some(logo) = params.token_logo {
        metadata.push(("icrc1:logo".to_string(), Value::Text(logo)));
    }

    // Initial balance: mint entire supply to the minting account
    let initial_balances = vec![(
        Account {
            owner: params.minting_account_owner,
            subaccount: None,
        },
        params.total_supply.clone(),
    )];

    // Archive options with reasonable defaults
    let archive_options = ArchiveOptions {
        num_blocks_to_archive: 1000,
        trigger_threshold: 2000,
        max_transactions_per_response: Some(200),
        max_message_size_bytes: Some(2_000_000),
        cycles_for_archive_creation: Some(10_000_000_000_000),
        node_max_memory_size_bytes: Some(3_000_000_000),
        controller_id: ic_cdk::id(),
        more_controller_ids: Some(vec![params.minting_account_owner]),
    };

    // Build the init args
    let init_args = InitArgs {
        minting_account,
        fee_collector_account,
        transfer_fee: params.transfer_fee,
        decimals: Some(params.decimals),
        max_memo_length: Some(256),
        token_symbol: params.token_symbol,
        token_name: params.token_name,
        metadata,
        initial_balances,
        feature_flags: Some(FeatureFlags { icrc2: true }),
        maximum_number_of_accounts: Some(100_000),
        accounts_overflow_trim_quantity: Some(1_000),
        archive_options,
    };

    // Serialize init args
    let ledger_arg = LedgerArg::Init(init_args);
    let serialized_args = Encode!(&ledger_arg)
        .map_err(|e| format!("Failed to serialize ledger args: {:?}", e))?;

    // Create canister settings
    let canister_settings = CanisterSettings {
        controllers: Some(vec![ic_cdk::id(), params.minting_account_owner]),
        compute_allocation: None,
        memory_allocation: None,
        freezing_threshold: None,
        reserved_cycles_limit: None,
        log_visibility: None,
        wasm_memory_limit: None,
    };

    let create_args = CreateCanisterArgument {
        settings: Some(canister_settings),
    };

    // Create the canister with cycles (2T cycles = ~$2.50 USD, sufficient for a token ledger)
    let cycles_for_creation: u128 = 2_000_000_000_000;
    
    ic_cdk::println!("Creating canister with {} cycles", cycles_for_creation);
    
    let create_response = create_canister(create_args, cycles_for_creation)
        .await
        .map_err(|e| format!("Failed to create canister: {:?}", e))?;

    let new_canister_id = create_response.0.canister_id;

    ic_cdk::println!("Canister created: {}", new_canister_id);

    // Install the ICRC-1 ledger code
    let install_args = InstallCodeArgument {
        canister_id: new_canister_id,
        wasm_module: ICRC1_LEDGER_WASM.to_vec(),
        arg: serialized_args,
        mode: ic_cdk::api::management_canister::main::CanisterInstallMode::Install,
    };

    ic_cdk::println!("Installing ICRC-1 ledger code...");

    install_code(install_args)
        .await
        .map_err(|e| format!("Failed to install code: {:?}", e))?;

    ic_cdk::println!("Token ledger deployed successfully at {}", new_canister_id);

    Ok(new_canister_id)
}

// Export candid interface
ic_cdk::export_candid!();
