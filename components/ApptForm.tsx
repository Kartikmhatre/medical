import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const ApptForm: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6">Schedule Your Visit</h2>
            <p className="text-slate-600 text-lg mb-8">
              Booking an appointment has never been easier. Select your preferred time, department, and doctor, and we'll handle the rest.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: MapPin, title: "Central Clinic", text: "123 Healthcare Ave, New York, NY" },
                { icon: Clock, title: "Opening Hours", text: "Mon - Sat: 8:00 AM - 8:00 PM" },
                { icon: Calendar, title: "Emergency", text: "Available 24/7 for urgent care" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-primary-600">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input type="tel" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="(555) 000-0000" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-600">
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>General Practice</option>
                  <option>Pediatrics</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <input type="date" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Time</label>
                  <select className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-600">
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>02:00 PM</option>
                  </select>
                </div>
              </div>

              <button type="button" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20">
                Confirm Appointment
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};