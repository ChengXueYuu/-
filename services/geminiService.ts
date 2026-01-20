import { GoogleGenAI } from "@google/genai";
import { Submission } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClassSummary = async (submissions: Submission[]): Promise<string> => {
  if (submissions.length === 0) {
    return "尚無學生提交資料，無法產生總結。";
  }

  const groupASubmissions = submissions.filter(s => s.group === 'A').map(s => s.content).join('\n');
  const groupBSubmissions = submissions.filter(s => s.group === 'B').map(s => s.content).join('\n');

  const prompt = `
    你是一位國小數學老師的 AI 助教，正在協助進行「校門口交通調查員」的課程（數學原理同雞兔同籠）。
    課程設計為先讓學生進行觀察（A組），再進行算式推演（B組）。
    
    情境：
    - 校門口總共有 15 台車，地上有 46 個輪胎。（注意：這是範例情境，學生的數據可能不同，因為系統會隨機出題，但原理相同）
    - 車種有：摩托車 (2輪) 與 汽車 (4輪)。
    
    請根據以下兩組學生對於此問題的發現進行總結：
    
    A組 (使用停車格觀察法，先進行的活動) 的發現：
    ${groupASubmissions || '(無資料)'}
    
    B組 (使用假設法公式，後進行的活動) 的發現：
    ${groupBSubmissions || '(無資料)'}
    
    請產出一段約 150 字的課堂總結。
    重點：
    1. 讚美 A 組觀察到「每把一台摩托車換成汽車，輪胎就會多 2 個」的規律。
    2. 連結 B 組算式中「除以 2」的意義，正是 A 組觀察到的輪胎差。
    3. 語氣要像是一位交通大隊長鼓勵新進調查員，使用「調查員」、「輪胎線索」等詞彙。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "無法產生回應。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 總結功能暫時無法使用，請檢查 API Key 或稍後再試。";
  }
};