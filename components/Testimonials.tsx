import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Mother of two",
    text: "The pediatric department at Aura Health is simply unmatched. Dr. Hale and his team made my children feel so comfortable. The facility is spotless and modern.",
    image: "https://picsum.photos/id/1/100/100"
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    text: "The AI symptom checker gave me a quick heads-up on what might be wrong, and booking an appointment was instant. Efficient, modern, and caring.",
    image: "https://picsum.photos/id/2/100/100"
  },
  {
    name: "Emma Thompson",
    role: "Retired Teacher",
    text: "I've never felt more heard by a medical professional. They take the time to explain everything. It feels like a concierge service but accessible.",
    image: "https://picsum.photos/id/3/100/100"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Patient Stories</h2>
          <p className="text-slate-600">Don't just take our word for it. Here is what our community has to say about the Aura Health experience.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
            >
              <div className="flex gap-1 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 italic mb-8 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};