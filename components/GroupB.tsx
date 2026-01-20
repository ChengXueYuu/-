import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VehicleType, ProblemData } from '../types';
import { saveSubmission } from '../services/storageService';

// --- SVG Icons Components ---

const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* 2 Big Wheels */}
    <circle cx="30" cy="70" r="12" className="fill-traffic-900 stroke-gray-400" strokeWidth="4" />
    <circle cx="70" cy="70" r="12" className="fill-traffic-900 stroke-gray-400" strokeWidth="4" />
    <circle cx="30" cy="70" r="4" className="fill-gray-500 stroke-none" />
    <circle cx="70" cy="70" r="4" className="fill-gray-500 stroke-none" />

    {/* Body Frame */}
    <path d="M30 70 L45 50 L65 50 L70 70" className="stroke-traffic-blue" strokeWidth="4" />
    <path d="M45 50 L40 35 L55 35" className="stroke-traffic-blue" strokeWidth="4" />
    
    {/* Handlebars & Seat */}
    <path d="M35 35 L45 35" className="stroke-gray-300" strokeWidth="3" />
    <path d="M60 45 L70 45" className="stroke-gray-300" strokeWidth="3" />
    
    {/* Person Helmet Hint */}
    <circle cx="48" cy="25" r="8" className="fill-traffic-blue/50 stroke-traffic-blue" />
  </svg>
);

const CarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
     {/* 4 Wheels (Top Down / Isometric view to show 4 distinct points) */}
     {/* Rear Wheels */}
    <rect x="20" y="25" width="12" height="20" rx="4" className="fill-traffic-900 stroke-gray-500" />
    <rect x="20" y="55" width="12" height="20" rx="4" className="fill-traffic-900 stroke-gray-500" />
    
    {/* Front Wheels */}
    <rect x="68" y="25" width="12" height="20" rx="4" className="fill-traffic-900 stroke-gray-500" />
    <rect x="68" y="55" width="12" height="20" rx="4" className="fill-traffic-900 stroke-gray-500" />

    {/* Car Body (Top View) */}
    <path d="M25 35 H75 C82 35 85 40 85 50 C85 60 82 65 75 65 H25 C18 65 15 60 15 50 C15 40 18 35 25 35 Z" className="fill-traffic-yellow/80 stroke-traffic-yellow" strokeWidth="2" />
    
    {/* Windshield */}
    <path d="M60 38 V62 M35 38 V62" className="stroke-traffic-900/30" />
    <rect x="40" y="40" width="20" height="20" className="fill-traffic-900/20 stroke-none" />
  </svg>
);

// --- Main Component ---

interface GroupBProps {
  problem: ProblemData;
  seatNumber: string;
  onComplete?: () => void;
}

