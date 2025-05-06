
import React from 'react';

interface TikTokIconProps {
  size?: number;
  className?: string;
}

export const TikTokIcon: React.FC<TikTokIconProps> = ({ size = 16, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
    >
      <path 
        d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.246V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.002a2.895 2.895 0 0 1 3.183 4.798 2.896 2.896 0 0 1-3.97-4.207 2.894 2.894 0 0 1 2.075-.896 2.868 2.868 0 0 1 2.88 2.847V8.406a8.28 8.28 0 0 0 4.963 1.626h.048v-3.345a4.779 4.779 0 0 1-2.381-.977z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default TikTokIcon;
