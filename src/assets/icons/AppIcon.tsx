import React from 'react';

interface AppIconProps {
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient background circle */}
      <defs>
        <linearGradient id="appIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="documentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* Main background circle */}
      <circle cx="32" cy="32" r="30" fill="url(#appIconGradient)" />

      {/* Document icon representation */}
      <rect x="18" y="14" width="20" height="26" rx="2" fill="url(#documentGradient)" stroke="#CBD5E1" strokeWidth="0.5"/>

      {/* Document lines */}
      <rect x="21" y="18" width="14" height="1.5" rx="0.75" fill="#64748B" />
      <rect x="21" y="21" width="10" height="1.5" rx="0.75" fill="#64748B" />
      <rect x="21" y="24" width="12" height="1.5" rx="0.75" fill="#64748B" />

      {/* Terminal window representation */}
      <rect x="20" y="30" width="16" height="10" rx="1" fill="#1F2937" stroke="#374151" strokeWidth="0.5"/>

      {/* Terminal prompt */}
      <circle cx="22" cy="32" r="0.8" fill="#10B981" />
      <rect x="24" y="31.5" width="6" height="1" rx="0.5" fill="#F3F4F6" />

      {/* Terminal cursor */}
      <rect x="24" y="35" width="1" height="3" rx="0.5" fill="#F59E0B" />

      {/* Conversion arrow */}
      <path
        d="M40 22 L44 25 L40 28 M41 25 L38 25"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small sparkles for "conversion" effect */}
      <circle cx="46" cy="20" r="1" fill="#FBBF24" opacity="0.8" />
      <circle cx="48" cy="30" r="0.8" fill="#F59E0B" opacity="0.6" />
      <circle cx="45" cy="32" r="0.6" fill="#FBBF24" opacity="0.7" />
    </svg>
  );
};

export default AppIcon;