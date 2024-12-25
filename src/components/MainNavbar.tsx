import React, { useState, useEffect } from 'react';
import { NavigationMenu } from "@/components/ui/navigation-menu";
import MainNavbarMenus from './main-navigation/MainNavbarMenus';
import { motion, useScroll, useTransform } from "framer-motion";

const MainNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const navbarAnimation = useTransform(
    scrollY,
    [0, 100], // scroll values
    [0, -100] // opacity values
  );

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <motion.div
      className={`absolute w-full z-20 text-center lg:top-[2.5%] top-[50px] transition-all duration-300 ${
        isScrolled
          ? 'bg-[#4A0404]/90 backdrop-blur-sm py-4'
          : 'bg-transparent'
      }`}
      style={{
        y: navbarAnimation,
      }}
      initial={{ y: 0 }}
      animate={{
        y: isScrolled ? -100 : 0,
        opacity: isScrolled ? 0 : 1
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <NavigationMenu className="mx-auto max-w-screen-2xl">
        <MainNavbarMenus />
      </NavigationMenu>
    </motion.div>
  );
};

export default MainNavbar;
