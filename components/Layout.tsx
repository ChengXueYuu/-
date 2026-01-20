import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-traffic-900 text-slate-200 flex flex-col font-sans selection:bg-traffic-yellow selection:text-traffic-900">
      <header className="bg-traffic-800 border-b-4 border-traffic-yellow shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => onNavigate(ViewState.HOME)}
          >
            <div className="w-12 h-12 bg-traffic-yellow rounded-lg flex items-center justify-center shadow-lg border-2 border-traffic-900 group-hover:scale-110 transition-transform">
              {/* Traffic Light Icon or Badge */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-traffic-900" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.54 7.19-5 10.18C9.54 16.19 7 11.88 7 9z"/>
                 <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-traffic-yellow font-mono tracking-widest uppercase">Traffic Control</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-wider text-white">
                校門口<span className="text-traffic-yellow">交通調查員</span>
              </h1>
            </div>
          </div>
          
          <div className="flex gap-2">
            {currentView !== ViewState.HOME && (
              <button 
                onClick={() => onNavigate(ViewState.HOME)}
                className="px-4 py-2 rounded bg-traffic-700 hover:bg-traffic-600 text-gray-200 text-sm transition-colors border-l-4 border-gray-500"
              >
                回總部
              </button>
            )}
            <button 
              onClick={() => onNavigate(ViewState.TEACHER)}
              className="w-10 h-10 flex items-center justify-center rounded bg-traffic-800 hover:bg-traffic-700 border-2 border-traffic-yellow text-traffic-yellow transition-all"
              title="教師專區"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm bg-traffic-900 border-t border-traffic-800">
        <div className="flex justify-center items-center gap-2">
           <div className="h-2 w-16 bg-traffic-yellow skew-x-[-20deg]"></div>
           <span>Traffic Investigation Division © 2024</span>
           <div className="h-2 w-16 bg-traffic-yellow skew-x-[-20deg]"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;