import React from 'react';

const BrandNavbarSection = () => {
  return (
    <div className="bg-[#EFEDED] w-full z-10 text-center py-3">
      <div className="relative container mx-auto px-4">
        <img
          src="../logoblack.png"
          alt="FIORI Logo"
          className="mx-auto h-[4.95rem]" // Increased from h-12 (3rem) to 3.75rem (30% larger)
        />
      </div>
    </div>
  );
};

export default BrandNavbarSection;
