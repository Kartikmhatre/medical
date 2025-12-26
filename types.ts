import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
}

export enum AppSection {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  TESTIMONIALS = 'testimonials',
  CONTACT = 'contact'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}