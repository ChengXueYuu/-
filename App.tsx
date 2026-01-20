import React, { useState, useEffect } from 'react';
import { ViewState, ProblemData } from './types';
import { savePrediction, saveSubmission } from './services/storageService';
import Layout from './components/Layout';
import GroupA from './components/GroupA';
import GroupB from './components/GroupB';
import TeacherDashboard from './components/TeacherDashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  
  // User State
  const [seatNumber, setSeatNumber] = useState('');
  const [isSeatConfirmed, setIsSeatConfirmed] = useState(false);

  // Flow State
  const [hasPredicted, setHasPredicted] = useState(false);
  const [isTaskComplete, setIsTaskComplete] = useState(false); // Track if A/B is done
  
  // Dynamic Problem State (Traffic)
  const [problem, setProblem] = useState<ProblemData>({ totalVehicles: 8, totalWheels: 22 });
  const [guessMotorcycles, setGuessMotorcycles] = useState(0);

  // Challenge State (Breakfast)
  const [breakfastAnswer, setBreakfastAnswer] = useState({ riceBall: '', pancake: '' });
  const [isChallengeCorrect, setIsChallengeCorrect] = useState(false);
  const [showChallengeHint, setShowChallengeHint] = useState(false);

  // Generate a random problem on mount or request
  const generateNewProblem = () => {
    // Update range to 5 ~ 10 vehicles
    const vehicles = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    const cars = Math.floor(Math.random() * (vehicles - 2)) + 1; 
    const motorcycles = vehicles - cars;
    const wheels = (motorcycles * 2) + (cars * 4);

    setProblem({
      totalVehicles: vehicles,
      totalWheels: wheels
    });
    setGuessMotorcycles(Math.floor(vehicles / 2));
    setHasPredicted(false);
    setIsTaskComplete(false);
  };

  useEffect(() => {
    // Default initial problem: 8 vehicles (Example: 3 cars, 5 motorcycles -> 12 + 10 = 22 wheels)
    setProblem({ totalVehicles: 8, totalWheels: 22 });
    setGuessMotorcycles(4);

    const savedSeat = localStorage.getItem('traffic_seat_number');
    if (savedSeat) {
      setSeatNumber(savedSeat);
    }
  }, []);

  const handleSeatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seatNumber.trim()) {
      setIsSeatConfirmed(true);
      localStorage.setItem('traffic_seat_number', seatNumber);
    }
  };

  const guessCars = problem.totalVehicles - guessMotorcycles;

  const handlePredictionSubmit = () => {
    savePrediction(seatNumber, guessMotorcycles, guessCars);
    setHasPredicted(true);
  };

  const handleTaskComplete = () => {
    setIsTaskComplete(true);
    // Optional: Auto redirect or show notification
    alert("任務完成！請點擊上方「前往終極挑戰」進行知識遷移測試。");
  };

  const checkBreakfastAnswer = () => {
    // Problem: 20 items, 400 total. RiceBall(15), Pancake(35).
    // Logic: Assume all 15 -> 20*15=300. Diff=100. PriceDiff=20. Pancake=5, RiceBall=15.
    const rice = parseInt(breakfastAnswer.riceBall);
    const pan = parseInt(breakfastAnswer.pancake);
    
    if (isNaN(rice) || isNaN(pan)) {
        alert("請輸入數字！");
        return;
    }

    if (rice === 15 && pan === 5) {
        setIsChallengeCorrect(true);
        saveSubmission(seatNumber, 'CHALLENGE', `成功破解：飯糰 ${rice} 份，蛋餅 ${pan} 份`);
    } else {
        const totalItems = rice + pan;
        const totalCost = rice * 15 + pan * 35;
        let msg = "答案不對喔！\n";
        if (totalItems !== 20) msg += `- 目前總份數是 ${totalItems} (目標是 20)\n`;
        if (totalCost !== 400) msg += `- 目前總金額是 $${totalCost} (目標是 $400)`;
        
        alert(msg);
        // Automatically show hint if wrong
        setShowChallengeHint(true);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.GROUP_A:
        return <GroupA problem={problem} seatNumber={seatNumber} onComplete={handleTaskComplete} />;
      case ViewState.GROUP_B:
        return <GroupB problem={problem} seatNumber={seatNumber} onComplete={handleTaskComplete} />;
      case ViewState.TEACHER:
        return <TeacherDashboard />;
      
      case ViewState.CHALLENGE:
        return (
          <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
             <div className="bg-white text-traffic-900 rounded-xl p-8 border-4 border-traffic-yellow shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-traffic-yellow text-traffic-900 font-bold px-4 py-1 rounded-bl-lg">偵探任務二：終極遷移</div>
                
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-4xl">🍙</span> 早餐店大考驗
                </h2>
                
                <div className="bg-gray-100 p-6 rounded-lg mb-8 border border-gray-200">
                    <p className="text-lg leading-relaxed font-medium">
                        老師買了 <span className="text-red-600 font-bold text-2xl">20</span> 份早餐請大家吃，總共花了 <span className="text-red-600 font-bold text-2xl">400</span> 元。<br/>
                        菜單上只有兩種選擇：
                    </p>
                    <div className="flex gap-8 mt-4">
                        <div className="flex-1 bg-white p-4 rounded shadow text-center border-2 border-orange-200">
                            <span className="block text-4xl mb-2">🍙</span>
                            <div className="font-bold text-gray-700">元氣飯糰</div>
                            <div className="text-orange-500 font-bold text-xl">$15 元</div>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded shadow text-center border-2 border-yellow-200">
                            <span className="block text-4xl mb-2">🥞</span>
                            <div className="font-bold text-gray-700">起司蛋餅</div>
                            <div className="text-orange-500 font-bold text-xl">$35 元</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <p className="text-gray-600 mb-2 font-bold">請問老師各買了幾份？</p>
                        <p className="text-sm text-gray-500 mb-4">利用剛才學會的「假設法」或「替換法」邏輯來破解！</p>
                        
                        <div className="space-y-4">
                             <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <label className="font-bold text-gray-700">飯糰 ($15)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-24 p-2 border border-gray-300 rounded text-center text-xl font-mono"
                                        value={breakfastAnswer.riceBall}
                                        onChange={(e) => setBreakfastAnswer({...breakfastAnswer, riceBall: e.target.value})}
                                    />
                                    <span className="text-gray-500">份</span>
                                </div>
                             </div>
                             <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                <label className="font-bold text-gray-700">蛋餅 ($35)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="w-24 p-2 border border-gray-300 rounded text-center text-xl font-mono"
                                        value={breakfastAnswer.pancake}
                                        onChange={(e) => setBreakfastAnswer({...breakfastAnswer, pancake: e.target.value})}
                                    />
                                    <span className="text-gray-500">份</span>
                                </div>
                             </div>
                        </div>
                        
                        <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200">
                           <p className="font-bold mb-1">📝 驗算小提醒：</p>
                           <ul className="list-disc list-inside space-y-1">
                             <li>記得確認兩樣東西加起來是不是 <span className="font-mono text-red-500">20</span> 份？</li>
                             <li>算算看總金額是不是剛好 <span className="font-mono text-red-500">$400</span> 元？</li>
                           </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                         {!isChallengeCorrect ? (
                             <>
                                <button 
                                    onClick={checkBreakfastAnswer}
                                    className="w-full md:w-auto px-8 py-4 bg-traffic-blue text-white font-bold rounded-lg shadow-lg hover:bg-traffic-blueHover transition-all text-lg"
                                >
                                    提交答案驗證
                                </button>
                                
                                <button
                                    onClick={() => setShowChallengeHint(!showChallengeHint)}
                                    className="text-sm text-gray-500 underline hover:text-traffic-blue"
                                >
                                    {showChallengeHint ? "隱藏提示" : "這題好難...給我一點提示"}
                                </button>

                                {showChallengeHint && (
                                    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-left animate-fade-in">
                                        <h4 className="font-bold text-yellow-800 mb-2">💡 思考提示：</h4>
                                        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                                            <li>假設 20 份全部都買便宜的<strong>飯糰 ($15)</strong>...</li>
                                            <li>這樣總共只會花：20 × 15 = <span className="font-mono font-bold">300</span> 元。</li>
                                            <li>但是實際花了 400 元，少算了 <span className="font-mono font-bold">100</span> 元！</li>
                                            <li>把一份飯糰換成蛋餅，金額會增加 <span className="font-mono font-bold">20</span> 元 ($35-$15)。</li>
                                            <li>那要換幾份，才能補齊這 100 元的差額呢？</li>
                                        </ul>
                                    </div>
                                )}
                             </>
                         ) : (
                             <div className="w-full space-y-4">
                                <div className="bg-green-100 text-green-700 p-4 rounded-lg font-bold text-center border border-green-300">
                                    🎉 恭喜破案！邏輯完全正確！
                                </div>
                                <button 
                                    onClick={() => setCurrentView(ViewState.SUMMARY)}
                                    className="w-full px-8 py-4 bg-traffic-yellow text-traffic-900 font-bold rounded-lg shadow-lg hover:bg-traffic-yellowHover transition-all text-lg animate-bounce"
                                >
                                    領取調查總結手冊 ➔
                                </button>
                             </div>
                         )}
                    </div>
                </div>
             </div>
          </div>
        );

      case ViewState.SUMMARY:
        return (
            <div className="animate-fade-in flex justify-center items-center min-h-[60vh]">
                <div className="bg-slate-900 text-slate-200 p-8 rounded-2xl border-4 border-traffic-blue shadow-2xl max-w-3xl w-full relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-traffic-blue text-white px-6 py-2 rounded-full font-bold shadow-lg border-4 border-slate-900">
                        交通解密手冊
                    </div>

                    <h2 className="text-center text-2xl font-bold mt-6 mb-8 text-traffic-yellow">
                        雞兔同籠・萬用破解三部曲
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-traffic-yellow transition-colors group">
                            <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">💭</div>
                            <h3 className="text-lg font-bold text-center mb-2 text-white">1. 大膽假設</h3>
                            <p className="text-sm text-gray-400 text-center">
                                全部都當成<br/>
                                <span className="text-traffic-blue font-bold">輪胎少的 (摩托車)</span>
                            </p>
                            <div className="mt-3 text-xs bg-slate-900 p-2 rounded text-center font-mono text-gray-500">
                                {problem.totalVehicles}台 × 2輪 = {problem.totalVehicles * 2}輪
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-traffic-yellow transition-colors group">
                             <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">🔍</div>
                             <h3 className="text-lg font-bold text-center mb-2 text-white">2. 找出差距</h3>
                             <p className="text-sm text-gray-400 text-center">
                                 實際輪胎 - 假設輪胎<br/>
                                 <span className="text-traffic-yellow font-bold">藏起來的輪胎</span>
                             </p>
                             <div className="mt-3 text-xs bg-slate-900 p-2 rounded text-center font-mono text-gray-500">
                                {problem.totalWheels} - {problem.totalVehicles * 2} = {problem.totalWheels - (problem.totalVehicles * 2)}輪
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-traffic-yellow transition-colors group">
                             <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">🚗</div>
                             <h3 className="text-lg font-bold text-center mb-2 text-white">3. 補回變身</h3>
                             <p className="text-sm text-gray-400 text-center">
                                 總差額 ÷ 個體差額<br/>
                                 <span className="text-green-400 font-bold">= 輪胎多的車數</span>
                             </p>
                             <div className="mt-3 text-xs bg-slate-900 p-2 rounded text-center font-mono text-gray-500">
                                {problem.totalWheels - (problem.totalVehicles * 2)} ÷ (4-2) = {(problem.totalWheels - (problem.totalVehicles * 2)) / 2}台車
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-800/50 p-4 rounded-lg border border-dashed border-slate-600 text-center">
                        <p className="text-gray-300 italic text-sm">
                            「不論是車子、早餐、還是動物，只要有兩個數量和兩個總數，都可以用這個方法變身破解！」
                            <br/>
                            —— 交通大隊長
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => setCurrentView(ViewState.HOME)}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 transition-colors"
                        >
                            回到總部待命
                        </button>
                    </div>
                </div>
            </div>
        );

      case ViewState.HOME:
      default:
        // Case 1: Ask for Seat Number first
        if (!isSeatConfirmed) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
              <div className="w-full max-w-md bg-traffic-800 p-8 rounded-xl border-2 border-traffic-yellow shadow-2xl relative">
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-traffic-yellow rounded-full flex items-center justify-center border-4 border-traffic-900 shadow-lg z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-traffic-900" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <h2 className="text-2xl font-bold text-white text-center mt-4 mb-2">調查員報到</h2>
                 <p className="text-gray-400 text-center mb-6 text-sm">請輸入座號以領取交通調查任務</p>
                 
                 <form onSubmit={handleSeatSubmit} className="space-y-4">
                   <div>
                     <label className="block text-traffic-yellow text-xs font-bold uppercase tracking-widest mb-2">座號 (Seat No.)</label>
                     <input 
                       type="text"
                       value={seatNumber}
                       onChange={(e) => setSeatNumber(e.target.value)}
                       placeholder="例如: 05"
                       className="w-full bg-traffic-900 border border-traffic-600 p-4 rounded-lg text-white text-center text-2xl font-mono focus:border-traffic-yellow focus:ring-1 focus:ring-traffic-yellow outline-none transition-all"
                       autoFocus
                     />
                   </div>
                   <button 
                     type="submit"
                     disabled={!seatNumber.trim()}
                     className="w-full bg-traffic-blue hover:bg-traffic-blueHover disabled:bg-traffic-700 disabled:text-gray-500 text-white font-bold py-4 rounded-lg shadow-lg transition-all"
                   >
                     確認身份，開始調查
                   </button>
                 </form>
              </div>
            </div>
          );
        }

        // Case 2: Main Logic
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-fade-in">
            <div className="flex items-center gap-3 mb-6 opacity-70">
               <div className="px-3 py-1 bg-traffic-900 rounded-full border border-traffic-700 text-xs text-gray-400 font-mono">
                 調查員: {seatNumber}
               </div>
               <button onClick={() => setIsSeatConfirmed(false)} className="text-xs text-traffic-blue hover:underline">
                 更換
               </button>
            </div>

            <div className="mb-6 relative group cursor-pointer" onClick={generateNewProblem} title="點擊生成新題目">
               <div className="absolute -inset-4 bg-traffic-yellow/20 rounded-full blur-xl animate-pulse-slow"></div>
               <h2 className="relative text-3xl md:text-5xl font-bold text-white mb-2 text-center tracking-tight">
                 台南新營國小・交通調查員
               </h2>
            </div>
            
            <p className="text-gray-400 text-lg mb-8 text-center max-w-2xl bg-traffic-800/50 p-4 rounded-xl border border-traffic-700 shadow-lg">
              <span className="text-traffic-yellow font-bold block mb-2 text-xl">👮‍♂️ 警衛伯伯的緊急回報：</span> 
              「放學時間校門口大塞車！我剛剛低頭數了一下...<br/>
              門口總共有 <span className="text-white font-bold text-2xl mx-1 border-b-2 border-white">{problem.totalVehicles}</span> 台車，
              地上竟然有 <span className="text-white font-bold text-2xl mx-1 border-b-2 border-traffic-yellow">{problem.totalWheels}</span> 個輪胎！」<br/>
              <span className="text-sm mt-3 block text-gray-500">伯伯老花眼數不清楚車種，各位調查員能幫忙算出摩托車跟汽車各幾台嗎？</span>
            </p>
            
            {/* Intro / Prediction Section */}
            {!hasPredicted ? (
              <div className="w-full max-w-lg bg-traffic-800 border-2 border-traffic-700 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                {/* Decoration: Striped bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-traffic-900 via-traffic-yellow to-traffic-900 bg-[length:40px_100%]"></div>

                <div className="flex justify-between items-center mb-8 text-center bg-traffic-900 p-4 rounded-lg">
                   <div className="flex flex-col">
                     <span className="text-gray-400 text-xs uppercase tracking-widest">總車輛數</span>
                     <span className="text-3xl font-mono text-white">{problem.totalVehicles}</span>
                   </div>
                   <div className="w-px h-10 bg-traffic-700"></div>
                   <div className="flex flex-col">
                     <span className="text-gray-400 text-xs uppercase tracking-widest">總輪胎數</span>
                     <span className="text-3xl font-mono text-traffic-yellow">{problem.totalWheels}</span>
                   </div>
                </div>

                <div className="mb-8">
                  <label className="block text-center text-traffic-blue font-bold mb-4">
                    初步調查報告 (請先憑直覺預測)
                  </label>
                  
                  <div className="relative pt-6 pb-2">
                    <input 
                      type="range" 
                      min="0" 
                      max={problem.totalVehicles} 
                      value={guessMotorcycles} 
                      onChange={(e) => setGuessMotorcycles(parseInt(e.target.value))}
                      className="w-full h-3 bg-traffic-700 rounded-lg appearance-none cursor-pointer accent-traffic-blue z-10 relative"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                       <span>全是汽車</span>
                       <span>全是摩托車</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-2 mt-4 gap-4">
                    <div className="flex-1 text-center p-3 bg-traffic-900 rounded-lg border border-traffic-blue/50">
                      <span className="block text-2xl mb-1">🏍️</span>
                      <div className="text-xs text-traffic-blue mb-1">摩托車 (2輪)</div>
                      <span className="font-mono text-xl font-bold text-white">{guessMotorcycles}</span>
                    </div>
                    <div className="text-gray-500 font-bold text-xl">VS</div>
                    <div className="flex-1 text-center p-3 bg-traffic-900 rounded-lg border border-traffic-yellow/50">
                      <span className="block text-2xl mb-1">🚗</span>
                      <div className="text-xs text-traffic-yellow mb-1">汽車 (4輪)</div>
                      <span className="font-mono text-xl font-bold text-white">{guessCars}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePredictionSubmit}
                  className="w-full bg-traffic-yellow hover:bg-traffic-yellowHover text-traffic-900 font-bold py-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1"
                >
                  確認初步報告
                </button>
              </div>
            ) : (
              <div className="animate-fade-in w-full max-w-4xl flex flex-col items-center">
                 <div className="text-center mb-8">
                    <span className="inline-block bg-traffic-blue/20 text-traffic-blue px-4 py-2 rounded-full text-sm font-bold border border-traffic-blue/50 mb-4 animate-pulse">
                      ✅ 任務代號：雞兔同籠
                    </span>
                    <p className="text-gray-300">請選擇你的專長領域，開始進行深度調查！</p>
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {/* Group B Card (First Position) -> Now Group A (Observation) */}
                  <button
                    onClick={() => setCurrentView(ViewState.GROUP_B)}
                    className="group relative bg-traffic-800 border-l-4 border-traffic-yellow rounded-r-xl p-8 hover:bg-traffic-700 transition-all shadow-xl text-left overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <span className="text-9xl font-mono font-bold text-traffic-yellow">A</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-traffic-yellow mb-2 flex items-center gap-2">
                         <span className="w-8 h-8 rounded bg-traffic-yellow text-traffic-900 flex items-center justify-center text-sm">A</span>
                         實驗觀察偵探
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        使用<span className="text-white font-bold">停車格模擬器</span>。<br/>
                        「我要親眼看到變化！動手點點看，找出變身規律。」
                      </p>
                      <span className="text-traffic-yellow text-sm font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform bg-traffic-900/50 w-fit px-3 py-1 rounded">
                        進入現場調查
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  {/* Group A Card (Second Position) -> Now Group B (Logic) */}
                  <button
                    onClick={() => setCurrentView(ViewState.GROUP_A)}
                    className="group relative bg-traffic-800 border-l-4 border-traffic-blue rounded-r-xl p-8 hover:bg-traffic-700 transition-all shadow-xl text-left overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <span className="text-9xl font-mono font-bold text-traffic-blue">B</span>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-traffic-blue mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-traffic-blue text-white flex items-center justify-center text-sm">B</span>
                        邏輯建模偵探
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        使用<span className="text-white font-bold">偵探筆記本</span>。<br/>
                        「我不一定要看到車，我能用公式直接算出答案！」
                      </p>
                      <span className="text-traffic-blue text-sm font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform bg-traffic-900/50 w-fit px-3 py-1 rounded">
                        進入演算中心 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </button>
                </div>

                {isTaskComplete && (
                    <div className="mt-10 animate-fade-in w-full max-w-4xl">
                        <button 
                            onClick={() => setCurrentView(ViewState.CHALLENGE)}
                            className="w-full py-6 bg-gradient-to-r from-traffic-yellow to-orange-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform border-4 border-traffic-900"
                        >
                            <span className="text-3xl mb-2 group-hover:animate-bounce">🏆</span>
                            <h3 className="text-2xl font-bold text-white drop-shadow-md">任務完成！前往終極挑戰</h3>
                            <p className="text-traffic-900 font-bold opacity-80">應用你的發現，破解早餐店的秘密</p>
                        </button>
                    </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;