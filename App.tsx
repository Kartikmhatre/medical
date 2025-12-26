import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { MeetTheDoctor } from './components/MeetTheDoctor';
import { Services } from './components/Services';
import { Testimonials } from './components/Testimonials';
import { ApptForm } from './components/ApptForm';
import { Footer } from './components/Footer';
import { AIChecker } from './components/AIChecker';
import { AppSection } from './types';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);

  const scrollToSection = (section: AppSection) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-primary-200 selection:text-primary-900 bg-white">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      
      <main>
        <div id={AppSection.HOME}>
          <Hero scrollToSection={scrollToSection} />
        </div>

        <Stats />
        
        <div id={AppSection.ABOUT}>
          <MeetTheDoctor />
        </div>
        
        <div id={AppSection.SERVICES}>
          <Services />
        </div>

        <div id={AppSection.TESTIMONIALS}>
          <Testimonials />
        </div>

        <div id={AppSection.CONTACT}>
          <ApptForm />
        </div>
      </main>

      <Footer />
      
      {/* Floating AI Widget */}
      <AIChecker />
    </div>
  );
};

export default App;