/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Code2,
  Terminal,
  Briefcase,
  GraduationCap,
  ArrowUpRight,
  ChevronUp,
  CheckCircle2,
  Globe,
  Cpu,
  BookOpen,
  Layers,
  Calendar,
} from 'lucide-react';
import heroPortraitImage from './assets/images/nayan_hero_portrait_1794042052077.jpg';

const PROFILE_IMAGE = heroPortraitImage;

interface ArcData {
  r: number;
  startDeg: number;
  endDeg: number;
  dotDeg: number;
  num: string;
  suffix: string;
  label: string;
}

// Circular telemetry arcs on the right (sm+)
const ARCS_CONFIG: ArcData[] = [
  {
    r: 330,
    startDeg: -92,
    endDeg: 16,
    dotDeg: -46,
    num: '3',
    suffix: '+',
    label: 'PROJECTS',
  },
  {
    r: 395,
    startDeg: -56,
    endDeg: 60,
    dotDeg: 2,
    num: '2',
    suffix: '',
    label: 'INTERNSHIPS',
  },
  {
    r: 460,
    startDeg: -14,
    endDeg: 72,
    dotDeg: 44,
    num: '8.44',
    suffix: '',
    label: 'CGPA',
  },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const heroWrapperRef = useRef<HTMLDivElement | null>(null);
  const heroStageRef = useRef<HTMLElement | null>(null);
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroFgRef = useRef<HTMLDivElement | null>(null);

  const revealDivRef = useRef<HTMLDivElement | null>(null);
  const patternRef = useRef<SVGPatternElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse & smoothing state for single unified rAF loop
  const mousePos = useRef({ x: -999, y: -999 });
  const smoothedCursor = useRef({ x: -999, y: -999 });
  const gridPos = useRef({ x: 0, y: 0 });
  const lastMaskPos = useRef({ x: -9999, y: -9999 });

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Hidden canvas for radial spotlight mask generation
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;

    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastMaskPos.current = { x: -9999, y: -9999 };
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        mousePos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if ('clientX' in e) {
        mousePos.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    const handlePointerLeave = () => {
      mousePos.current = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    let animationFrameId: number;

    const renderLoop = () => {
      const winW = window.innerWidth || 1;
      const winH = window.innerHeight || 1;

      // 1. Smooth cursor lerp (lerp factor 0.1)
      smoothedCursor.current.x += (mousePos.current.x - smoothedCursor.current.x) * 0.1;
      smoothedCursor.current.y += (mousePos.current.y - smoothedCursor.current.y) * 0.1;

      const curX = smoothedCursor.current.x;
      const curY = smoothedCursor.current.y;

      // 2. Parallax grid offset: target = (normalized cursor position - 0.5) * 16px, lerp 0.06
      const normalizedX = mousePos.current.x > 0 ? mousePos.current.x / winW : 0.5;
      const normalizedY = mousePos.current.y > 0 ? mousePos.current.y / winH : 0.5;
      const targetGridX = (normalizedX - 0.5) * 16;
      const targetGridY = (normalizedY - 0.5) * 16;

      gridPos.current.x += (targetGridX - gridPos.current.x) * 0.06;
      gridPos.current.y += (targetGridY - gridPos.current.y) * 0.06;

      if (patternRef.current) {
        patternRef.current.setAttribute('x', gridPos.current.x.toFixed(2));
        patternRef.current.setAttribute('y', gridPos.current.y.toFixed(2));
      }

      // 3. Spotlight reveal mask generation
      const distFromLast = Math.hypot(
        curX - lastMaskPos.current.x,
        curY - lastMaskPos.current.y
      );

      if (distFromLast > 0.25 || lastMaskPos.current.x === -9999) {
        lastMaskPos.current = { x: curX, y: curY };
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw gradient if within or near viewport
          if (curX > -300 && curX < canvas.width + 300 && curY > -300 && curY < canvas.height + 300) {
            const radius = 260;
            const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, radius);
            grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
            grad.addColorStop(0.4, 'rgba(0, 0, 0, 1)');
            grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.75)');
            grad.addColorStop(0.75, 'rgba(0, 0, 0, 0.4)');
            grad.addColorStop(0.88, 'rgba(0, 0, 0, 0.12)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(curX, curY, radius, 0, Math.PI * 2);
            ctx.fill();
          }

          const maskUrl = canvas.toDataURL();
          if (revealDivRef.current) {
            revealDivRef.current.style.maskImage = `url(${maskUrl})`;
            revealDivRef.current.style.webkitMaskImage = `url(${maskUrl})`;
            revealDivRef.current.style.maskSize = '100% 100%';
            revealDivRef.current.style.webkitMaskSize = '100% 100%';
            revealDivRef.current.style.maskRepeat = 'no-repeat';
            revealDivRef.current.style.webkitMaskRepeat = 'no-repeat';
          }
        }
      }

      // 4. Background and Content Separation on Scroll
      if (heroWrapperRef.current) {
        const rect = heroWrapperRef.current.getBoundingClientRect();
        const wrapperHeight = heroWrapperRef.current.offsetHeight;
        const maxScroll = Math.max(1, wrapperHeight - winH);
        const scrollOffset = -rect.top;
        const progress = Math.min(1, Math.max(0, scrollOffset / maxScroll));

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          if (heroBgRef.current) {
            heroBgRef.current.style.transform = 'none';
            heroBgRef.current.style.opacity = '1';
          }
          if (heroFgRef.current) {
            heroFgRef.current.style.transform = 'none';
            heroFgRef.current.style.opacity = '1';
          }
        } else {
          // Background layer: moves upward and scales backward into 3D space
          if (heroBgRef.current) {
            const bgY = progress * -18; // parallax upward translation
            const bgScale = 1 - progress * 0.08; // scale down slightly for depth
            const bgOpacity = 1 - progress * 0.35; // gentle atmospheric fade
            heroBgRef.current.style.transform = `translate3d(0, ${bgY.toFixed(2)}%, 0) scale(${bgScale.toFixed(3)})`;
            heroBgRef.current.style.opacity = `${bgOpacity.toFixed(3)}`;
          }

          // Foreground content layer: moves upward faster and fades out
          if (heroFgRef.current) {
            const fgY = progress * -40; // floats upward at accelerated pace
            const fgOpacity = Math.max(0, 1 - progress * 1.45);
            heroFgRef.current.style.transform = `translate3d(0, ${fgY.toFixed(2)}%, 0)`;
            heroFgRef.current.style.opacity = `${fgOpacity.toFixed(3)}`;
            heroFgRef.current.style.pointerEvents = progress > 0.85 ? 'none' : 'auto';
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Track active section for navbar indicators
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasDimensions);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Contact', id: 'contact' },
  ];

  // Arc math calculations for Concentric Arcs centered at (-110, 300)
  const CX = -110;
  const CY = 300;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const heroBgPosition = isDesktop
    ? 'calc(50% + clamp(140px, 16vw, 290px)) 16%'
    : 'center 12%';

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white tracking-[-0.02em] font-helvetica-neue selection:bg-red-500/30 selection:text-white"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* 1. Fixed Glassmorphism Navbar (z-50) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:justify-center p-4 sm:p-5 pointer-events-none">
        {/* Mobile Navbar Header (<md) */}
        <div className="md:hidden flex items-center justify-between w-full pointer-events-auto">
          {/* Logo pill */}
          <button
            type="button"
            onClick={() => scrollTo('home')}
            className="bg-black/60 backdrop-blur-md rounded-full px-3.5 py-2 flex items-center shadow-lg border border-white/10 nav-drop cursor-pointer"
            aria-label="Scroll to home"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 256 256"
              fill="white"
              className="shrink-0"
              aria-label="Logo"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </button>

          {/* Hamburger toggle pill */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="bg-black/60 backdrop-blur-md rounded-full p-2.5 text-white shadow-lg border border-white/10 hover:bg-black/80 transition-colors cursor-pointer nav-drop focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Desktop Navbar (md+): Centered glassmorphism pill */}
        <div className="hidden md:flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full pl-3 pr-2 py-2 shadow-2xl border border-white/10 nav-drop pointer-events-auto">
          {/* 22x22 Geometric SVG Logo */}
          <button
            type="button"
            onClick={() => scrollTo('home')}
            className="cursor-pointer focus:outline-none"
            aria-label="Nayan Vishwakarma Portfolio"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 256 256"
              fill="white"
              className="shrink-0 mr-1"
              aria-label="Logo"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
          </button>

          {/* Navigation text links */}
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/15 shadow-inner'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}




          {/* White CTA "Let's Connect" */}
          <button
            type="button"
            onClick={() => scrollTo('contact')}
            className="bg-white text-gray-900 text-sm font-semibold px-5 py-1.5 rounded-full hover:bg-gray-100 ml-1 transition-all duration-150 cursor-pointer active:scale-95 shadow-sm"
          >
            Let's Connect
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown (<md) */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 right-0 z-40 pt-16 pb-6 px-5 bg-neutral-900/95 backdrop-blur-xl shadow-2xl md:hidden flex flex-col border-b border-white/10 transition-all">
          <div className="flex flex-col mt-4">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`py-3 border-b border-white/10 text-left font-medium text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  activeSection === item.id
                    ? 'text-white font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-gray-500 text-xs">0{idx + 1}</span>
              </button>
            ))}




            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="bg-white text-gray-900 text-sm font-semibold py-3 px-5 rounded-full text-center mt-5 active:scale-95 transition-transform cursor-pointer shadow-md"
            >
              Let's Connect
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1 — HERO CONTAINER WITH SCROLL-BASED BACKGROUND SEPARATION TRACK */}
      <div
        id="home"
        ref={heroWrapperRef}
        className="relative w-full h-[145vh] sm:h-[155vh]"
      >
        {/* Sticky 100dvh Hero Stage */}
        <section
          ref={heroStageRef}
          className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-neutral-950 select-none z-10"
        >
          {/* SEPARATION LAYER A: BACKGROUND IMAGE & PARALLAX GRID */}
          <div
            ref={heroBgRef}
            className="absolute inset-0 w-full h-full will-change-transform origin-center pointer-events-none"
          >
            {/* Layer 1: Grid background (z-0) with mouse parallax */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ opacity: 0.1 }}
              aria-hidden="true"
            >
              <defs>
                <pattern
                  ref={patternRef}
                  id="grid-pattern"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                >
                  <path
                    d="M 48 0 L 0 0 0 48"
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="0.6"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>

            {/* Layer 2: Base profile.png background image with Ken Burns intro positioned beside text */}
            <div
              className="absolute inset-0 bg-cover ken-burns pointer-events-none z-10"
              style={{
                backgroundImage: `url(${PROFILE_IMAGE})`,
                backgroundPosition: heroBgPosition,
              }}
            />

            {/* Red / Dark Cinematic Overlays: Pure dark contrast on left for text, clear window on right for portrait */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/75 via-45% to-transparent pointer-events-none z-15" />
            <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none z-15" />
            {/* Subtle fiery red & vibrant orange atmospheric rim wash */}
            <div className="absolute -top-20 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-red-600/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none z-15 rounded-full" />
            <div className="absolute bottom-0 right-10 w-[400px] h-[350px] bg-gradient-to-t from-orange-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none z-15 rounded-full" />

            {/* Layer 3: Interactive cursor spotlight reveal layer (z-30) positioned identically beside text */}
            <div
              ref={revealDivRef}
              className="absolute inset-0 bg-cover pointer-events-none z-30"
              style={{
                backgroundImage: `url(${PROFILE_IMAGE})`,
                backgroundPosition: heroBgPosition,
                filter: 'contrast(1.15) brightness(1.1)',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
          </div>

          {/* SEPARATION LAYER B: INDEPENDENT FOREGROUND CONTENT */}
          <div
            ref={heroFgRef}
            className="absolute inset-0 w-full h-full will-change-transform z-40 pointer-events-none"
          >
            {/* Layer 4: Stats on fading circular arcs (z-50, hidden below sm) */}
            <div className="absolute inset-y-0 right-0 pointer-events-none hidden sm:block z-50 h-full w-auto">
              <svg
                viewBox="0 0 380 700"
                preserveAspectRatio="xMaxYMid meet"
                className="h-full w-auto"
                aria-hidden="true"
              >
                <defs>
                  {ARCS_CONFIG.map((arc, i) => {
                    const startX = CX + arc.r * Math.cos(toRad(arc.startDeg));
                    const startY = CY + arc.r * Math.sin(toRad(arc.startDeg));
                    const endX = CX + arc.r * Math.cos(toRad(arc.endDeg));
                    const endY = CY + arc.r * Math.sin(toRad(arc.endDeg));

                    return (
                      <linearGradient
                        key={`arc-grad-${arc.r}`}
                        id={`arc-grad-${i}`}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="22%" stopColor="#ffffff" stopOpacity="0.5" />
                        <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
                        <stop offset="85%" stopColor="#ffffff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    );
                  })}
                </defs>

                {ARCS_CONFIG.map((arc, i) => {
                  const startX = CX + arc.r * Math.cos(toRad(arc.startDeg));
                  const startY = CY + arc.r * Math.sin(toRad(arc.startDeg));
                  const endX = CX + arc.r * Math.cos(toRad(arc.endDeg));
                  const endY = CY + arc.r * Math.sin(toRad(arc.endDeg));

                  const deltaRad = toRad(Math.abs(arc.endDeg - arc.startDeg));
                  const arcLength = arc.r * deltaRad;

                  const lineDelay = 0.4 + i * 0.22;
                  const markDelay = lineDelay + 0.9;

                  const dotX = CX + arc.r * Math.cos(toRad(arc.dotDeg));
                  const dotY = CY + arc.r * Math.sin(toRad(arc.dotDeg));

                  const pathD = `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${arc.r} ${arc.r} 0 0 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;

                  return (
                    <g key={`arc-group-${arc.r}`}>
                      {/* Fading Arc Path */}
                      <path
                        d={pathD}
                        stroke={`url(#arc-grad-${i})`}
                        strokeWidth="1.1"
                        fill="none"
                        className="arc-line"
                        style={
                          {
                            '--len': `${arcLength.toFixed(1)}px`,
                            animationDelay: `${lineDelay}s`,
                          } as React.CSSProperties
                        }
                      />

                      {/* Dot Position: filled orange circle r=3.4 */}
                      <circle
                        cx={dotX}
                        cy={dotY}
                        r={3.4}
                        fill="#f97316"
                        className="arc-dot"
                        style={{ animationDelay: `${markDelay}s` }}
                      />

                      {/* Dot Position: red ring r=7 with pulseRing */}
                      <circle
                        cx={dotX}
                        cy={dotY}
                        r={7}
                        stroke="#ef4444"
                        strokeWidth="1.2"
                        fill="none"
                        opacity="0.6"
                        className="arc-ring"
                        style={{ animationDelay: `${markDelay + 0.3}s` }}
                      />

                      {/* Stat Number at dot+(16,4) in white 32px */}
                      <text
                        x={dotX + 16}
                        y={dotY + 4}
                        fill="#ffffff"
                        fontSize="32"
                        fontWeight="700"
                        className="arc-text font-bold"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          animationDelay: `${markDelay + 0.15}s`,
                        }}
                      >
                        {arc.num}
                        {arc.suffix && (
                          <tspan fontSize="19" dy="-10" letterSpacing="-1px">
                            {arc.suffix}
                          </tspan>
                        )}
                      </text>

                      {/* Uppercase Label at dot+(18,22), 8.5px, weight 600 */}
                      <text
                        x={dotX + 18}
                        y={dotY + 22}
                        fill="#ffffff"
                        fillOpacity="0.8"
                        fontSize="8.5"
                        fontWeight="600"
                        letterSpacing="2px"
                        className="arc-text font-semibold uppercase"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          animationDelay: `${markDelay + 0.3}s`,
                        }}
                      >
                        {arc.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Layer 5: Hero text block (z-50) positioned on the left beside the portrait */}
            <div className="absolute bottom-8 sm:bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 left-5 sm:left-8 md:left-12 lg:left-16 max-w-[320px] sm:max-w-md lg:max-w-[460px] z-50 pointer-events-auto">
              {/* Eyebrow */}
              <div
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] text-white/90 uppercase mb-3 sm:mb-4 hero-rise"
                style={{ animationDelay: '0.15s' }}
              >
                HELLO, I'M <span className="text-white font-bold">NAYAN VISHWAKARMA</span>
              </div>

              {/* Multiline H1: Building Digital Experiences. */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] text-white font-bold mb-4 sm:mb-5 hero-rise"
                style={{ animationDelay: '0.3s' }}
              >
                Building <br /> Digital <br /> Experiences.
              </h1>

              {/* Supporting paragraph */}
              <p
                className="text-sm sm:text-base text-white/90 leading-relaxed font-normal mb-4 sm:mb-5 hero-rise"
                style={{ animationDelay: '0.5s' }}
              >
                I'm a Computer Science undergraduate and Frontend Developer passionate about creating responsive, interactive, and user-friendly web experiences.
              </p>

              {/* Availability / Status Line */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-emerald-500/30 backdrop-blur-md mb-6 sm:mb-7 hero-rise"
                style={{ animationDelay: '0.6s' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.12em] text-emerald-400 font-semibold uppercase">
                  OPEN TO FRONTEND DEVELOPER INTERNSHIP OPPORTUNITIES
                </span>
              </div>

              {/* CTAs: Explore My Work + Let's Connect */}
              <div
                className="flex flex-wrap items-center gap-3 sm:gap-4 hero-rise"
                style={{ animationDelay: '0.7s' }}
              >
                {/* Primary CTA: Explore My Work */}
                <button
                  type="button"
                  onClick={() => scrollTo('projects')}
                  className="group relative inline-flex items-center justify-center px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white text-gray-900 font-semibold text-sm sm:text-base shadow-lg shadow-black/20 overflow-hidden cursor-pointer hover:scale-[1.04] active:scale-95 transition-transform duration-200"
                >
                  <span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Explore My Work
                    <ArrowUpRight size={16} />
                  </span>
                </button>

                {/* Secondary CTA: Let's Connect */}
                <button
                  type="button"
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black/60 border border-white/20 text-white font-medium text-sm sm:text-base backdrop-blur-md hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
                >
                  Let's Connect
                </button>

              </div>
            </div>

            {/* Scroll indicator chevron */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 hidden sm:flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => scrollTo('about')}
                className="flex flex-col items-center text-[10px] uppercase tracking-widest text-white/70 hover:text-white cursor-pointer"
                aria-label="Scroll to about section"
              >
                <span>SCROLL</span>
                <span className="animate-bounce mt-1">↓</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 2 — ABOUT ME (Opaque background rises and covers the hero) */}
      <section
        id="about"
        className="relative w-full bg-[#07070b] border-t border-orange-500/20 py-24 sm:py-32 px-5 sm:px-8 md:px-12 z-30 shadow-[0_-25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Ambient fiery red and warm vibrant orange digital glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-br from-red-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[300px] bg-gradient-to-tr from-orange-600/10 via-red-900/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">// 01</span>
            <span className="text-gray-500">·</span>
            <span className="text-orange-400/90 font-mono">PROFILE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Heading, Introduction & Education */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                  A LITTLE ABOUT ME
                </h2>
                <div className="space-y-4 text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                  <p>
                    I'm <strong className="text-white font-semibold">Nayan Vishwakarma</strong>, a Computer Science undergraduate and dedicated Frontend Developer. I build responsive, interactive, and user-friendly digital web interfaces designed for practical usability.
                  </p>
                  <p>
                    My approach combines a deep focus on core web technologies—semantic HTML5, modern CSS3 layouts, and dynamic JavaScript—with an eye for clean aesthetics and reliable client-side performance.
                  </p>
                </div>
              </div>

              {/* Education Structured Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900/90 border border-white/15 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-gray-400 uppercase tracking-wider">
                    <GraduationCap size={16} className="text-red-400" />
                    <span>Education Credentials</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    B.Tech CSE
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Institution</div>
                    <div className="text-xl font-bold text-white mt-0.5">Medi-Caps University</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Degree Program</div>
                      <div className="text-sm font-semibold text-white">B.Tech in Computer Science Engineering</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Academic Score</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-white">8.44</span>
                        <span className="text-xs text-gray-400 font-mono">/ 10.0 CGPA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Profile Information Panel */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-white/15 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                    CORE_PILLARS // FOCUS
                  </span>
                  <span className="text-red-400 text-xs font-mono">SYS_OK</span>
                </div>

                {/* Pillar 1: Frontend Development Interests */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Code2 size={16} className="text-red-400" />
                    <span>Frontend Development Interests</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Crafting responsive, mobile-first layouts using CSS Grid and Flexbox, paired with accessible HTML structure and clean code hierarchy.
                  </p>
                </div>

                {/* Pillar 2: Problem-Solving */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Cpu size={16} className="text-red-400" />
                    <span>Problem-Solving</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Structuring clear logic for event handlers, dynamic DOM manipulation, and interactive state management to solve tangible user challenges.
                  </p>
                </div>

                {/* Pillar 3: Building Practical Web Applications */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Layers size={16} className="text-red-400" />
                    <span>Building Practical Web Applications</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Engineering real-world tools—such as interview dashboards and bug issue triage systems—that provide instant functional value.
                  </p>
                </div>

                {/* Pillar 4: Continuous Learning */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <BookOpen size={16} className="text-red-400" />
                    <span>Continuous Learning</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    Continuously refining development workflows, adopting industry best practices, and learning through team collaboration and hands-on builds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TECH STACK (TOOLS I WORK WITH) */}
      <section
        id="skills"
        className="relative w-full bg-[#08080d] border-t border-orange-500/20 py-24 sm:py-32 px-5 sm:px-8 md:px-12 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Ambient fiery red and warm vibrant orange digital glows */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[350px] bg-gradient-to-br from-orange-500/15 via-red-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[320px] bg-gradient-to-tl from-red-600/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">// 02</span>
            <span className="text-gray-500">·</span>
            <span className="text-orange-400/90 font-mono">TECH STACK</span>
          </div>

          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              TOOLS I WORK WITH
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              Demonstrated technical proficiencies actively applied across academic projects, open collaboration, and internship deliverables.
            </p>
          </div>

          {/* Structured Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Frontend Column (7 cols) */}
            <div className="md:col-span-7 p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                      <Code2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Frontend Core</h3>
                      <p className="text-xs text-gray-400">Core web technologies</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">7 MODULES</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      name: 'HTML5',
                      desc: 'Semantic structure, accessible markup, document hierarchy',
                    },
                    {
                      name: 'CSS3',
                      desc: 'Modern layout styling, transitions, responsive visuals',
                    },
                    {
                      name: 'JavaScript',
                      desc: 'ES6+ syntax, asynchronous operations, interactive logic',
                    },
                    {
                      name: 'DOM Manipulation',
                      desc: 'Dynamic rendering, event delegation, active UI updates',
                    },
                    {
                      name: 'CSS Grid',
                      desc: 'Multi-track responsive architectures & complex layouts',
                    },
                    {
                      name: 'Responsive Design',
                      desc: 'Mobile-first adaptation, media queries, flexible viewports',
                    },
                    {
                      name: 'LocalStorage',
                      desc: 'Client-side persistence & browser state caching',
                    },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1">
                        <CheckCircle2 size={15} className="text-red-400 shrink-0" />
                        <span>{skill.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tools Column (5 cols) */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-white/15 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Tools & Workflow</h3>
                      <p className="text-xs text-gray-400">Version control & environment</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">3 TOOLS</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Git',
                      role: 'Version Control',
                      detail: 'Local branch management, staging, commit records, and history auditing.',
                    },
                    {
                      name: 'GitHub',
                      role: 'Team Collaboration',
                      detail: 'Remote repository management, issue tracking, PR reviews, and GitHub Pages deployments.',
                    },
                    {
                      name: 'VS Code',
                      role: 'Code Editor',
                      detail: 'Efficient workspace setups, syntax linting, integrated terminal, and debugging tools.',
                    },
                  ].map((tool) => (
                    <div
                      key={tool.name}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white font-semibold text-sm flex items-center gap-2">
                          <Terminal size={14} className="text-red-400" />
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                          {tool.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {tool.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Stack notice */}
              <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-xs text-gray-300 font-mono">
                <span className="text-red-400 font-bold mr-1.5">TRANSPARENCY:</span>
                Listed tools represent verified, active development competencies without artificial metrics.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SELECTED PROJECTS (THINGS I'VE BUILT) */}
      <section
        id="projects"
        className="relative w-full bg-[#07070a] border-t border-orange-500/20 py-24 sm:py-32 px-5 sm:px-8 md:px-12 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Ambient fiery red and warm vibrant orange digital glows */}
        <div className="absolute top-10 right-1/3 w-[600px] h-[400px] bg-gradient-to-br from-red-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[350px] bg-gradient-to-tr from-orange-600/15 via-amber-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">// 03</span>
            <span className="text-gray-500">·</span>
            <span className="text-orange-400/90 font-mono">SHOWCASE</span>
          </div>

          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              THINGS I'VE BUILT
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              An editorial selection of web builds and collaborative repositories demonstrating frontend engineering, UI interactivity, and problem-solving.
            </p>
          </div>

          {/* Editorial Project Layout */}
          <div className="space-y-10">
            {/* Project 01 — InterViewAce (Featured Highlight) */}
            <div className="p-7 sm:p-10 rounded-3xl bg-neutral-900/90 border border-white/15 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
                      01 // FEATURED APPLICATION
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE DEMO AVAILABLE
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-red-400 transition-colors">
                    InterViewAce
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                    An interview preparation web application designed to help job seekers practice questions, track preparation milestones, and simulate interview readiness with a dedicated, responsive candidate dashboard.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {['HTML5', 'CSS3', 'JavaScript', 'DOM Manipulation', 'LocalStorage', 'Responsive UI'].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <a
                      href="https://nayan2427.github.io/InterViewAce/dashboard.html"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-900 font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer shadow-md"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href="https://github.com/nayan2427/InterViewAce"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-black/60 border border-white/20 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Github size={15} />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/10">
                      SYSTEM ARCHITECTURE // HIGHLIGHTS
                    </div>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-mono">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>Interactive candidate dashboard with persistent progress</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>Categorized question banks with responsive filters</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>LocalStorage data caching for seamless session recall</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 02 — Bug Issue Tracker */}
            <div className="p-7 sm:p-10 rounded-3xl bg-neutral-900/90 border border-white/15 relative overflow-hidden group hover:border-red-500/40 transition-all duration-300 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest">
                      02 // COLLABORATIVE REPOSITORY
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      TEAM COLLABORATION
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-red-400 transition-colors">
                    Bug Issue Tracker
                  </h3>

                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
                    A collaborative web development system built to streamline bug reporting and issue tracking. Contributed directly to the core issue management UI, designing intuitive Delete interactions and bulk Clear All functionality.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {['JavaScript', 'HTML5', 'CSS3', 'DOM Manipulation', 'Git Collaboration'].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-3 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3">
                    <a
                      href="https://github.com/rudraanjaneyax-cloud/Bug-Issue-Tracker"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-900 font-semibold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors cursor-pointer shadow-md"
                    >
                      <Github size={15} />
                      <span>View GitHub Repository</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-4">
                    <div className="text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/10">
                      CONTRIBUTIONS BREAKDOWN
                    </div>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-mono">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>Responsive issue triage UI and card layouts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>Individual issue deletion with DOM state sync</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">▹</span>
                        <span>Clear All confirmation and bulk collection purging</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Row for Projects 03 & 04 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Project 03 — SchemeSaathi AI */}
              <div className="p-7 sm:p-8 rounded-3xl bg-neutral-900/90 border border-white/15 flex flex-col justify-between group hover:border-red-500/40 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                      03 // AI INITIATIVE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      IN DEVELOPMENT
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    SchemeSaathi AI
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    An AI-powered scholarship guidance platform engineering scholarship discovery, eligibility guidance, and document readiness analysis for prospective applicants.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Scholarship Discovery', 'Eligibility Engine', 'Document Readiness', 'Frontend UI'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>STATUS: Architecture Phase</span>
                  <span className="text-amber-400">Active Build</span>
                </div>
              </div>

              {/* Project 04 — C++ OS Simulation Suite */}
              <div className="p-7 sm:p-8 rounded-3xl bg-neutral-900/90 border border-white/15 flex flex-col justify-between group hover:border-red-500/40 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                      04 // CORE COMPUTER SCIENCE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      SYSTEMS PROJECT
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                    C++ OS Simulation Suite
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed font-light">
                    An operating systems concepts and systems simulation suite modeling CPU process scheduling algorithms (FCFS, SJF, Round Robin), virtual memory paging, and deadlock handling.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['C++', 'Process Scheduling', 'Memory Management', 'Algorithms'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>CONCEPTS: Systems Engineering</span>
                  <span className="text-purple-400">Algorithmic Suite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — EXPERIENCE (MY EXPERIENCE) */}
      <section
        id="experience"
        className="relative w-full bg-[#08080d] border-t border-orange-500/20 py-24 sm:py-32 px-5 sm:px-8 md:px-12 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Ambient fiery red and warm vibrant orange digital glows */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[350px] bg-gradient-to-br from-red-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-gradient-to-tl from-orange-600/15 via-red-900/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">// 04</span>
            <span className="text-gray-500">·</span>
            <span className="text-orange-400/90 font-mono">TIMELINE</span>
          </div>

          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              MY EXPERIENCE
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
              Hands-on internship history contributing to frontend development, user interface features, and digital search optimization.
            </p>
          </div>

          {/* Clean Vertical Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l border-white/15 space-y-12">
            {/* Experience 01 — AnjaneyaX */}
            <div className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-neutral-950 border-2 border-red-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-red-500/40 transition-colors shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider block mb-1">
                      EXPERIENCE 01
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      Web Developer Intern
                    </h3>
                    <div className="text-sm font-semibold text-gray-300">
                      AnjaneyaX
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 w-fit">
                    <Calendar size={13} className="text-red-400" />
                    <span>June 2026 – August 2026</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed font-light">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Collaborated on the <strong className="text-white font-medium">Bug Issue Tracker</strong> web application within a team git workflow.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Contributed to frontend functionality, engineering intuitive layouts for issue logging, status changes, and list displays.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Implemented core issue management features including <strong className="text-white font-medium">Delete functionality</strong> and <strong className="text-white font-medium">Clear All functionality</strong>.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Experience 02 — EVEPAPER */}
            <div className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-neutral-950 border-2 border-red-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-red-500/40 transition-colors shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-wider block mb-1">
                      EXPERIENCE 02
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      SEO & Content Intern
                    </h3>
                    <div className="text-sm font-semibold text-gray-300">
                      EVEPAPER
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 w-fit">
                    <Calendar size={13} className="text-red-400" />
                    <span>June 2026 – September 2026</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed font-light">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Audited and improved website SEO health scores using industry diagnostic tools.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Researched, drafted, and optimized digital content for target keyword ranking and reader retention.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 mt-1">▹</span>
                    <span>
                      Configured semantic page structures, heading hierarchies, and metadata for search discoverability.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CONTACT (LET'S BUILD SOMETHING TOGETHER) */}
      <section
        id="contact"
        className="relative w-full bg-[#07070a] border-t border-orange-500/20 py-24 sm:py-32 px-5 sm:px-8 md:px-12 z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Ambient fiery red and warm vibrant orange digital glows */}
        <div className="absolute top-10 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-red-600/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-gradient-to-tr from-orange-600/15 via-amber-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">// 05</span>
            <span className="text-gray-500">·</span>
            <span className="text-orange-400/90 font-mono">TRANSMISSION</span>
          </div>

          <div className="max-w-3xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              LET'S BUILD SOMETHING TOGETHER.
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-light">
              I am actively open to <strong className="text-white font-medium">Frontend Developer Internship opportunities</strong>, collaborative team projects, and frontend web development roles. Reach out through my verified channels below:
            </p>
          </div>

          {/* Verified Social & Professional Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nvishwa2006/"
              target="_blank"
              rel="noreferrer"
              className="p-6 sm:p-7 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-red-500/50 hover:bg-neutral-900 transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-5 group-hover:scale-110 transition-transform">
                  <Linkedin size={22} />
                </div>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                  Professional Network
                </div>
                <div className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                  LinkedIn
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-6 pt-3 border-t border-white/10">
                <span>/in/nvishwa2006</span>
                <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/nayan2427"
              target="_blank"
              rel="noreferrer"
              className="p-6 sm:p-7 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-red-500/50 hover:bg-neutral-900 transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="p-3 rounded-xl bg-white/10 text-white border border-white/20 w-fit mb-5 group-hover:scale-110 transition-transform">
                  <Github size={22} />
                </div>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                  Code Repositories
                </div>
                <div className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                  GitHub
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-6 pt-3 border-t border-white/10">
                <span>@nayan2427</span>
                <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </a>

            {/* LeetCode */}
            <a
              href="https://leetcode.com/u/Nayan24272006/"
              target="_blank"
              rel="noreferrer"
              className="p-6 sm:p-7 rounded-2xl bg-neutral-900/90 border border-white/15 hover:border-red-500/50 hover:bg-neutral-900 transition-all duration-300 group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-5 group-hover:scale-110 transition-transform">
                  <Code2 size={22} />
                </div>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                  Problem Solving
                </div>
                <div className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                  LeetCode
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-6 pt-3 border-t border-white/10">
                <span>@Nayan24272006</span>
                <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </a>
          </div>

          {/* Direct CTA Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 border border-orange-500/30 text-center relative overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.15)]">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono bg-gradient-to-r from-red-500/15 to-orange-500/15 text-orange-400 border border-orange-500/40">
                ACTIVE OPPORTUNITIES
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to collaborate on frontend initiatives?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                Message me directly on LinkedIn to discuss internship roles, frontend contributions, or innovative web development ideas.
              </p>
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://www.linkedin.com/in/nvishwa2006/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-gray-900 font-semibold text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer"
                >
                  <Linkedin size={18} />
                  <span>Connect on LinkedIn</span>
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Global Cyberpunk Footer */}
      <footer className="w-full py-12 px-5 sm:px-8 md:px-12 border-t border-orange-500/20 bg-black text-xs text-gray-400 font-mono z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 256 256"
              fill="white"
              className="shrink-0"
              aria-label="Logo"
            >
              <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
            </svg>
            <span>NAYAN VISHWAKARMA // FRONTEND DEVELOPER</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">

            <span>MEDI-CAPS UNIVERSITY // 8.44 CGPA</span>
            <button
              type="button"
              onClick={() => scrollTo('home')}
              className="inline-flex items-center gap-1.5 text-white hover:text-red-400 transition-colors cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ChevronUp size={14} />
            </button>
          </div>
        </div>
      </footer>


    </div>
  );
}
