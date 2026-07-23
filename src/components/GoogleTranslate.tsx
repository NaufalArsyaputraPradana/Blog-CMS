"use client";

import React, { useEffect, useState } from 'react';

// Declare global to avoid TS errors
declare global {
  interface Window {
    googleTranslateElementInit2: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState('id');

  const drawFlag = (canvasId: string, lang: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (lang === 'id') {
        ctx.fillStyle = '#CE1126';
        ctx.fillRect(0, 0, w, h/2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, h/2, w, h/2);
    } else {
        // UK Flag simplified
        ctx.fillStyle = '#012169';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = h * 0.2;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(w, h);
        ctx.moveTo(w, 0); ctx.lineTo(0, h);
        ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
        ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
        ctx.stroke();
        ctx.strokeStyle = '#C8102E';
        ctx.lineWidth = h * 0.1;
        ctx.beginPath();
        ctx.moveTo(0, h/2); ctx.lineTo(w, h/2);
        ctx.moveTo(w/2, 0); ctx.lineTo(w/2, h);
        ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(0, 0, w, h);
  };

  useEffect(() => {
    // Inject Google Translate script only once
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit2 = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'id', autoDisplay: false },
            'google_translate_element2'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Draw initial flag
    drawFlag('flagCanvasGlobal', 'id');
  }, []);

  const doGTranslate = (langPair: string) => {
    if (!langPair) return;
    const lang = langPair.split('|')[1];
    
    const checkAndTranslate = (attempts = 0) => {
      const selects = document.getElementsByTagName('select');
      let found = false;
      for (let i = 0; i < selects.length; i++) {
        if (/goog-te-combo/.test(selects[i].className)) {
          selects[i].value = lang;
          // Harus menggunakan event bubbles agar terbaca oleh listener internal Google
          selects[i].dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
          found = true;
          break;
        }
      }
      
      // Jika belum ketemu, coba lagi hingga 10x (jeda 500ms)
      if (!found && attempts < 10) {
        setTimeout(() => checkAndTranslate(attempts + 1), 500);
      }
    };
    
    checkAndTranslate();
  };

  const toggleLanguage = () => {
    if (currentLang === 'id') {
      doGTranslate('id|en');
      setCurrentLang('en');
      drawFlag('flagCanvasGlobal', 'en');
    } else {
      doGTranslate('en|id');
      setCurrentLang('id');
      drawFlag('flagCanvasGlobal', 'id');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-2">
      {/* Hidden div required by Google Translate */}
      <div id="google_translate_element2" className="hidden"></div>
      
      {/* Floating Toggle Button (SaaS Aesthetic) */}
      <button 
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 border border-blue-500/30 shadow-2xl shadow-blue-900/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:border-blue-500/60 hover:scale-105 transition-all duration-300 text-sm font-bold text-slate-200 group"
        title="Ubah Bahasa / Translate"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-sm blur-[2px] opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <canvas id="flagCanvasGlobal" width="20" height="15" className="relative rounded-sm z-10"></canvas>
        </div>
        <span className="notranslate w-6 text-center">{currentLang === 'id' ? 'ID' : 'EN'}</span>
      </button>
    </div>
  );
}
