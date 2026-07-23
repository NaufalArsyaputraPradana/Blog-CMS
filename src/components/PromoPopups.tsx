"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Rocket, ArrowRight, Sparkles } from 'lucide-react';

export default function PromoPopups() {
  const [showSmall, setShowSmall] = useState(false);
  const [showLarge, setShowLarge] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const pathname = usePathname();

  // 1. Small Popup: Timed Slide-in
  useEffect(() => {
    let smallTimeoutId: NodeJS.Timeout;

    if (pathname === '/' && !localStorage.getItem('promo_closed')) {
      setShowSmall(false);
      smallTimeoutId = setTimeout(() => {
        setShowSmall(true);
      }, 3500); // Tampil setelah 3.5 detik untuk experience yg lebih smooth
    } else {
      setShowSmall(false);
    }

    return () => {
      if (smallTimeoutId) clearTimeout(smallTimeoutId);
    };
  }, [pathname]);

  // 2. Large Popup: TRUE Exit Intent (Mouse leave top viewport)
  const onMouseLeave = useCallback((e: MouseEvent) => {
    // Deteksi jika kursor keluar dari batas atas layar (indikasi mau close tab)
    if (e.clientY <= 0) {
      if (pathname === '/' && !sessionStorage.getItem('large_promo_closed') && !showLarge) {
        setShowLarge(true);
        startCountdown();
      }
    }
  }, [showLarge, pathname]);

  useEffect(() => {
    document.addEventListener('mouseleave', onMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseLeave]);

  const startCountdown = () => {
    let count = 5;
    setTimeLeft(count);
    const interval = setInterval(() => {
      count--;
      setTimeLeft(Math.max(0, count));
      if (count <= 0) {
        clearInterval(interval);
        handleCloseLarge();
      }
    }, 1000);
  };

  const handleCloseSmall = () => {
    setShowSmall(false);
    localStorage.setItem('promo_closed', 'true');
  };

  const handleCloseLarge = () => {
    setShowLarge(false);
    sessionStorage.setItem('large_promo_closed', 'true');
  };

  return (
    <>
      {/* 🌟 IMPROVISED SMALL POPUP */}
      <div 
        className={`fixed bottom-8 left-8 z-[60] w-[340px] hidden md:block transition-all duration-700 ease-out ${
          showSmall ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative bg-[#0f172a]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden group">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <button 
            onClick={handleCloseSmall} 
            className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 p-1.5 rounded-full z-10 transition-all"
          >
            <X size={14} />
          </button>

          <div className="relative z-10 flex gap-4 items-start">
            <div className="relative flex-shrink-0 mt-1">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 duration-1000"></div>
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Sparkles size={18} className="animate-pulse" />
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-white font-semibold text-sm tracking-wide mb-1.5">Explore More!</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Tertarik melihat eksperimen desain dan solusi inovatif dari karya saya yang lain?
              </p>
              <a 
                href="https://naufalarsyaputrapradana.github.io/other-project" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleCloseSmall}
                className="group/btn flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold text-center rounded-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Lihat Proyek Lainnya</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 IMPROVISED LARGE EXIT INTENT POPUP */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-700 ${
          showLarge ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Deep blur backdrop */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/60" onClick={handleCloseLarge}></div>
        
        <div 
          className={`relative w-full max-w-xl bg-[#0a0a0f] border border-blue-500/30 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_-15px_rgba(79,70,229,0.4)] overflow-hidden transition-transform duration-700 ease-out ${
            showLarge ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
          }`}
        >
          {/* Dramatic lighting effects */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
          
          <button 
            onClick={handleCloseLarge} 
            className="absolute top-6 right-6 text-slate-400 hover:text-white z-10 transition-colors w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
          >
            <X size={20} />
          </button>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/40 relative z-10">
                <Rocket className="w-10 h-10 animate-bounce" />
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4 tracking-tight">
              Tunggu Sebentar!
            </h3>
            <p className="text-slate-300 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
              Saya memiliki banyak proyek menarik lainnya yang mungkin bisa memberikan Anda inspirasi. Cek halaman karya saya selengkapnya!
            </p>
            
            <a 
              href="https://naufalarsyaputrapradana.github.io/other-project" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleCloseLarge}
              className="group/link relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">Lihat Proyek Lainnya</span>
              <ArrowRight size={18} className="relative z-10 group-hover/link:translate-x-1 transition-transform" />
            </a>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
              Popup ini akan tertutup otomatis dalam 
              <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">{timeLeft}</span> 
              detik
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
