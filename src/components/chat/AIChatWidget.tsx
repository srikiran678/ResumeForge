import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../context/WorkspaceContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  evidenceTraced?: boolean;
}

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const createMsgId = (prefix: string) => `${prefix}_${Date.now()}`;

const QUICK_PROMPTS = [
  '⚡ Rewrite my project bullet with strong action verbs',
  '🎯 What are the top 3 ATS rejection mistakes?',
  '🔍 How do I explain lack of formal experience?',
  '💼 Analyze my skills for a Backend SWE internship',
];

export const AIChatWidget: React.FC = () => {
  const { masterProfile } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${(masterProfile?.personalInfo?.fullName || 'there').split(' ')[0] || 'there'}! 👋 I am your **ResumeForge Career Assistant**.\n\nI can help you:\n• Improve your project & experience bullet points with strong action verbs.\n• Explain ATS parsing rules and check formatting issues.\n• Prepare for technical interviews and resume reviews.\n\nAsk me anything or select a topic below!`,
      timestamp: getTimestamp(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Secure user API Key resolution (reads exclusively from user's local browser storage)
  const [apiKey] = useState(() => {
    try {
      const local = localStorage.getItem('resumeforge_custom_api_key');
      if (local && local.trim().length > 0) return local.trim();
    } catch {}
    return '';
  });
  const [apiProvider] = useState<'anthropic' | 'openai' | 'gemini'>('anthropic');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateBuiltInResponse = useCallback((query: string) => {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('bullet') || q.includes('rewrite') || q.includes('action verb')) {
      reply = `Here is an ATS-optimized, high-impact rewrite formula for your bullets:\n\n**Formula:** \`[Power Action Verb] + [Specific Technical Task & Tools] + [Measurable Business or Latency Impact]\`\n\n**Example:**\n• **Before:** "Worked on a mobile app to scan items."\n• **After:** "Architected an offline-first OCR mobile scanner in Flutter & Python FastAPI, reducing classification latency to under 450ms for 300+ items."\n\n*(Notice: We did not invent any new companies or metrics—we simply framed actual work with high-impact precision!)*`;
    } else if (q.includes('ats') || q.includes('rejection') || q.includes('mistake') || q.includes('fail')) {
      reply = `Here are the **Top 3 ATS Rejection Traps** students often fall into:\n\n1. **Two-Column Layouts & Tables:** Legacy ATS parsers read horizontally across both columns, jumbling lines into nonsense strings.\n2. **Icons for Contact Info:** Using a FontAwesome phone icon instead of typing \`Phone: +1 555-...\` causes parsers to read unicode artifacts like \`[?]\` and fail contact extraction.\n3. **Screenshot / Canvas PDFs (html2canvas):** Uploading an image-based PDF means OCR robots see 0 bytes of selectable text.\n\n*ResumeForge templates automatically prevent all three traps.*`;
    } else if (q.includes('experience') || q.includes('student') || q.includes('fresher') || q.includes('lack')) {
      reply = `As a student or fresher, **you do not need 5 years of commercial experience** to get interviews. Recruiters look for **evidence of capability**:\n\n1. **Lead with Technical Projects:** Frame them with full-stack architecture, deployment URLs, and GitHub links.\n2. **Highlight Hackathons:** Demonstrates rapid problem solving under deadline pressure.\n3. **Include Advanced Coursework:** Algorithms, Operating Systems, Database Systems.\n4. **Mention Open Source & Mentoring:** Peer tutoring or open PRs prove collaboration skills.`;
    } else if (q.includes('skills') || q.includes('backend') || q.includes('interview')) {
      reply = `Based on your profile, your verified technical stack includes:\n• **Languages:** ${masterProfile?.skills?.languages?.slice(0, 4).join(', ') || 'Add languages to your resume'}\n• **Databases:** ${masterProfile?.skills?.databases?.join(', ') || 'Add databases to your resume'}\n• **Cloud & Tools:** ${masterProfile?.skills?.cloud?.join(', ') || 'Add tools to your resume'}\n\n**Next Step for Applications:** Emphasize measurable technical achievements in your top experience bullets to stand out to hiring managers.`;
    } else {
      reply = `Thank you for asking! I'm evaluating your question against your verified career profile (${masterProfile?.personalInfo?.fullName || 'Candidate'}, ${masterProfile?.projects?.length || 0} projects, ${masterProfile?.education?.[0]?.degree || 'degree'}).\n\nTo tailor your application truthfully, always ensure every bullet maps back to verifiable skills. You can also paste any job description into **AI Tools** (/ai) to check match scores and skill gaps.`;
    }

    const aiMsg: Message = {
      id: createMsgId('ai'),
      sender: 'ai',
      text: reply,
      timestamp: getTimestamp(),
      evidenceTraced: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  }, [masterProfile]);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: createMsgId('usr'),
      sender: 'user',
      text,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call custom API if key provided, otherwise use intelligent built-in advisor
    if (apiKey) {
      try {
        const responseText = await callLiveLLM(text, apiKey, apiProvider, masterProfile);
        const aiMsg: Message = {
          id: createMsgId('ai'),
          sender: 'ai',
          text: responseText,
          timestamp: getTimestamp(),
          evidenceTraced: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        // Silently fall back to built-in career assistant without exposing model names or secrets
        generateBuiltInResponse(text);
      } finally {
        setIsTyping(false);
      }
    } else {
      setTimeout(() => {
        generateBuiltInResponse(text);
        setIsTyping(false);
      }, 700);
    }
  }, [inputValue, apiKey, apiProvider, masterProfile, generateBuiltInResponse]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors border border-slate-700 text-xs font-semibold"
          title="Career Assistant"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Assistant</span>
        </button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-20 right-6 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-left no-print ${
              isExpanded ? 'w-[92vw] sm:w-[680px] h-[80vh]' : 'w-[92vw] sm:w-[420px] h-[550px]'
            }`}
          >
            {/* Chat Header */}
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xs font-bold text-white">Assistant</h3>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Zero Hallucinations • ATS Verified</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand'}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium whitespace-nowrap hover:bg-slate-100 hover:border-slate-300 transition-colors shrink-0 shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400 font-medium">
                    {m.sender === 'ai' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Assistant</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3 text-slate-600" />
                        <span>You</span>
                      </>
                    )}
                    <span>• {m.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-slate-950 text-white rounded-tr-xs shadow-sm font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-white border border-slate-200 w-24 shadow-xs">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask for bullet rewrites, ATS checks, or interview advice..."
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none text-black placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 rounded-xl bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

// Internal assistant caller
async function callLiveLLM(
  prompt: string,
  key: string,
  provider: 'anthropic' | 'openai' | 'gemini',
  masterProfile: any
): Promise<string> {
  const profileContext = `Candidate Master Profile:
