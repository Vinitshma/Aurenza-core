'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="hero-container">
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">+</div>
          <span className="logo-text">MedTech Pro</span>
        </div>
        <button className="contact-btn">CONTACT US</button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-left">
          <h1 className="hero-title">
            Revolutionizing Medical<br />
            Learning & Care with<br />
            AI + 3D Anatomy
          </h1>
          <p className="hero-subtitle">
            Explore the human body interactively and<br />
            access intelligent tools for learning,<br />
            diagnosis, and care.
          </p>
          <button className="cta-button">
            <span>Explore Anatomy</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="content-right">
          <div className="anatomy-wrapper">
            <Image
              src="/anatomy-figure.png"
              alt="3D Human Anatomy"
              width={600}
              height={800}
              className="anatomy-image"
              priority
            />
          </div>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <button className="nav-arrow nav-arrow-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="nav-items">
          <a href="#home" className="nav-item active">HOME</a>
          <a href="#about" className="nav-item">ABOUT</a>
          <a href="#testimonial" className="nav-item">TESTIMONIAL</a>
          <a href="#tools" className="nav-item">TOOLS</a>
        </div>

        <button className="nav-arrow nav-arrow-right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
