import React, { useState, useEffect } from 'react';
import { saveSubmission } from '../services/storageService';
import { ProblemData } from '../types';

interface GroupAProps {
  problem: ProblemData;
  seatNumber: string;
  onComplete?: () => void;
}

const GroupA: React.FC<GroupAProps> = ({ problem, seatNumber, onComplete }) => {
  // Form State
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  const [step4, setStep4] = useState('');
  const [conceptChoice, setConceptChoice] = useState<string | null>(null);
  
  // Reflection State
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form when problem changes
  useEffect(() => {
    setStep1('');
    setStep2('');
    setStep3('');
    setStep4('');
    setConceptChoice(null);
    setReflection('');
    setSubmitted(false);
  }, [problem]);

  const checkAnswers = () => {
    // Logic: Assume all motorcycles
    const assumedWheels = problem.totalVehicles * 2;
    const diff = problem.totalWheels - assumedWheels;
    
    // Validate inputs
    const s1 = parseInt(step1) === assumedWheels;
    const s2 = parseInt(step2) === assumedWheels; 
    const s3 = parseInt(step3) === diff;
    const s4 = parseInt(step4) === diff;
    return s1 && s2 && s3 && s4;
  };

  const isFormComplete = step1 && step2 && step3 && step4 && conceptChoice;
  // Choice B should be correct: (4-2) diff per vehicle
  const isCorrect = checkAnswers() && conceptChoice === 'B';

  const handleSubmit = () => {
    if (!reflection.trim()) return;
    // NOTE: Saving as 'B' because Logic is now Group B
    saveSubmission(seatNumber, 'B', reflection);
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-traffic-800 border border-traffic-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-traffic-blue/10 rounded-full blur-2xl"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-traffic-blue mb-2">B 組：演算中心 (邏輯建模)</h2>
              <div className="flex items-center gap-4">
                 <div className="text-sm bg-traffic-900/50 p-2 rounded border border-traffic-700/50 text-gray-400 font-mono">
                    調查員: {seatNumber}
                 </div>
                 <div className="flex items-center gap-4 text-sm font-mono bg-traffic-900/50 p-2 rounded border border-traffic-700/50 w-fit">
                    <span>目標車輛: <strong className="text-white">{problem.totalVehicles}</strong></span>
                    <span className="w-px h-4 bg-gray-600"></span>
                    <span>目標輪胎: <strong className="text-traffic-yellow">{problem.totalWheels}</strong></span>
                 </div>
              </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Calculation */}
        <div className="bg-traffic-800 border-2 border-traffic-700 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 border-b border-traffic-700 pb-2 flex items-center gap-2">
            <span className="w-2 h-6 bg-traffic-blue rounded"></span>
            Step 1: 算式推演
          </h3>
          
          <div className="space-y-6 font-mono text-lg">
            {/* Line 1 */}
            <div className="p-4 bg-traffic-900 rounded-lg border border-traffic-700/50">
              <div className="text-gray-400 text-xs mb-2 w-full">假設全部都是摩托車 (2輪)，輪胎會有：</div>
              <div className="flex flex-wrap items-center gap-2">
                  <span className="text-traffic-blue font-bold">{problem.totalVehicles}</span>
                  <span> × 2 = </span>
                  <input 
                  type="number" 
                  className="w-24 bg-traffic-800 border border-traffic-600 rounded px-2 py-1 text-center text-white focus:border-traffic-blue outline-none"
                  placeholder="?"
                  value={step1}
                  onChange={(e) => setStep1(e.target.value)}
                  />
              </div>
            </div>

            {/* Line 2 */}
            <div className="p-4 bg-traffic-900 rounded-lg border border-traffic-700/50">
              <div className="text-gray-400 text-xs mb-2 w-full">跟實際 {problem.totalWheels} 輪相比，少了幾個輪胎？</div>
              <div className="flex flex-wrap items-center gap-2">
                  <span className="text-traffic-yellow font-bold">{problem.totalWheels}</span>
                  <span> - </span>
                  <input 
                  type="number" 
                  className="w-20 bg-traffic-800 border border-traffic-600 rounded px-2 py-1 text-center text-white focus:border-traffic-blue outline-none"
                  placeholder="?"
                  value={step2}
                  onChange={(e) => setStep2(e.target.value)}
                  />
                  <span> = </span>
                  <input 
                  type="number" 
                  className="w-20 bg-traffic-800 border border-traffic-600 rounded px-2 py-1 text-center text-white focus:border-traffic-blue outline-none"
                  placeholder="?"
                  value={step3}
                  onChange={(e) => setStep3(e.target.value)}
                  />
              </div>
            </div>

            {/* Line 3 */}
            <div className="p-4 bg-traffic-900 rounded-lg border border-traffic-700/50">
              <div className="text-gray-400 text-xs mb-2 w-full">補上輪胎差，算出汽車數量：</div>
              <div className="flex flex-wrap items-center gap-2">
                  <input 
                  type="number" 
                  className="w-20 bg-traffic-800 border border-traffic-600 rounded px-2 py-1 text-center text-white focus:border-traffic-blue outline-none"
                  placeholder="?"
                  value={step4}
                  onChange={(e) => setStep4(e.target.value)}
                  />
                  <span> ÷ 2 = </span>
                  <span className="text-traffic-yellow font-bold text-2xl">
                  {step4 && !isNaN(parseInt(step4)) ? parseInt(step4) / 2 : '?'}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 bg-traffic-yellow/10 px-2 py-1 rounded text-traffic-yellow font-bold">汽車</span>
              </div>
            </div>
          </div>

          {/* Concept Check */}
          <div className="mt-8 pt-6 border-t border-traffic-700">
            <h3 className="text-lg font-bold text-white mb-4">Step 2: 隊長考核</h3>
            <p className="text-gray-300 mb-3 text-sm">算式最後除以的「2」，在馬路上代表什麼意思？</p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'A', text: '摩托車有 2 個輪胎' },
                { id: 'B', text: '汽車比摩托車多 2 個輪胎' },
                { id: 'C', text: '車道有 2 線道' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setConceptChoice(option.id)}
                  className={`p-3 rounded-lg text-sm border transition-all text-left
                    ${conceptChoice === option.id 
                      ? 'bg-traffic-blue/20 border-traffic-blue text-traffic-blue' 
                      : 'bg-traffic-900 border-traffic-700 text-gray-400 hover:border-gray-500'
                    }
                  `}
                >
                  <span className="font-bold mr-2">{option.id}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
          
          {isFormComplete && (
             <div className={`mt-6 p-3 rounded text-center text-sm font-bold ${isCorrect ? 'bg-green-900/30 text-green-400 border border-green-500' : 'bg-red-900/30 text-red-400 border border-red-500'}`}>
               {isCorrect ? "✅ 邏輯驗證成功！數據吻合！" : "⚠️ 算式異常，請重新檢查車輛假設。"}
             </div>
          )}
        </div>

        {/* Right Column: AI Notebook */}
        <div className="bg-traffic-800 border border-traffic-700 rounded-xl p-6 shadow-xl flex flex-col">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-traffic-blue rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">偵探筆記本</h3>
           </div>
           
           <div className="flex-grow bg-traffic-900 rounded-xl p-4 border border-traffic-700 mb-4">
             <div className="flex items-start gap-3 mb-4">
               <div className="w-8 h-8 rounded bg-traffic-700 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-300">助手</div>
               <div className="bg-traffic-800 p-3 rounded-r-xl rounded-bl-xl text-sm text-gray-300 leading-relaxed border border-traffic-700">
                 {isCorrect 
                   ? "幹得好，調查員！你已經用算式找出了汽車的數量。現在，請把你的發現寫下來，告訴 A 組：算式中的『除以 2』，在實際的停車位上，代表發生了什麼事？"
                   : "你好，調查員。我是你的數位助手。請先完成左側的算式推演，我們再來整理報告。"}
               </div>
             </div>
           </div>

          {submitted ? (
            <div className="bg-green-900/30 border border-green-500 text-green-400 p-4 rounded-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              報告已加密上傳！
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-gray-400 text-sm font-bold">
                我的必勝公式是...，因為那個「除以 2」代表...
              </label>
              <textarea
                className="w-full bg-traffic-900 border border-traffic-600 rounded-lg p-3 text-white focus:border-traffic-blue focus:ring-1 focus:ring-traffic-blue outline-none min-h-[120px]"
                placeholder="Ex: 我的必勝公式是先假設全部都是摩托車...那個除以 2 代表汽車比摩托車多出來的輪胎。"
                value={reflection}
                disabled={!isCorrect}
                onChange={(e) => setReflection(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={!isCorrect || !reflection.trim()}
                className="w-full bg-traffic-blue hover:bg-traffic-blueHover disabled:bg-traffic-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                {isCorrect ? '提交調查報告' : '請先完成推演'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupA;