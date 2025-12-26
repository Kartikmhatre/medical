import React from 'react';
import { motion } from 'framer-motion';

// Tags for the Marquee
const tags = [
  "AI-POWERED DIAGNOSTICS", "•",
  "24/7 EMERGENCY CARE", "•",
  "BOARD CERTIFIED SPECIALISTS", "•",
  "TELEMEDICINE SUPPORT", "•",
  "ADVANCED PATHOLOGY LAB", "•",
  "ISO 9001 CERTIFIED", "•",
  "PATIENT-FIRST APPROACH", "•",
  "SAME DAY APPOINTMENTS", "•",
  "FDA APPROVED TECH", "•"
];

const Marquee = () => {
  return (
    <div className="relative w-full overflow-hidden bg-primary-900/50 border-b border-white/5 py-4 backdrop-blur-sm">
      <div className="flex">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-8 text-xs md:text-sm font-bold tracking-[0.2em] text-primary-200/80 uppercase"
        >
          {/* Duplicate tags to ensure seamless loop */}
          {[...tags, ...tags, ...tags, ...tags].map((tag, i) => (
            <span key={i} className={tag === "•" ? "text-primary-500/50" : ""}>{tag}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const Stats: React.FC = () => {
  const stats = [
    { value: '99%', label: 'Patient Satisfaction Score' },
    { value: '24/7', label: 'Virtual & On-site Support' },
    { value: '150+', label: 'Specialist Doctors' },
    { value: '12k', label: 'Successful Recoveries' }
  ];

  return (
    <section className="bg-slate-900 text-white relative overflow-hidden font-display">
      
      {/* Marquee Section */}
      <Marquee />

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/30 rounded-full blur-[128px]" />
        <div className="absolute left-10 bottom-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[96px]" />
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group cursor-default"
            >
              <div className="relative inline-block">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300 ease-out">
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 group-hover:to-white">
                    {stat.value}
                  </span>
                </div>
                {/* Underline decoration */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-300" />
              </div>
              <div className="text-sm font-medium text-primary-200/60 uppercase tracking-widest mt-4 group-hover:text-primary-200 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};