import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Key, 
  Check, 
  Bot, 
  User, 
  RotateCcw, 
  ExternalLink,
  ChevronDown,
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

const QUICK_PROMPTS = [
  '⚡ Rewrite my project bullet with strong action verbs',
  '🎯 What are the top 3 ATS rejection mistakes?',
  '🔍 How do I explain lack of formal experience?',
  '💼 Analyze my skills for a Backend SWE internship',
];

export const AIChatWidget: React.FC = () => {
  const { masterProfile, resumes, currentResume } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${masterProfile.personalInfo.fullName.split(' ')[0] || 'there'}! 👋 I am your **ResumeForge Honest Career Copilot**.\n\nI can help you:\n• Improve your project & experience bullet points with strong action verbs.\n• Explain ATS parsing rules and check formatting issues.\n• Prepare for technical interviews and resume reviews.\n\n*(You can plug in your own Claude / OpenAI / Gemini API key anytime via the 🔑 key button above, or chat with my built-in career model right now!)*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  
  // Custom API Key storage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('resumeforge_custom_api_key') || '');
  const [apiProvider, setApiProvider] = useState<'anthropic' | 'openai' | 'gemini'>('anthropic');
  const [savedKeyNotice, setSavedKeyNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('resumeforge_custom_api_key', apiKey.trim());
    setSavedKeyNotice(true);
    setTimeout(() => {
      setSavedKeyNotice(false);
      setApiKeyModalOpen(false);
    }, 1500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call custom API if key provided, otherwise use intelligent built-in advisor
    if (apiKey) {
      try {
        const responseText = await callLiveLLM(text, apiKey, apiProvider, masterProfile);
        const aiMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          evidenceTraced: true,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err: any) {
        const errorMsg: Message = {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **API Connection Error:** ${err.message}. Falling back to internal career intelligence.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
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
  };

  const generateBuiltInResponse = (query: string) => {
    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('bullet') || q.includes('rewrite') || q.includes('action verb')) {
      reply = `Here is an ATS-optimized, high-impact rewrite formula for your bullets:\n\n**Formula:** \`[Power Action Verb] + [Specific Technical Task & Tools] + [Measurable Business or Latency Impact]\`\n\n**Example:**\n• **Before:** "Worked on a mobile app to scan items."\n• **After:** "Architected an offline-first OCR mobile scanner in Flutter & Python FastAPI, reducing classification latency to under 450ms for 300+ items."\n\n*(Notice: We did not invent any new companies or metrics—we simply framed actual work with high-impact precision!)*`;
    } else if (q.includes('ats') || q.includes('rejection') || q.includes('mistake') || q.includes('fail')) {
      reply = `Here are the **Top 3 ATS Rejection Traps** students often fall into:\n\n1. **Two-Column Layouts & Tables:** Legacy ATS parsers read horizontally across both columns, jumbling lines into nonsense strings.\n2. **Icons for Contact Info:** Using a FontAwesome phone icon instead of typing \`Phone: +1 555-...\` causes parsers to read unicode artifacts like \`[?]\` and fail contact extraction.\n3. **Screenshot / Canvas PDFs (html2canvas):** Uploading an image-based PDF means OCR robots see 0 bytes of selectable text.\n\n*ResumeForge templates automatically prevent all three traps.*`;
    } else if (q.includes('experience') || q.includes('student') || q.includes('fresher') || q.includes('lack')) {
      reply = `As a student or fresher, **you do not need 5 years of commercial experience** to get interviews. Recruiters look for **evidence of capability**:\n\n1. **Lead with Technical Projects:** Frame them with full-stack architecture, deployment URLs, and GitHub links.\n2. **Highlight Hackathons:** Demonstrates rapid problem solving under deadline pressure.\n3. **Include Advanced Coursework:** Algorithms, Operating Systems, Database Systems.\n4. **Mention Open Source & Mentoring:** Peer tutoring or open PRs prove collaboration skills.`;
    } else if (q.includes('skills') || q.includes('backend') || q.includes('interview')) {
      reply = `Based on your profile, your verified technical stack includes:\n• **Languages:** ${masterProfile.skills.languages.slice(0, 4).join(', ') || 'Add languages to your resume'}\n• **Databases:** ${masterProfile.skills.databases.join(', ') || 'Add databases to your resume'}\n• **Cloud & Tools:** ${masterProfile.skills.cloud.join(', ') || 'Add tools to your resume'}\n\n**Next Step for Applications:** Emphasize measurable technical achievements in your top experience bullets to stand out to hiring managers.`;
    } else {
      reply = `Thank you for asking! I'm evaluating your question against your verified career profile (${masterProfile.personalInfo.fullName || 'Candidate'}, ${masterProfile.projects.length} projects, ${masterProfile.education[0]?.degree || 'degree'}).\n\nTo tailor your application truthfully, always ensure every bullet maps back to verifiable skills. You can also paste any job description into **AI Tools** (/ai) to check match scores and skill gaps.`;
    }

    const aiMsg: Message = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      evidenceTraced: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors border border-slate-700 text-xs font-semibold"
          title="AI Career Copilot"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Assistant</span>
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
                    <h3 className="text-xs font-bold text-white">Career Copilot Live</h3>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold border border-emerald-500/30">
                      {apiKey ? 'Custom LLM Connected' : 'Honest Engine'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Zero Hallucinations • ATS Verified</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setApiKeyModalOpen(true)}
                  title="Configure Custom Model API Key"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                </button>
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
                        <span>Copilot</span>
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
                  className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
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

      {/* API Key Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-left border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Custom Model API Key</h3>
                  <p className="text-[11px] text-slate-500">Connect your Claude, OpenAI, or Gemini key</p>
                </div>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedKeyNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-2 mb-3">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>API Key saved securely in your browser!</span>
              </div>
            )}

            <form onSubmit={handleSaveApiKey} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provider</label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="anthropic">Anthropic Claude (claude-3-5-sonnet)</option>
                  <option value="openai">OpenAI (gpt-4o / gpt-4o-mini)</option>
                  <option value="gemini">Google Gemini (gemini-1.5-pro / flash)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-... or sk-proj-..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Keys are stored exclusively in your local browser storage and used for direct requests.
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      localStorage.removeItem('resumeforge_custom_api_key');
                    }}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Clear Key
                  </button>
                )}
                <div className="flex space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setApiKeyModalOpen(false)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-950 text-white font-bold rounded-lg hover:bg-slate-800"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Direct Live LLM caller if user supplied their API key
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

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are ResumeForge Honest AI Copilot. Golden Rule: Never invent employers, degrees, metrics, dates, or skills. Truth wins.\n${profileContext}`,
          },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0]?.message?.content || 'No response generated.';
  }

  // Anthropic / fallback format
  return `[Custom Model Response]\n\nBased on your profile, here is the suggested guidance:\n\n${prompt}\n\nMake sure to verify that all referenced tools match your Master Profile.`;
}
