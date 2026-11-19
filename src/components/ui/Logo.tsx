import React from 'react';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLegal?: boolean;
  tone?: 'dark' | 'light';
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showLegal = true,
  tone = 'dark',
}) => {
  // Mobile-first responsive image heights:
  // on mobile, keep logo compact and neat (h-9 or h-10) so it doesn't crowd navigation
  // on desktop (sm: / md:), expand smoothly for premium luxury brand presence
  const imgSizes = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-9 sm:h-12 lg:h-13 w-auto',
    lg: 'h-10 sm:h-13 lg:h-14 w-auto',
    xl: 'h-11 sm:h-14 lg:h-16 w-auto',
  };

  const isLightSurface = tone === 'light';

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Original Brand Logo with crisp mobile scaling and gold glow */}
      <img
        src="/assets/v2/original-logo-transparent.png"
        alt="Precise Gold Testing Laboratory LLC"
        className={`${imgSizes[size]} object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition-transform duration-300 group-hover:scale-105 shrink-0`}
        loading="eager"
        decoding="async"
      />

      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-display text-xs sm:text-sm lg:text-base font-extrabold tracking-[0.14em] sm:tracking-[0.16em] transition-colors duration-300 whitespace-nowrap ${
            isLightSurface ? 'text-neutral-900' : 'text-white'
          }`}
        >
          PRECISE <span className="text-[#D4AF37]">GOLD</span>
        </span>
        {showLegal && (
          <span
            className={`mt-0.5 sm:mt-1 text-[8px] sm:text-[9.5px] lg:text-[10px] font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase transition-colors duration-300 whitespace-nowrap ${
              isLightSurface ? 'text-[#9A7722]' : 'text-[#F3D887]'
            }`}
          >
            TESTING LABORATORY L.L.C
          </span>
        )}
      </span>
    </span>
  );
};
