import React, { useState, useEffect } from 'react';
import { getSubmissions, clearSubmissions } from '../services/storageService';
import { generateClassSummary } from '../services/geminiService';
import { Submission } from '../types';

const TeacherDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'monitor' | 'manual'>('monitor');

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setSubmissions(getSubmissions());
      }, 2000); // Polling for real-time feel
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('密碼錯誤');
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const result = await generateClassSummary(submissions); 
    setSummary(result);
    setIsGenerating(false);
    setViewMode('manual');
  };

  const handleClearData = () => {
    if (window.confirm('確定要清除所有學生資料嗎？')) {
      clearSubmissions();
      setSubmissions([]);
      setSummary('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <form onSubmit={handleLogin} className="bg-traffic-800 p-8 rounded-xl border border-traffic-700 shadow-2xl w-full max-w-md">
          <div className="text-center mb-6">
             <div className="w-16 h-16 bg-traffic-yellow rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-traffic-900 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-traffic-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
             </div>
             <h2 className="text-2xl font-bold text-white">交通中控中心</h2>
             <p className="text-gray-400 text-sm">請驗證身份以存取資料</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入通行碼"
            className="w-full bg-traffic-900 border border-traffic-600 p-3 rounded mb-6 text-white focus:outline-none focus:border-traffic-yellow text-center tracking-widest"
          />
          <button type="submit" className="w-full bg-traffic-yellow hover:bg-traffic-yellowHover text-traffic-900 font-bold py-3 rounded transition-colors shadow-lg">
            驗證登入
          </button>
        </form>
      </div>
    );
  }

  // A is now Observation, B is now Logic
  const groupASubmissions = submissions.filter(s => s.group === 'A');
  const groupBSubmissions = submissions.filter(s => s.group === 'B');
  const challengeSubmissions = submissions.filter(s => s.group === 'CHALLENGE');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Controls */}
      <div className="flex justify-between items-center bg-traffic-800 p-4 rounded-xl border border-traffic-700">
        <div className="flex gap-4">
           <button 
             onClick={() => setViewMode('monitor')}
             className={`px-4 py-2 rounded-lg font-bold transition-all border ${viewMode === 'monitor' ? 'bg-traffic-blue border-traffic-blue text-white' : 'bg-traffic-900 border-traffic-700 text-gray-400 hover:text-white'}`}
           >
             📊 即時監控面板
           </button>
           <button 
             onClick={() => setViewMode('manual')}
             className={`px-4 py-2 rounded-lg font-bold transition-all border ${viewMode === 'manual' ? 'bg-traffic-yellow border-traffic-yellow text-traffic-900' : 'bg-traffic-900 border-traffic-700 text-gray-400 hover:text-white'}`}
           >
             📝 結案總結報告
           </button>
        </div>
        <button 
          onClick={handleClearData}
          className="text-red-400 hover:text-red-300 text-sm underline px-3 py-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          重置系統
        </button>
      </div>

      {viewMode === 'monitor' && (
        <>
           <div className="bg-traffic-800 p-6 rounded-2xl border border-traffic-700 mb-8">
            <div className="flex items-start gap-4">
               <div className="bg-traffic-900 p-3 rounded-full border border-traffic-700">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                  <h3 className="text-white font-bold mb-1">差異化任務進行中</h3>
                  <p className="text-gray-400 text-sm">由於每位調查員分配到的路口車輛數不同，此面板僅顯示文字調查報告，不顯示預測平均值。</p>
               </div>
            </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Group A Column (Observation) */}
            <div className="bg-traffic-800/50 rounded-2xl p-4 border border-traffic-700/50 flex flex-col h-[500px]">
              <h3 className="text-lg font-bold text-traffic-yellow mb-4 text-center border-b border-traffic-700 pb-2 bg-traffic-900/50 p-2 rounded">
                A 組：現場回報 ({groupASubmissions.length})
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {groupASubmissions.map((sub) => (
                  <div key={sub.id} className="bg-traffic-900 p-3 rounded-lg border-l-4 border-traffic-yellow shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-traffic-yellow/20 text-traffic-yellow text-xs px-2 py-0.5 rounded font-bold">
                        座號: {sub.seatNumber || 'N/A'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed font-mono">{sub.content}</p>
                  </div>
                ))}
                 {groupASubmissions.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">等待回傳...</p>}
              </div>
            </div>

            {/* Group B Column (Logic) */}
            <div className="bg-traffic-800/50 rounded-2xl p-4 border border-traffic-700/50 flex flex-col h-[500px]">
              <h3 className="text-lg font-bold text-traffic-blue mb-4 text-center border-b border-traffic-700 pb-2 bg-traffic-900/50 p-2 rounded">
                B 組：演算回報 ({groupBSubmissions.length})
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {groupBSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-traffic-900 p-3 rounded-lg border-l-4 border-traffic-blue shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-traffic-blue/20 text-traffic-blue text-xs px-2 py-0.5 rounded font-bold">
                        座號: {sub.seatNumber || 'N/A'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed font-mono">{sub.content}</p>
                  </div>
                ))}
                {groupBSubmissions.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">等待回傳...</p>}
              </div>
            </div>

            {/* Challenge Column */}
            <div className="bg-traffic-800/50 rounded-2xl p-4 border border-traffic-700/50 flex flex-col h-[500px]">
              <h3 className="text-lg font-bold text-green-400 mb-4 text-center border-b border-traffic-700 pb-2 bg-traffic-900/50 p-2 rounded">
                🏆 終極挑戰回報 ({challengeSubmissions.length})
              </h3>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {challengeSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-traffic-900 p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-green-900/30 text-green-400 border border-green-500/50 text-xs px-2 py-0.5 rounded font-bold">
                        座號: {sub.seatNumber || 'N/A'}
                      </span>
                       <span className="text-[10px] text-gray-600">
                        {new Date(sub.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed font-mono">{sub.content}</p>
                  </div>
                ))}
                 {challengeSubmissions.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">等待挑戰者...</p>}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
             <button
                onClick={handleGenerateSummary}
                disabled={isGenerating || submissions.length === 0}
                className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all border-2
                  ${isGenerating 
                    ? 'bg-traffic-700 border-traffic-600 text-gray-500 cursor-not-allowed' 
                    : 'bg-traffic-900 border-traffic-yellow text-traffic-yellow hover:bg-traffic-yellow hover:text-traffic-900'
                  }
                `}
              >
                {isGenerating ? '系統正在分析路況數據...' : '✨ 生成調查總結報告'}
              </button>
          </div>
        </>
      )}

      {viewMode === 'manual' && (
        <div className="animate-fade-in">
           <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden border-4 border-traffic-900">
              <div className="bg-traffic-yellow text-traffic-900 p-6 flex justify-between items-center border-b-4 border-traffic-900">
                 <h2 className="text-3xl font-bold font-mono uppercase tracking-tighter">Traffic Report</h2>
                 <span className="bg-traffic-900 text-white px-3 py-1 rounded font-bold text-sm">FINAL</span>
              </div>
              
              <div className="p-8 bg-gray-50">
                 {summary ? (
                    <div className="prose max-w-none">
                       <p className="text-xl font-bold mb-6 text-slate-800 border-l-8 border-traffic-blue pl-4">
                         調查結論：
                       </p>
                       <div className="text-lg leading-relaxed whitespace-pre-line text-slate-700 font-sans p-6 bg-white shadow-sm rounded-lg border border-gray-200">
                         {summary}
                       </div>
                    </div>
                 ) : (
                    <div className="text-center py-20 text-gray-400">
                       請先點擊「生成調查總結報告」
                    </div>
                 )}
                 
                 <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-300 grid grid-cols-2 gap-4">
                    {/* A is Observation, B is Logic */}
                    <div className="bg-white border border-gray-200 p-4 rounded text-center shadow-sm">
                       <span className="block text-gray-500 text-sm mb-1 uppercase tracking-widest">A 組觀測</span>
                       <span className="font-bold text-lg text-traffic-yellow">輪胎數差額</span>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded text-center shadow-sm">
                       <span className="block text-gray-500 text-sm mb-1 uppercase tracking-widest">B 組演算</span>
                       <span className="font-bold text-lg text-traffic-blue">假設法邏輯</span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-traffic-900 p-4 text-center text-gray-500 text-sm font-mono">
                 Traffic Control Center - Case Closed
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;