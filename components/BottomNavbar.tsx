'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const navItems = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT', path: '/about' },
  { name: 'TESTIMONIAL', path: '/testimonial' },
  { name: 'TOOLS', path: '/tools' }
];

export default function BottomNavbar() {
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    // GSAP Animation: Slide up from bottom
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setVisibleCount(4);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to active item when path changes
  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.path === pathname);
    if (activeIndex !== -1) {
      setStartIndex((currentStartIndex) => {
        if (activeIndex < currentStartIndex) {
          return activeIndex;
        }
        if (activeIndex >= currentStartIndex + visibleCount) {
          return activeIndex - visibleCount + 1;
        }
        return currentStartIndex;
      });
    }
  }, [pathname, visibleCount]);

  // Ensure startIndex is valid when visibleCount changes
  useEffect(() => {
    if (startIndex > navItems.length - visibleCount) {
      setStartIndex(Math.max(0, navItems.length - visibleCount));
    }
  }, [visibleCount, startIndex]);

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < navItems.length - visibleCount) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const visibleItems = navItems.slice(startIndex, startIndex + visibleCount);

  return (
    <div ref={navbarRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[998] w-full max-w-[610px] px-3 opacity-0 translate-y-[60px]">
      <div className="flex items-center justify-between px-3 md:px-4 h-[78px] bg-[#0303034f] backdrop-blur-md border-solid border-[#858181] rounded-2xl shadow-2xl w-full">
        <button 
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`text-white/70 hover:text-white transition-colors shrink-0 z-10 ${startIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex items-center justify-between px-4 md:px-8">
            {visibleItems.map((item) => (
                <Link
                    key={item.path}
                    href={item.path}
                    className={`text-[14px] md:text-[16px] font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
                        pathname === item.path
                        ? 'text-white border-b-2 border-white pb-1'
                        : 'text-white/60 hover:text-white'
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={startIndex >= navItems.length - visibleCount}
          className={`text-white/70 hover:text-white transition-colors shrink-0 z-10 ${startIndex >= navItems.length - visibleCount ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
