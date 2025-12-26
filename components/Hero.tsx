import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, CalendarCheck, Shield } from 'lucide-react';
import { AppSection } from '../types';

interface HeroProps {
  scrollToSection: (section: AppSection) => void;
}

export const Hero: React.FC<HeroProps> = ({ scrollToSection }) => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImage = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Clean background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-slate-50 to-white opacity-80" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Voted #1 Clinic in 2024
          </div>

          <h1 className="text-6xl lg:text-8xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]">
            Healing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-400">
              Redefined.
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-light">
            We combine compassionate human care with advanced AI diagnostics to provide a healthcare experience that is faster, smarter, and entirely centered around you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => scrollToSection(AppSection.CONTACT)}
              className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-2xl shadow-slate-900/20 group"
            >
              Book Consultation
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection(AppSection.ABOUT)}
              className="px-8 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Meet Our Team
            </button>
          </div>
          
          <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Shield size={16} /> Insurance Accepted
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck size={16} /> Same-day Booking
            </div>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          style={{ y: yImage }}
          className="relative hidden lg:block h-[800px] w-full"
        >
          <div className="absolute right-0 top-10 w-[90%] h-[90%] bg-primary-900 rounded-[4rem] rotate-3 opacity-5" />
          <div className="absolute right-4 top-14 w-[90%] h-[90%] bg-slate-900 rounded-[4rem] -rotate-2 opacity-5" />
          
          <div className="relative w-full h-full rounded-[4rem] overflow-hidden shadow-2xl shadow-primary-900/10 border-4 border-white">
             <img 
               src="https://picsum.photos/id/435/900/1100"
               alt="Modern Hospital Interior" 
               className="w-full h-full object-cover"
             />
             
             {/* Glass Cards */}
             <div className="absolute bottom-12 left-12 right-12 flex gap-4">
                <div className="flex-1 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
                   <p className="text-3xl font-display font-bold text-slate-900">4.9/5</p>
                   <p className="text-xs text-slate-500 font-medium uppercase mt-1">Patient Rating</p>
                </div>
                <div className="flex-1 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-white border border-white/10">
                   <p className="text-3xl font-display font-bold">15m</p>
                   <p className="text-xs text-slate-400 font-medium uppercase mt-1">Avg Wait Time</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};