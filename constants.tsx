
import React from 'react';
import { Sprout, Briefcase, Recycle, LayoutDashboard, Send, Camera, MapPin, QrCode, Phone, CheckCircle2 } from 'lucide-react';

export const JOURNEYS = [
  { id: 'AMINA', label: 'Farmer Amina', icon: <Sprout className="w-5 h-5" />, color: 'bg-green-600' },
  { id: 'CHUKA', label: 'Artisan Chuka', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-600' },
  { id: 'BOLA', label: 'Collector Bola', icon: <Recycle className="w-5 h-5" />, color: 'bg-emerald-600' },
  { id: 'ADMIN', label: 'Admin View', icon: <LayoutDashboard className="w-5 h-5" />, color: 'bg-slate-800' },
] as const;

export const ONDO_COLORS = {
  primary: '#008751', // Nigerian/Ondo Green
  secondary: '#FFFFFF',
  accent: '#FCD34D', // Amber/Gold
};
