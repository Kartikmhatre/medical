import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, ChevronRight } from 'lucide-react';
import { AppSection } from '../types';

interface NavbarProps {
  activeSection: AppSection;
  scrollToSection: (section: AppSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: AppSection.HOME, label: 'Home' },
    { id: AppSection.ABOUT, label: 'Doctor' },
    { id: AppSection.SERVICES, label: 'Services' },
    { id: AppSection.TESTIMONIALS, label: 'Stories' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => scrollToSection(AppSection.HOME)}
        >
          <div className="bg-slate-900 text-white p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300">
            <Activity size={22} />
          </div>
          <span className={`text-2xl font-display font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
            Aura<span className="text-primary-600">Health</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-semibold transition-all duration-300 relative group ${
                  activeSection === link.id
                    ? 'text-primary-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full ${activeSection === link.id ? 'w-full' : ''}`} />
              </button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-200" />

          <button 
            onClick={() => scrollToSection(AppSection.CONTACT)}
            className="group bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all hover:shadow-lg hover:shadow-primary-900/20 flex items-center gap-2"
          >
            Book Now
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl absolute w-full"
          >
            <div className="p-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    scrollToSection(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-lg font-medium text-left py-4 border-b border-slate-50 flex items-center justify-between ${
                     activeSection === link.id ? 'text-primary-600' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                  <ChevronRight size={16} className="opacity-30" />
                </button>
              ))}
              <button 
                onClick={() => {
                  scrollToSection(AppSection.CONTACT);
                  setIsMobileMenuOpen(false);
                }}
                className="bg-primary-600 text-white w-full py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-primary-600/20"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};