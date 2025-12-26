import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Microscope, Baby, Bone, Eye, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  { id: '1', title: 'Cardiology', description: 'Advanced heart care with real-time AI rhythm monitoring and preventative screening.', icon: Heart },
  { id: '2', title: 'Neurology', description: 'Comprehensive diagnosis for neurological disorders using state-of-the-art imaging.', icon: Brain },
  { id: '3', title: 'Pediatrics', description: 'Compassionate, specialized care for infants, children, and adolescents.', icon: Baby },
  { id: '4', title: 'Orthopedics', description: 'Restoring mobility with expert surgical precision and non-surgical rehabilitation.', icon: Bone },
  { id: '5', title: 'Laboratory', description: 'High-precision automated diagnostics with rapid 2-hour result turnaround.', icon: Microscope },
  { id: '6', title: 'Ophthalmology', description: 'Next-generation vision care and advanced laser eye surgery services.', icon: Eye },
];

export const Services: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden" id="services">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-primary-600 font-bold tracking-wider text-sm uppercase mb-3"
            >
              Departments
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-slate-900"
            >
              Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">Excellence</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-sm text-lg leading-relaxed"
          >
            Our specialized departments are led by industry veterans to ensure effective, personalized treatment.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 overflow-hidden"
            >
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-primary-200 group-hover:text-primary-600 group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                  {service.description}
                </p>
                
                <div className="mt-8 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-primary-500 group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};