import sys
import subprocess
import json

def upload_image_to_assets(image_path):
    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()

        # Convert bytes to Candid vec { ... } format
        nat8_array_str = ", ".join([str(b) + ": nat8" for b in image_bytes])
        candid_arg = f"(vec {{ {nat8_array_str} }})"

        # Construct the dfx canister call command
        command = [
            "dfx", "canister", "call",
            "mshamba_assets", "uploadImage",
            candid_arg
        ]

        print(f"Attempting to upload {image_path} to mshamba_assets...")
        print(f"Executing command: {" ".join(command[:5])} ... (truncated for brevity)") # Show first few parts

        # Execute the command
        result = subprocess.run(command, capture_output=True, text=True, check=True)

        # Parse the output to get the image ID
        # dfx output for successful call is usually like: (text "img-123")
        output_lines = result.stdout.strip().split('\n')
        if output_lines and output_lines[-1].startswith('(text "'):
            image_id = output_lines[-1].strip('(text "').strip('")')
            print(f"Successfully uploaded image. Image ID: {image_id}")
            return image_id
        else:
            print("Unexpected output format from dfx canister call:")
            print(result.stdout)
            print(result.stderr)
            return None

    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return None
    except subprocess.CalledProcessError as e:
        print(f"Error executing dfx command: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload_image_to_assets.py <path_to_image_file>")
        sys.exit(1)
    
    image_file_path = sys.argv[1]
    uploaded_id = upload_image_to_assets(image_file_path)
    if uploaded_id:
        print(f"\nTo use this image ID in your farm details, you can use:")
        print(f"dfx canister call mshamba_backend updateFarmDetails '(\"YOUR_FARM_ID\", ..., \"{uploaded_id}\", ...)'")
