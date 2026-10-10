interface LogoProps {
  size?: number
  withWordmark?: boolean
  wordmarkColor?: string
}

// Logo Nexus WMS: tile Ant Blue gradient bo góc 8px, glyph chữ N cách điệu hiện đại (kết nối mạng lưới kho bãi Nexus).
function Logo({
  size = 32,
  withWordmark = false,
  wordmarkColor = '#fff',
}: LogoProps) {
  const isDarkText = wordmarkColor !== '#fff' && wordmarkColor !== '#ffffff'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="nexusGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1677FF" />
            <stop offset="1" stopColor="#0958D9" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#nexusGrad)" />
        {/* Geometric connected letter N */}
        <path
          d="M8.5 23V9h3.6l7.4 9.6V9h4v14h-3.6L12.5 13.4V23h-4z"
          fill="#ffffff"
        />
      </svg>
      {withWordmark && (
        <span
          style={{
            color: wordmarkColor,
            fontSize: size * 0.52,
            fontWeight: 700,
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}
        >
          Nexus <span style={{ color: isDarkText ? '#1677FF' : '#69b1ff' }}>WMS</span>
        </span>
      )}
    </div>
  )
}

export default Logo