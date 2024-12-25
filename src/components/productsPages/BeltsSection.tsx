import React from "react";

interface BeltsSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

const BeltsSection = ({
  title = "Belts",
  subtitle = "LEATHER",
  description = "HANDCRAFTED IN TUNISIA WITH THE MOST PRESTIGIOUS ITALIAN LEATHER AND ATTENTION TO FINE DETAILS.",
  imageUrl = "https://via.placeholder.com/500x300",
}: BeltsSectionProps) => {
  return (
    <>
    <section className="flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-8 bg-[#EFEDED]">
      <div className="w-full md:w-1/2 text-center md:text-left md:pr-4">
        
        <h1 className="text-[32px] md:text-[50px] font-light text-[#4C3A36] mb-2">
          {title}
        </h1>
        <h3 className="text-[16px] md:text-[20px] font-normal text-[#4C3A36] tracking-widest uppercase mb-4">
          {subtitle}
        </h3>
        <p className="text-[16px] md:text-[20px] text-[#4C3A36] leading-6 mb-4">
          {description}
        </p>
        <div className="flex justify-center md:justify-end">
          <a
            href="#"
            className="text-[#4C3A36] uppercase text-[14px] md:text-[18px] font-semibold tracking-wide hover:underline"
          >
            Discover more
          </a>
        </div>
      </div>
      {/* Image Section */}
      <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pl-4">
        <img
          src={imageUrl}
          alt="Placeholder for belts"
          className="rounded-md object-cover w-full h-auto max-h-[300px] md:max-h-[400px]"
        />
      </div>
    </section>
    </>
  );
};

export default BeltsSection;
