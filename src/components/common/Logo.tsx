interface LogoProps {
  size?: number
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  className?: string
  animated?: boolean
}

const BudgetTrackerLogo = ({
  size = 40,
  primaryColor = '#0ea5e9',
  secondaryColor = '#0369a1',
  accentColor = '#38bdf8',
  className = '',
  animated = true,
}: LogoProps) => {
  const animationClass = animated ? 'animate-pulse' : ''

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-sm"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${primaryColor}, ${secondaryColor})`,
        }}
      />

      {/* Main container */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-full"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 4px 6px -1px ${secondaryColor}40, 0 2px 4px -2px ${secondaryColor}30`,
        }}
      >
        {/* Decorative waves */}
        <svg
          className="absolute left-0 top-0 opacity-20"
          width={size}
          height={size}
          viewBox="0 0 40 40"
        >
          <path
            d="M0 20 Q10 15, 20 20 T40 20"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 25 Q10 20, 20 25 T40 25"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </svg>

        {/* Dollar symbol with enhanced styling */}
        <div
          className="relative font-bold"
          style={{
            color: 'white',
            fontSize: `${size * 0.5}px`,
            textShadow: `1px 1px 2px ${secondaryColor}`,
          }}
        >
          $
        </div>

        {/* Circular progress tracks */}
        <svg
          className="absolute left-0 top-0"
          width={size}
          height={size}
          viewBox="0 0 40 40"
        >
          {/* Outer track */}
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke={accentColor}
            strokeWidth="2"
            strokeDasharray="75 25"
            transform="rotate(-90 20 20)"
            className={animationClass}
          />

          {/* Inner track */}
          <circle
            cx="20"
            cy="20"
            r="14"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="60 40"
            transform="rotate(90 20 20)"
            opacity="0.3"
          />
        </svg>

        {/* Floating particles */}
        <svg
          className="absolute left-0 top-0"
          width={size}
          height={size}
          viewBox="0 0 40 40"
        >
          <circle
            cx="20"
            cy="4"
            r="1.5"
            fill="white"
            className={`${animationClass} opacity-80`}
          />
          <circle
            cx="32"
            cy="12"
            r="1"
            fill="white"
            className={`${animationClass} opacity-60`}
          />
          <circle
            cx="36"
            cy="20"
            r="1"
            fill="white"
            className={`${animationClass} opacity-40`}
          />
          <circle
            cx="8"
            cy="12"
            r="1"
            fill="white"
            className={`${animationClass} opacity-60`}
          />
          <circle
            cx="4"
            cy="20"
            r="1"
            fill="white"
            className={`${animationClass} opacity-40`}
          />
        </svg>

        {/* Shine effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, transparent 40%, ${accentColor} 45%, transparent 50%)`,
          }}
        />
      </div>
    </div>
  )
}

export default BudgetTrackerLogo
