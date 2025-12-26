import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, Quote } from 'lucide-react';

export const MeetTheDoctor: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden" id="about">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-100 to-blue-50 rounded-full blur-3xl -z-10" />
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-[8px] border-white z-10">
              <img 
                src="https://picsum.photos/id/64/800/1000" 
                alt="Dr. Alexander Hale" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8 pt-24 text-white">
                <p className="font-display font-bold text-2xl">Dr. Alexander Hale</p>
                <p className="text-primary-200">Chief Medical Officer & Founder</p>
              </div>
            </div>
            
            {/* Hobbies Card */}
            <div className="hidden md:block absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100 z-20">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Outside the Clinic</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Heart size={16} /></div>
                  <span className="text-sm font-medium text-slate-700">Jazz Piano Enthusiast</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BookOpen size={16} /></div>
                  <span className="text-sm font-medium text-slate-700">Historical Literature</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider">
              <Award size={14} className="text-primary-600" />
              Meet the Expert
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
              Medicine is not just a science, it's an <span className="text-primary-600">art of empathy.</span>
            </h2>

            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                With over 20 years of experience in internal medicine and a passion for preventative care, I founded Aura Health with a simple mission: to bridge the gap between cutting-edge technology and the human touch.
              </p>
              <p>
                I believe that true healing begins when a patient feels heard. Our integration of AI isn't meant to replace the doctor, but to give us more time to do what we do best—listen, understand, and care for you as a whole person.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-12">
              <div>
                <p className="text-4xl font-display font-bold text-slate-900">20+</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-slate-900">15k+</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Surgeries Performed</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-slate-900">Top 1%</p>
                <p className="text-sm text-slate-500 font-medium mt-1">Medical Board Rating</p>
              </div>
            </div>

            <div className="pt-4">
               <Quote className="text-primary-200 fill-primary-100 w-12 h-12 mb-4" />
               <p className="text-slate-800 font-medium italic">
                 "Our goal isn't just to treat symptoms, but to engineer a lifestyle where illness has no room to thrive."
               </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};