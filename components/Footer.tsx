import React from 'react';
import { Activity, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                 <Activity size={18} />
               </div>
               <span className="text-xl font-display font-bold text-slate-900">AuraHealth</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Pioneering the future of healthcare with advanced technology and compassionate care.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Emergency Care'].map(item => (
                <li key={item}><a href="#" className="hover:text-primary-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              {['About Us', 'Careers', 'Doctors', 'Blog', 'Contact'].map(item => (
                <li key={item}><a href="#" className="hover:text-primary-600 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2025 Aura Health Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};