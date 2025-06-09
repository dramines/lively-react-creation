
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  clickable?: boolean;
}

const Logo = ({ className = '', showText = false, size = 'md', clickable = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-[82px] h-[82px]', // Increased by 10% from 75px to 82px
    xl: 'w-24 h-24',
    '2xl': 'w-28 h-28'
  };

  const logoImage = (
    <img 
      src="/lovable-uploads/c91f2f1f-d57c-466e-806a-e0648f9ac238.png" 
      alt="My Little Hero Logo" 
      className={`${sizeClasses[size]} object-contain`}
    />
  );

  return (
    <div className={`flex items-center ${className}`}>
      {clickable ? (
        <Link to="/" className="hover:opacity-80 transition-opacity">
          {logoImage}
        </Link>
      ) : (
        logoImage
      )}
    </div>
  );
};

export default Logo;
