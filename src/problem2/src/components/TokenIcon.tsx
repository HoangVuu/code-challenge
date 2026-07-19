import React, { memo } from 'react';

interface TokenIconProps {
  src: string;
  alt: string;
  size?: number;
}

/** Displays a token icon with fallback */
export const TokenIcon: React.FC<TokenIconProps> = memo(({ src, alt, size = 24 }) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent && !parent.querySelector('.token-icon-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'token-icon-fallback';
      fallback.style.width = `${size}px`;
      fallback.style.height = `${size}px`;
      fallback.textContent = alt.charAt(0);
      parent.appendChild(fallback);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="token-icon"
      onError={handleError}
    />
  );
});

TokenIcon.displayName = 'TokenIcon';
