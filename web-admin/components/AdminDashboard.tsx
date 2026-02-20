
import React from 'react';
import { 
  Users, Package, Map as MapIcon, ShieldAlert, 
  History, Activity, Globe, ArrowUpRight, 
  Zap, AlertTriangle, CloudRain, BarChart3, Briefcase,
  Target, Info
} from 'lucide-react';
import { AppEvent } from '../types';

interface AdminDashboardProps {
  wasteTotal?: number;
  jobsTotal?: number;
  events?: AppEvent[];
}

const CustomAreaChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  const height = 180;
  const width = 400;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.value / max) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map(v => (
            <line key={v} x1="0" y1={height * v} x2={width} y2={height * v} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
          ))}
          <polyline points={areaPoints} fill="url(#impactGradient)" />
          <polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((d, i) => (
            <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - (d.value / max) * height} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-4">
        {data.map(d => <span key={d.name} className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{d.name}</span>)}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  wasteTotal = 420, 
  jobsTotal = 1248,
  events = []
}) => {
  // FIXED: Using jobsTotal prop instead of the late-defined jobsCreated constant
  const chartData = [
    { name: 'MON', value: 420 }, 
    { name: 'TUE', value: 380 }, 
    { name: 'WED', value: 650 }, 
    { name: 'THU', value: 890 }, 
    { name: 'FRI', value: jobsTotal },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#f8fafc] space-y-8 pb-24 custom-scrollbar flex flex-col animate-in fade-in duration-700">
      {/* Header with High-Tech Feel */}
      <div className="flex justify-between items-start shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Command Center</h1>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Ondo State Economic Operating System</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border border-emerald-200 shadow-sm shadow-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            LIVE METRICS ACTIVE
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Akure HQ Backbone</span>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: 'Citizen Base', value: '14,238', trend: '+12%', icon: <Users className="text-emerald-600 w-5 h-5" />, color: 'bg-emerald-50' },
          { label: 'Verified Jobs', value: jobsTotal.toString(), trend: '+15%', icon: <Briefcase className="text-blue-600 w-5 h-5" />, color: 'bg-blue-50' },
          { label: 'Impact (KG)', value: wasteTotal.toFixed(0), trend: '+24%', icon: <Package className="text-amber-600 w-5 h-5" />, color: 'bg-amber-50' },
          { label: 'State Sync', value: '100%', trend: 'OPTIMAL', icon: <Globe className="text-slate-600 w-5 h-5" />, color: 'bg-slate-100' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-2.5 rounded-2xl ${m.color}`}>{m.icon}</div>
              <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {m.trend}
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">{m.value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Main Impact Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Graph Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col group hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-[10px] flex items-center gap-3 uppercase tracking-[0.4em]">
              <BarChart3 className="w-4 h-4 text-emerald-500" /> Economic Velocity
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-emerald-500 rounded-xl text-[9px] font-black text-white shadow-lg shadow-emerald-200">REAL-TIME</span>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <CustomAreaChart data={chartData} />
          </div>
        </div>

        {/* Global Log Card */}
        <div className="bg-white p-8 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col h-[400px]">
          <h3 className="font-black text-slate-900 mb-6 text-[10px] flex items-center gap-3 uppercase tracking-[0.4em] shrink-0">
            <History className="w-4 h-4 text-blue-500" /> Global Impact Log
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {events.length > 0 ? events.map((event) => (
              <div key={event.id} className="flex gap-4 items-start animate-in slide-in-from-right group">
                <div className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 shadow-lg ${
                  event.type === 'success' ? 'bg-emerald-500 shadow-emerald-200' : event.type === 'alert' ? 'bg-rose-500 shadow-rose-200' : 'bg-blue-500 shadow-blue-200'
                }`}></div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{event.message}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest tabular-nums">{event.timestamp.toLocaleTimeString()}</p>
                    <span className="text-[8px] bg-slate-50 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">SECURE</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-40">
                <Activity className="w-12 h-12 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Uplink...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Intelligence Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0 pb-10">
        {/* AI Predictions */}
        <div className="bg-slate-950 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group border border-white/5">
           <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000 scale-125">
            <ShieldAlert className="w-40 h-40" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-emerald-400 text-[10px] flex items-center gap-3 uppercase tracking-[0.5em]">
                <AlertTriangle className="w-4 h-4" /> AI Predictive Risk
              </h3>
              <Target className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-help group/item">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-blue-500/20 rounded-2xl"><CloudRain className="w-5 h-5 text-blue-400" /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Odigbo Flood Risk</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Atmospheric Scan: High Humidity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl border border-rose-500/20">CRITICAL</span>
                  <Info className="w-3 h-3 text-slate-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors cursor-help group/item">
                <div className="flex gap-4 items-center">
                  <div className="p-3 bg-amber-500/20 rounded-2xl"><Activity className="w-5 h-5 text-amber-400" /></div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight">Owo Crop Outbreak</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Image analysis detected Blight</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl border border-amber-500/20">WARNING</span>
                  <div className="w-3 h-3 text-slate-600 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <Info className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Geo Map Cluster */}
        <div className="bg-white p-10 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 text-[10px] flex items-center gap-3 uppercase tracking-[0.5em]">
              <MapIcon className="w-4 h-4 text-blue-500" /> Regional Cluster Map
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">18 LGAs Syncing</span>
          </div>
          <div className="bg-slate-100 h-48 rounded-[3rem] relative overflow-hidden flex items-center justify-center grayscale border border-slate-200 shadow-inner">
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-[10s]" alt="map" />
             <div className="absolute inset-0 bg-emerald-900/5"></div>
             
             {/* Map Clusters */}
             <div className="absolute top-1/2 left-1/3 group/dot">
               <div className="w-5 h-5 bg-emerald-500 rounded-full animate-ping border-4 border-white shadow-2xl"></div>
               <div className="absolute hidden group-hover/dot:block -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase whitespace-nowrap z-50">Akure Hub Alpha</div>
             </div>
             
             <div className="absolute top-1/3 left-2/3 group/dot delay-700">
               <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping border-4 border-white shadow-2xl"></div>
               <div className="absolute hidden group-hover/dot:block -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase whitespace-nowrap z-50">Owo Cluster</div>
             </div>

             <div className="absolute bottom-1/3 left-1/2 group/dot delay-1000">
               <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping border-2 border-white shadow-2xl"></div>
               <div className="absolute hidden group-hover/dot:block -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase whitespace-nowrap z-50">Odigbo Node</div>
             </div>

             <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-2xl border border-slate-100">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-800 italic">Ecosystem Online: 14,238 Nodes</p>
             </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Agriculture</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Services</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div> Circular</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
