'use client';

import { IconMedicalCross } from '@tabler/icons-react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const menuItems = ['HOME', 'ABOUT', 'TESTIMONIAL', 'TOOLS', 'CONTACT'];

 return (
    <>
      <header className="fixed top-0 w-full z-[9999]">
        <div className="mx-2 mt-2 rounded-xl bg-black lg:bg-transparent px-4 sm:px-6 lg:px-8 h-14 lg:h-20 flex items-center justify-between">
          {/* <div className="text-2xl font-bold ">
            
          </div> */}

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <IconMedicalCross className="h-5 w-5 text-white lg:text-white" />
            </div>
            <span className="text-xl font-bold text-white lg:text-black">Aurenza Labs</span>
          </div>

          <div className="hidden lg:flex items-center">
            <button className="inline-flex items-center text-xs text-black hover:text-gray-700 transition-all duration-300 tracking-widest uppercase group">
              CONTACT US
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white text-sm font-semibold px-3 py-1 bg-gray-800 rounded-md">
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[999] bg-black bg-opacity-100 flex flex-col items-start pt-24 px-6 space-y-8 text-white text-2xl font-bold tracking-wide transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} >
        {menuItems.map((item) => (
          <a key={item} href={"#" + item.toLowerCase().replace(/ /g, "-")}
           onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition">
            {item}
          </a>
        ))}
      </div>
    </>
  );
}
