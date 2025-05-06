
import React from 'react';
import { Badge } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface FiguesIconProps {
  size?: number;
  color?: string;
}

const FiguesIcon: React.FC<FiguesIconProps> = ({ 
  size = 24, 
  color = 'currentColor' 
}) => {
  const isMobile = useIsMobile();
  
  // Adjust size for mobile
  const adjustedSize = isMobile ? Math.max(16, size * 0.8) : size;
  const fontSize = isMobile ? '8px' : '10px';

  return (
    <div className="relative inline-flex items-center justify-center">
      <Badge size={adjustedSize} color={color} />
      <span className="absolute font-bold" style={{ color, fontSize }}>
        FD
      </span>
    </div>
  );
};

export default FiguesIcon;