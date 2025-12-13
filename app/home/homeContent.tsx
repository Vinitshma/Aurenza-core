'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { IconArrowNarrowRight} from "@tabler/icons-react";
import Link from "next/link";

export default function HomeContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen w-full relative overflow-hidden bg-gray-100">
        <div className="relative z-20 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Revolutionizing
                  <span className="block text-gray-700">Medical Learning</span>
                  <span className="block text-gray-600">& Care with</span>
                  <span className="block text-gray-800">AI + 3D Anatomy</span>
                </h1>
              </div>
              
              <div className="max-w-xl">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Explore the human body interactively and access intelligent tools for learning, diagnosis, and care.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg"
                >
                  <Link href="/anatomy" className="flex items-center space-x-2">
                    <span>Explore Anatomy</span>
                    <IconArrowNarrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Loading placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-100">
      <div className="absolute inset-0">
        {/* Base atmospheric background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400"></div>
        
        {/* Fog and depth layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-500/20 via-transparent to-transparent"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-white/60 rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-gray-400/80 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-slow"></div>
        <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-gray-500/60 rounded-full animate-float"></div>
        <div className="absolute top-1/5 left-3/4 w-1 h-1 bg-white/50 rounded-full animate-float-delayed"></div>
        
        {/* Architectural depth elements */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rotate-12 blur-sm"></div>
        <div className="absolute bottom-40 right-32 w-32 h-32 bg-gradient-to-tl from-gray-400/30 to-transparent -rotate-12 blur-sm"></div>
        
        {/* Central monolithic structure */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-[600px] bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 opacity-30 blur-3xl"></div>
        
        {/* Grain texture overlay */}
        <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>

      <main className="relative z-20 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Revolutionizing
                <span className="block text-gray-700">Medical Learning</span>
                <span className="block text-gray-600">& Care with</span>
                <span className="block text-gray-800">AI + 3D Anatomy</span>
              </h1>
            </div>
            
            <div className="max-w-xl">
              <p className="text-lg text-gray-600 leading-relaxed">
                Explore the human body interactively and access intelligent tools for learning, diagnosis, and care.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg"
              >
                <Link href="/anatomy" className="flex items-center space-x-2">
                  <span>Explore Anatomy</span>
                  <IconArrowNarrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {/* Anatomical figure */}
              
            </div>
          </div>
        </div>
      </main>

      {isClient && (
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(-5px) translateX(-5px); }
            75% { transform: translateY(-15px) translateX(3px); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-15px) translateX(-3px); }
            50% { transform: translateY(-8px) translateX(8px); }
            75% { transform: translateY(-12px) translateX(-2px); }
          }
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
            50% { transform: translateY(-20px) translateX(10px) scale(1.1); }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
            animation-delay: -2s;
          }
          
          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
            animation-delay: -1s;
          }
          
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
        `}</style>
      )}
    </div>
  );
}