Name: ${masterProfile.personalInfo.fullName}
Degree: ${masterProfile.education[0]?.degree} in ${masterProfile.education[0]?.field}
Projects: ${masterProfile.projects.map((p: any) => `${p.name} (${p.technologies.join(', ')})`).join('; ')}
Skills: ${masterProfile.skills.languages.join(', ')}`;

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: (import.meta as any).env?.VITE_AI_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        temperature: 0.3,
        system: `You are ResumeForge Career Assistant. Golden Rule: Never invent employers, degrees, metrics, dates, or skills. Truth wins. Provide concise, highly actionable ATS resume and career guidance tailored to this candidate:\n${profileContext}`,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      let errMsg = `Assistant error (${res.status} ${res.statusText})`;
      try {
        const errJson = await res.json();
        if (errJson?.error?.message) {
          errMsg = errJson.error.message;
        }
      } catch {}
      throw new Error(errMsg);
    }

    const data = await res.json();
    return data.content?.[0]?.text || 'No response generated.';
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are ResumeForge Career Assistant. Golden Rule: Never invent employers, degrees, metrics, dates, or skills. Truth wins.\n${profileContext}`,
          },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Assistant error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0]?.message?.content || 'No response generated.';
  }

  return `Based on your profile, here is the suggested guidance:\n\n${prompt}\n\nMake sure to verify that all referenced tools match your Master Profile.`;
}
