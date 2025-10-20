// Professional financial icons for money-related features
// Clear, specific icons that users can trust

export const SecurityIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L3 7v5c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z"/>
    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

export const GrowthIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17l6-6 4 4 8-8"/>
    <path d="M14 7h7v7"/>
    <circle cx="7" cy="12" r="1"/>
    <circle cx="12" cy="8" r="1"/>
    <circle cx="16" cy="4" r="1"/>
  </svg>
);

export const ReturnsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 8h10M7 12h7M7 16h4"/>
    <circle cx="17" cy="16" r="2" fill="currentColor"/>
    <path d="M15 14l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const YieldIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
    <text x="12" y="18" textAnchor="middle" fontSize="8" fill="white">%</text>
  </svg>
);

export const InvestmentIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 9v6M9 12h6"/>
  </svg>
);

export const EscrowIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1" fill="white"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const TokenIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1"/>
  </svg>
);

export const FarmIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z"/>
    <path d="M8 10h8v2H8zM8 13h6v2H8z" fill="white"/>
  </svg>
);

export const PerformanceIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3v18h18"/>
    <path d="M7 16l4-4 4 4 6-6" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="7" cy="16" r="2"/>
    <circle cx="11" cy="12" r="2"/>
    <circle cx="15" cy="16" r="2"/>
    <circle cx="21" cy="10" r="2"/>
  </svg>
);

export const ProfitIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.5 8.5L12 6l2.5 2.5M12 6v12" stroke="white" strokeWidth="2" fill="none"/>
    <text x="12" y="20" textAnchor="middle" fontSize="6" fill="white">KSH</text>
  </svg>
);
