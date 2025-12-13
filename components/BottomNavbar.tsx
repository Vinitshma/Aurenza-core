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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (navbarRef.current) {
      gsap.fromTo(
        navbarRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.4 }
      );
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      if(window.innerWidth >= 600){
        setVisibleCount(4);
      }else if(window.innerWidth >= 400){
        setVisibleCount(3);
      }else{
        setVisibleCount(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  useEffect(() => {
    const activeIndex = navItems.findIndex(item => item.path === pathname);
    if (activeIndex !== -1) {
      setStartIndex((current) => {
        if (activeIndex < current) return activeIndex;
        if (activeIndex >= current + visibleCount) {
          return activeIndex - visibleCount + 1;
        }
        return current;
      });
    }
  }, [pathname, visibleCount]);

  // Clamp index
  useEffect(() => {
    if (startIndex > navItems.length - visibleCount) {
      setStartIndex(Math.max(0, navItems.length - visibleCount));
    }
  }, [visibleCount, startIndex]);

  const visibleItems = navItems.slice(startIndex, startIndex + visibleCount);

  return (
    <div
      ref={navbarRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[30] w-full max-w-[480px] px-3"
    >
      <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-md shadow-2xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          <button
            onClick={() => setStartIndex(i => Math.max(0, i - 1))}
            disabled={startIndex === 0}
            className={`p-2 transition-colors ${
              startIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-1 items-center justify-center gap-6">
            {visibleItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium tracking-wide ${
                    isActive
                      ? 'text-gray-900 border-b-2 border-blue-500 pb-1'
                      : 'text-gray-500 hover:text-gray-900 transition-colors'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() =>
              setStartIndex(i =>
                Math.min(navItems.length - visibleCount, i + 1)
              )
            }
            disabled={startIndex >= navItems.length - visibleCount}
            className={`p-2 transition-colors ${
              startIndex >= navItems.length - visibleCount
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
}