const GroupB: React.FC<GroupBProps> = ({ problem, seatNumber, onComplete }) => {
  // Initialize vehicles based on props
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const prevSuccessRef = useRef(false);

  // Effect to reset state when problem changes
  useEffect(() => {
    setVehicles(Array(problem.totalVehicles).fill(VehicleType.MOTORCYCLE));
    setReflection('');
    setSubmitted(false);
    prevSuccessRef.current = false;
  }, [problem]);

  const stats = useMemo(() => {
    const motorcycles = vehicles.filter(v => v === VehicleType.MOTORCYCLE).length;
    const cars = vehicles.filter(v => v === VehicleType.CAR).length;
    const wheels = (motorcycles * 2) + (cars * 4);
    return { motorcycles, cars, wheels };
  }, [vehicles]);

  const isSuccess = stats.wheels === problem.totalWheels;

  // Simple Sound Effect
  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      // Traffic Whistle sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.linearRampToValueAtTime(2500, now + 0.1);
      osc.frequency.linearRampToValueAtTime(2000, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  };

  useEffect(() => {
    if (isSuccess && !prevSuccessRef.current) {
      playSuccessSound();
    }
    prevSuccessRef.current = isSuccess;
  }, [isSuccess]);

  const toggleVehicle = (index: number) => {
    playClickSound();
    const newVehicles = [...vehicles];
    newVehicles[index] = newVehicles[index] === VehicleType.MOTORCYCLE 
      ? VehicleType.CAR 
      : VehicleType.MOTORCYCLE;
    setVehicles(newVehicles);
  };

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    // NOTE: Saving as 'A' because Observation is now Group A
    saveSubmission(seatNumber, 'A', reflection);
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Panel */}
      <div className="bg-traffic-800 border-2 border-traffic-yellow rounded-xl p-6 shadow-xl relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-traffic-yellow text-traffic-900 px-4 py-1 rounded font-bold uppercase tracking-widest text-sm border-2 border-traffic-900">
          Traffic Monitor
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pt-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">A 組：現場調查 (實驗觀察)</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-traffic-900 border border-traffic-700 px-2 py-0.5 rounded text-gray-400">調查員: {seatNumber}</span>
              <p className="text-gray-400 text-sm">點擊停車格內的車輛，將摩托車替換為汽車，觀察輪胎總數的變化。</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-mono bg-traffic-900 p-3 rounded-lg border border-traffic-700 shadow-inner">
            <div className="flex flex-col items-center px-2">
              <span className="text-gray-400 text-xs">目標車輛</span>
              <span className="text-xl text-white">{problem.totalVehicles}</span>
            </div>
            <div className="w-px bg-traffic-700"></div>
            <div className="flex flex-col items-center px-2">
              <span className="text-gray-400 text-xs">目標輪胎</span>
              <span className="text-xl text-traffic-yellow font-bold">{problem.totalWheels}</span>
            </div>
          </div>
        </div>

        {/* Parking Lot Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {vehicles.map((vehicle, idx) => (
            <div key={idx} className="relative group">
              {/* Parking Spot Markings */}
              <div className="absolute inset-0 border-2 border-dashed border-gray-600 rounded-lg pointer-events-none"></div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-traffic-900 px-2 text-xs text-gray-500 font-mono">
                {idx + 1}
              </div>
              
              <button
                onClick={() => toggleVehicle(idx)}
                className={`
                  w-full aspect-square rounded-lg flex items-center justify-center flex-col transition-all duration-300 relative overflow-hidden z-10
                  ${vehicle === VehicleType.MOTORCYCLE 
                    ? 'bg-traffic-blue/10 hover:bg-traffic-blue/20' 
                    : 'bg-traffic-yellow/10 hover:bg-traffic-yellow/20'
                  }
                `}
              >
                <div className="w-full h-full p-2 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                   {vehicle === VehicleType.MOTORCYCLE ? (
                      <MotorcycleIcon className="w-full h-full drop-shadow-lg text-traffic-blue" />
                   ) : (
                      <CarIcon className="w-full h-full drop-shadow-lg text-traffic-yellow" />
                   )}
                </div>
                
                <div className={`
                  absolute bottom-2 right-2 text-sm font-bold font-mono px-2 py-0.5 rounded
                  ${vehicle === VehicleType.MOTORCYCLE 
                    ? 'bg-traffic-blue text-white' 
                    : 'bg-traffic-yellow text-traffic-900'}
                `}>
                  {vehicle === VehicleType.MOTORCYCLE ? '2輪' : '4輪'}
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Real-time Stats */}
        <div className={`
          rounded-lg p-4 border-2 transition-all duration-700
          ${isSuccess 
            ? 'bg-green-900/30 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
            : 'bg-traffic-900 border-traffic-700'}
        `}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-500 text-xs mb-1 uppercase">摩托車 (2輪)</div>
              <div className="text-2xl font-mono text-traffic-blue font-bold">{stats.motorcycles}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1 uppercase">汽車 (4輪)</div>
              <div className="text-2xl font-mono text-traffic-yellow font-bold">{stats.cars}</div>
            </div>
            <div className="relative">
              <div className="text-gray-500 text-xs mb-1 uppercase">目前總輪胎</div>
              <div className={`text-3xl font-mono font-bold ${isSuccess ? 'text-green-500' : 'text-white'}`}>
                {stats.wheels}
              </div>
              {isSuccess && (
                <div className="absolute -top-3 -right-3 text-xs bg-green-500 text-green-900 px-2 py-1 rounded font-bold animate-bounce shadow-lg">
                  MATCH!
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-traffic-700 h-4 rounded-full overflow-hidden relative border border-traffic-600">
             {/* Striped background */}
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,#000_25%,#000_50%,transparent_50%,transparent_75%,#000_75%,#000_100%)] bg-[length:20px_20px]"></div>
            <div 
              className={`h-full transition-all duration-500 relative ${isSuccess ? 'bg-green-500' : 'bg-traffic-yellow'}`} 
              style={{ width: `${Math.min((stats.wheels / problem.totalWheels) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-center text-xs mt-2 text-gray-500 font-mono">
             目標: {problem.totalWheels} 輪
          </p>
        </div>
      </div>

      {/* Reflection Section */}
      <div className="bg-traffic-800 border border-traffic-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-traffic-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          調查紀錄表
        </h3>
        {submitted ? (
          <div className="bg-green-900/30 border border-green-500 text-green-400 p-4 rounded-lg flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            數據已回傳交通總部！
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-bold bg-traffic-900/50 p-3 rounded border border-traffic-700">
              關鍵線索：<br/>
              我發現每增加一台汽車，輪胎就多...
            </label>
            <textarea
              className="w-full bg-traffic-900 border border-traffic-600 rounded-lg p-3 text-white focus:border-traffic-yellow focus:ring-1 focus:ring-traffic-yellow outline-none min-h-[100px]"
              placeholder="我發現：每把一台摩托車變成汽車，輪胎就會..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              disabled={!reflection.trim()}
              className="w-full bg-traffic-blue hover:bg-traffic-blueHover disabled:bg-traffic-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg"
            >
              回報調查結果
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupB;