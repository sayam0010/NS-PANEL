
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  ChevronRight, 
  Lock, 
  Unlock, 
  LayoutGrid, 
  MessageCircle, 
  ChevronDown, 
  Info,
  ArrowLeft,
  Smartphone,
  Cpu,
  Zap,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Shield,
  Crown,
  Trophy,
  ExternalLink,
  Target,
  Users,
  ShieldAlert,
  MousePointer2,
  Fingerprint,
  Wallet,
  ArrowRight,
  Check,
  Copy,
  Search,
  AlertTriangle,
  XCircle,
  Cpu as CpuIcon,
  Loader2,
  Globe,
  Database,
  Terminal,
  Percent,
  Activity,
  ZapOff,
  User,
  Info as InfoIcon,
  MoreVertical,
  HelpCircle,
  Menu
} from 'lucide-react';

// --- Data Types & Constants ---

interface PanelOption {
  days: string;
  price: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  options: PanelOption[];
  color: string;
  accentColor: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'drip-clint',
    name: "Drip Clint",
    icon: <Target className="w-6 h-6" />,
    color: "text-violet-400",
    accentColor: "#8b5cf6",
    options: [
      { days: "১০ দিন", price: "৫০০" },
      { days: "১৫ দিন", price: "৭০০" },
      { days: "৩০ দিন", price: "১০৫০" },
    ]
  },
  {
    id: 'hg-cheats',
    name: "Hg cheats",
    icon: <Cpu className="w-6 h-6" />,
    color: "text-blue-400",
    accentColor: "#3b82f6",
    options: [
      { days: "৭ দিন", price: "৪৫০" },
      { days: "১৫ দিন", price: "৬০০" },
      { days: "৩০ দিন", price: "৯০০" },
    ]
  },
  {
    id: 'br-mood-non-root',
    name: "BR MOOD non root 📱",
    icon: <Smartphone className="w-6 h-6" />,
    color: "text-emerald-400",
    accentColor: "#10b981",
    options: [
      { days: "৯ দিন", price: "৭০০" },
      { days: "১৫ দিন", price: "৯০০" },
      { days: "৩০ দিন", price: "১৪০০" },
    ]
  },
  {
    id: 'br-mood-root',
    name: "Br mood root 📱",
    icon: <ShieldAlert className="w-6 h-6" />,
    color: "text-red-400",
    accentColor: "#ef4444",
    options: [
      { days: "৯ দিন", price: "৪০০" },
      { days: "১৫ দিন", price: "৬০০" },
      { days: "৩০ দিন", price: "৯০০" },
    ]
  },
  {
    id: 'pato-team',
    name: "PATO TEAM",
    icon: <Users className="w-6 h-6" />,
    color: "text-amber-400",
    accentColor: "#f59e0b",
    options: [
      { days: "১ দিন", price: "২৫০" },
      { days: "৩ দিন", price: "৫০০" },
      { days: "৭ দিন", price: "৮০০" },
    ]
  }
];

const TELEGRAM_LINK = "https://t.me/+Kgd26o643BBmNzc9";
const WHATSAPP_NUMBER = "8801646414859";
const BKASH_NUMBER = "01646414859";

// --- Utility Functions ---

const generateIDFromIP = async () => {
  const storedId = localStorage.getItem('ns_user_id');
  if (storedId) return storedId;

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    const ip = data.ip;
    
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash |= 0; 
    }
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    let tempHash = Math.abs(hash);
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(tempHash % chars.length);
      tempHash = Math.floor(tempHash / chars.length);
    }
    
    if (id.length < 6) id = "NS" + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    localStorage.setItem('ns_user_id', id);
    return id;
  } catch (e) {
    const fallback = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('ns_user_id', fallback);
    return fallback;
  }
};

// --- Components ---

const LoadingOverlay = ({ show, message }: { show: boolean, message?: string }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-[#0b0f1a]/95 backdrop-blur-2xl z-[300] flex items-center justify-center animate-fade-in-fast">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-violet-500/10 rounded-full"></div>
          <div className="w-24 h-24 border-2 border-violet-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <Shield className="w-10 h-10 text-violet-500 absolute animate-pulse" />
        </div>
        <p className="mt-10 text-white font-black tracking-[0.4em] text-[9px] uppercase opacity-80 text-center px-6 leading-relaxed">
          {message || "SECURE PROTOCOL INITIALIZING..."}
        </p>
      </div>
    </div>
  );
};

const RootCheckerAI = () => {
  const [model, setModel] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditData, setAuditData] = useState<{
    status: string;
    percentage: string;
    explanation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkRoot = async () => {
    if (!model.trim()) {
      setError("দয়া করে ফোনের মডেল বা সিরিয়াল নাম্বার দিন");
      return;
    }

    setIsAnalyzing(true);
    setAuditData(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search Google for real-time rooting status of "${model}". Determine if the bootloader can be unlocked today.
        
        RULES:
        1. Accuracy is priority. Be honest if it's impossible (Oppo, Vivo, newer Huawei usually No).
        2. Status: "হ্যাঁ", "না", or "সম্ভবত".
        
        FORMAT (Short only):
        Line 1: Status
        Line 2: Success %
        Line 3: Reasoning (Bengali, max 8 words).`,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
          topP: 0.8
        }
      });

      const text = response.text || "";
      const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
      
      if (lines.length >= 3) {
        setAuditData({
          status: lines[0],
          percentage: lines[1],
          explanation: lines[2]
        });
      } else {
        setAuditData({
          status: lines[0]?.includes("না") ? "না" : (lines[0]?.includes("হ্যাঁ") ? "হ্যাঁ" : "সম্ভবত"),
          percentage: text.match(/\d+%/)?.[0] || "0%",
          explanation: text.split('\n').pop()?.slice(0, 50) || "তথ্য পাওয়া যায়নি।"
        });
      }
    } catch (err) {
      setError("সার্ভার ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest">ROOT CHECKER</h2>
        </div>
      </div>
      
      <p className="text-slate-400 text-[12px] leading-relaxed font-medium opacity-80">
        সঠিক তথ্য পেতে ফোনের সঠিক মডেল বা মডেল নাম্বার দিন।
      </p>
      
      <div className="relative">
        <input
          type="text"
          placeholder="e.g. Redmi Note 12 or SM-G991B"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 font-bold text-slate-100 focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-slate-700"
        />
        <Terminal className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
      </div>

      <button 
        onClick={checkRoot}
        disabled={isAnalyzing}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/10 disabled:opacity-50"
      >
        {isAnalyzing ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> SCANNING...</>
        ) : (
          <><Search className="w-4 h-4" /> DEEP SEARCH SCAN</>
        )}
      </button>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold flex items-center gap-3 animate-fade-in-fast">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {auditData && (
        <div className="p-6 rounded-[2rem] bg-black/40 border border-emerald-500/20 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <span className="text-[10px] font-black text-emerald-400">{auditData.percentage} Possible</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
             <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Verdict</span>
                <span className={`text-2xl font-black ${auditData.status === 'না' ? 'text-red-500' : (auditData.status === 'হ্যাঁ' ? 'text-emerald-400' : 'text-amber-400')}`}>
                  {auditData.status}
                </span>
             </div>
             <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                <p className="text-slate-300 text-[12px] leading-relaxed font-bold">{auditData.explanation}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <InfoIcon className="w-5 h-5 text-violet-400" />
        <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest">ABOUT US</h2>
      </div>
      <div className="space-y-4">
        <p className="text-slate-400 text-[13px] leading-relaxed font-medium opacity-80">
          NS WEB OFC দীর্ঘ ৩ বছর ধরে গেমিং কমিউনিটিতে বিশ্বস্ততার সাথে কাজ করে আসছি।
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-[9px] font-black text-slate-200 uppercase tracking-wider">Trusted</p>
          </div>
          <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl">
            <Zap className="w-5 h-5 text-amber-400 mb-2" />
            <p className="text-[9px] font-black text-slate-200 uppercase tracking-wider">Fast</p>
          </div>
        </div>
        <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl mt-2">
           <p className="text-slate-300 text-[10px] leading-relaxed text-center font-bold">
            "গেমারদের সেরা অভিজ্ঞতা এবং নিরাপত্তা নিশ্চিত করাই আমাদের লক্ষ্য।"
           </p>
        </div>
      </div>
    </div>
  );
};

const SideMenu = ({ isOpen, onClose, onSelectUtility }: { isOpen: boolean, onClose: () => void, onSelectUtility: (u: 'about' | 'root') => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] animate-fade-in-fast">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 left-0 h-full w-[280px] bg-[#0b0f1a] border-r border-white/5 shadow-3xl flex flex-col p-8 animate-slide-right">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-lg shadow-violet-600/30">NS</div>
            <span className="text-sm font-black text-white tracking-widest">MENU</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <nav className="space-y-4">
          <button onClick={() => onSelectUtility('about')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all text-left group">
            <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform"><InfoIcon className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-black text-slate-100 uppercase tracking-widest">About Us</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Our Mission</p>
            </div>
          </button>

          <button onClick={() => onSelectUtility('root')} className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all text-left group">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><Smartphone className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-black text-slate-100 uppercase tracking-widest">Root Checker</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">AI Device Scan</p>
            </div>
          </button>

          <a href={TELEGRAM_LINK} target="_blank" className="w-full flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all text-left group">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform"><Send className="w-5 h-5" /></div>
            <div>
              <p className="text-[11px] font-black text-slate-100 uppercase tracking-widest">Telegram</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Official News</p>
            </div>
          </a>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2">SYSTEM</p>
          <div className="flex items-center gap-3 text-slate-400">
             <Globe className="w-3 h-3" />
             <span className="text-[8px] font-bold tracking-widest uppercase">Version 2.4.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UtilityModal = ({ utility, onClose }: { utility: 'about' | 'root' | null, onClose: () => void }) => {
  if (!utility) return null;
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 animate-fade-in-fast">
      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-md" onClick={onClose} />
      <div className="w-full max-w-sm bg-[#0b0f1a] border border-white/[0.08] rounded-[3rem] p-8 shadow-[0_30px_100px_-15px_rgba(0,0,0,1)] relative overflow-hidden animate-slide-up">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] -mr-12 -mt-12 ${utility === 'about' ? 'bg-violet-500/10' : 'bg-emerald-500/10'}`}></div>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-600 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        <div className="relative z-10">
          {utility === 'about' ? <AboutUs /> : <RootCheckerAI />}
        </div>
      </div>
    </div>
  );
};

// --- bKash UI Components ---

const BkashCheckoutFlow = ({ 
  selected, 
  onClose, 
  onComplete 
}: { 
  selected: { cat: Category, opt: PanelOption }, 
  onClose: () => void,
  onComplete: (trxId: string) => void
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!trxId || trxId.length < 6) {
      alert("সঠিক ট্রানজেকশন আইডি দিন");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  const finishAndHandoff = () => onComplete(trxId);

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[2000] bg-white flex flex-col items-center justify-center p-8 animate-fade-in-fast">
        <div className="w-20 h-20 bg-[#00A859] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/30 animate-slide-up">
          <Check className="w-10 h-10 text-white stroke-[3px]" />
        </div>
        <h2 className="text-[#00A859] text-2xl font-black mb-2 animate-slide-up">সফল হয়েছে!</h2>
        <p className="text-gray-500 text-xs font-bold text-center mb-10 animate-slide-up">পেমেন্ট সম্পন্ন। এডমিন ভেরিফাই করবে।</p>
        <div className="w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-10 animate-slide-up">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">TRX ID</span>
            <span className="text-gray-800 font-black uppercase">{trxId.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Amount Paid</span>
            <span className="text-[#00A859] font-black">৳{selected.opt.price}</span>
          </div>
        </div>
        <button onClick={finishAndHandoff} className="w-full bg-[#e2136e] py-5 rounded-2xl font-black text-white tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 animate-slide-up">
          CONFIRM ORDER <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-[#f5f5f5] flex flex-col animate-fade-in-fast font-sans">
      <div className="bg-[#e2136e] p-6 pt-10 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-base font-bold leading-none">বিকাশ পেমেন্ট</h1>
            <p className="text-[9px] opacity-80 mt-1 uppercase tracking-wider">bKash Send Money</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-3">Recipient / প্রাপক</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border-2 border-[#e2136e]"><Fingerprint className="w-5 h-5 text-[#e2136e]" /></div>
              <div><p className="font-black text-gray-800 text-base">{BKASH_NUMBER}</p><p className="text-[9px] text-gray-400 font-bold">Personal Account</p></div>
            </div>
            <button onClick={handleCopy} className={`p-2 rounded-xl flex items-center gap-2 transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[#e2136e]'}`}>
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
           "
            />
            <ShieldCheck className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 ${trxId.length > 5 ? 'text-[#00A859]' : 'text-gray-200'} transition-colors`} />
          </div>

          <button 
            disabled={isProcessing}
            onClick={handleConfirm}
            className="w-full bg-[#00A859] hover:bg-[#008f4c] py-5 rounded-2xl font-black text-white tracking-widest text-[12px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-green-500/20 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'CONFIRM PAYMENT'}
          </button>
        </div>
      </div>

      {/* bKash Footer Accent */}
      <div className="p-8 text-center bg-white border-t border-gray-100">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Powered by bKash Secure Gateway</p>
      </div>
    </div>
  );
};

const Header = ({ title, showBack, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
  <header className="sticky top-0 z-50 bg-[#0b0f1a]/70 backdrop-blur-3xl border-b border-white/[0.03] h-20 flex items-center px-6 shadow-2xl">
    {showBack && (
      <button 
        onClick={onBack} 
        className="p-3 -ml-3 hover:bg-white/[0.05] rounded-2xl transition-all active:scale-90 group"
      >
        <ArrowLeft className="w-5 h-5 text-slate-100 group-hover:text-violet-400 transition-colors" />
      </button>
    )}
    <div className={`flex-1 flex justify-center items-center ${showBack ? 'pr-10' : ''}`}>
      <h1 className="text-[10px] font-black tracking-[0.6em] text-white neon-text uppercase text-center select-none opacity-90">
        {title}
      </h1>
    </div>
  </header>
);

const TelegramLandingScreen = ({ onJoin }: { onJoin: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    setLoading(true);
    window.open(TELEGRAM_LINK, '_blank');
    setTimeout(() => {
      onJoin();
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0f1a] relative overflow-hidden">
      <LoadingOverlay show={loading} message="AUTHENTICATING SESSION..." />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="w-full max-w-sm relative z-10 animate-fade-in">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-[3.5rem] p-10 flex flex-col items-center text-center shadow-3xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-blue-500/10 rounded-[2.2rem] flex items-center justify-center mb-8 border border-blue-500/20 shadow-inner relative">
            <Send className="w-10 h-10 text-blue-400" />
            <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">NS WEB <span className="text-blue-400">OFC</span></h2>
          <div className="space-y-2 mb-10">
            <p className="text-slate-300 text-lg font-bold">প্রথম চ্যানেল এ join হন</p>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Join our Telegram to continue</p>
          </div>
          
          <div className="w-full space-y-4">
            <button onClick={handleJoin} className="w-full bg-blue-500 hover:bg-blue-400 py-6 rounded-3xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 text-white transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.97]">
              JOIN OUR TELEGRAM <ExternalLink className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onJoin}
              className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] text-slate-400 flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/5"
            >
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              ALREADY JOINED
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 opacity-30">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">System Verified Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ onNavigateToPaid }: { onNavigateToPaid: () => void }) => {
  const [loading, setLoading] = useState(false);
  const openUrl = (url: string) => {
    setLoading(true);
    setTimeout(() => {
      window.open(url, '_blank');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-10 animate-fade-in max-w-lg mx-auto pb-24">
      <LoadingOverlay show={loading} />
      <section className="bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-8 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/[0.05] rounded-full blur-[80px]"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-violet-500/10 rounded-xl border border-violet-500/20">
            <Info className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">Notice Board</h2>
        </div>
        <div className="text-slate-400 text-[13px] leading-relaxed mb-8 font-medium opacity-80 space-y-2">
          <p>"আমাদের প্রিমিয়াম প্যানেলে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% নিরাপদ এবং এন্টি-ব্যান গ্যারান্টি।"</p>
          <p>"যেকোনো প্রকার টেকনিক্যাল সমস্যা হলে সরাসরি আমাদের টেলিগ্রাম চ্যানেলে মেসেজ করুন।"</p>
          <p>"প্রতিটি প্যানেল নিয়মিত আপডেট করা হয়। আপনার গেমিং অভিজ্ঞতাকে প্রো লেভেলে নিতে আমাদের সাথেই থাকুন।"</p>
        </div>
        <button onClick={() => openUrl(TELEGRAM_LINK)} className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-slate-100 active:scale-[0.98] shadow-2xl shadow-white/5">
          <Send className="w-4 h-4" /> JOIN TELEGRAM
        </button>
      </section>

      <section onClick={onNavigateToPaid} className="relative group cursor-pointer">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-blue-600/30 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-[#0b0f1a] border border-white/[0.08] rounded-[3.5rem] p-12 flex flex-col items-center text-center shadow-3xl transition-all duration-500 group-hover:translate-y-[-6px] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="w-24 h-24 bg-violet-500/5 rounded-[2.2rem] flex items-center justify-center mb-8 border border-white/[0.03] shadow-inner relative">
            <Shield className="w-12 h-12 text-violet-500" />
            <Crown className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 drop-shadow-lg" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[9px] font-black text-violet-400 uppercase tracking-[0.4em]">Premium Access</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-5">PAID <span className="text-violet-500">PRO</span></h2>
          <p className="text-slate-500 text-xs font-bold mb-10 max-w-[220px] leading-loose opacity-70">প্রিমিয়াম প্যানেল কিনুন - দ্রুত, নিরাপদ এবং ১০০% ট্রাস্টেড সার্ভিস।</p>
          <div className="flex items-center gap-4 px-10 py-5 bg-white/[0.03] rounded-2xl border border-white/[0.05] group-hover:border-violet-500/30 transition-all duration-500">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Launch Panel</span>
            <ChevronRight className="w-4 h-4 text-violet-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      <section onClick={() => openUrl(TELEGRAM_LINK)} className="bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] p-6 cursor-pointer flex items-center justify-between transition-all hover:bg-white/[0.03] active:scale-[0.98] group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white/[0.02] rounded-2xl flex items-center justify-center text-slate-500 border border-white/[0.03] group-hover:text-white transition-colors">
            <Unlock className="w-6 h-6" />
          </div>
          <div><h2 className="text-base font-black text-slate-200 tracking-tight">FREE PANEL</h2><p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">Standard Edition</p></div>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.05] transition-all"><ChevronRight className="w-4 h-4 text-slate-600" /></div>
      </section>

      <footer className="pt-16 text-center pb-8">
        <div className="flex items-center justify-center gap-4 mb-5 opacity-30"><div className="h-[1px] w-12 bg-white"></div><Trophy className="w-4 h-4 text-white" /><div className="h-[1px] w-12 bg-white"></div></div>
        <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.5em] mb-3 select-none">Trusted By Elite Players</p>
        <p className="text-slate-800 text-[8px] font-bold uppercase tracking-[0.2em]">NS WEB OFC &copy; 2024</p>
      </footer>
    </div>
  );
};

const PaidPanelSelectionScreen = ({ onBack }: { onBack: () => void }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ cat: Category, opt: PanelOption } | null>(null);
  const [showBkash, setShowBkash] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOptionSelect = (cat: Category, opt: PanelOption) => {
    setSelectedOption({ cat, opt });
  };

  const clearSelection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedOption(null);
  };

  const handleStartCheckout = () => {
    if (!selectedOption) return;
    setShowBkash(true);
  };

  const handleCompleteOrder = (trxId: string) => {
    if (!selectedOption) return;
    setLoading(true);
    
    const { cat, opt } = selectedOption;
    const upperTrxId = trxId.toUpperCase();
    const message = `🔥 NEW ORDER CONFIRMED 🔥\nPackage: ${cat.name}\nDuration: ${opt.days}\nPrice: ৳${opt.price}\n\nTransaction ID: ${upperTrxId}\n\nStatus: Paid via bKash\nVerification: Pending Review\n\nআপনি অপেক্ষা করুন এডমিন আপনার পেমেন্ট confirm করবে এবং আপনাকে প্যানেল দিবে ধন্যবাদ ❤️`;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    setTimeout(() => {
      window.open(url, '_blank');
      setLoading(false);
      setShowBkash(false);
      setSelectedOption(null);
    }, 800);
  };

  return (
    <div className="animate-fade-in max-w-lg mx-auto min-h-screen pb-48 relative">
      <LoadingOverlay show={loading} />

      {showBkash && selectedOption && (
        <BkashCheckoutFlow 
          selected={selectedOption} 
          onClose={() => setShowBkash(false)} 
          onComplete={handleCompleteOrder} 
        />
      )}

      {selectedOption && !showBkash && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-500 animate-fade-in-fast" onClick={() => clearSelection()} />
      )}
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4 px-3">
          <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_var(--primary-glow)]"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Inventory / Packages</p>
        </div>

        {CATEGORIES.map((category) => (
          <div key={category.id} className={`bg-white/[0.01] border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedId === category.id ? 'border-violet-500/20 bg-white/[0.03]' : 'border-white/[0.05]'}`}>
            <button onClick={() => handleCategoryClick(category.id)} className="w-full p-6 flex items-center justify-between outline-none group">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 bg-[#0b0f1a] rounded-[1.4rem] border border-white/[0.05] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-violet-500/30 ${category.color}`}>
                  <div className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">{category.icon}</div>
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-100 text-[15px] tracking-tight group-hover:text-white transition-colors">{category.name}</h3>
                  <div className="flex items-center gap-2 mt-1 opacity-40"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span className="text-[9px] text-slate-100 uppercase font-black tracking-widest">Secure Patch</span></div>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${expandedId === category.id ? 'rotate-180 bg-violet-500/10 text-violet-400' : 'text-slate-700 bg-white/[0.03] group-hover:bg-white/[0.06]'}`}><ChevronDown className="w-4 h-4" /></div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${expandedId === category.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><div className="p-6 pt-0 space-y-3">
              {category.options.map((opt, idx) => {
                const isSelected = selectedOption?.cat.id === category.id && selectedOption?.opt.days === opt.days;
                return (
                  <div key={idx} className="relative group">
                    <button onClick={() => handleOptionSelect(category, opt)} className={`w-full flex items-center justify-between p-5 rounded-[1.8rem] border transition-all duration-300 ${isSelected ? 'border-violet-500 bg-violet-500/10 shadow-2xl' : 'border-white/[0.04] bg-[#0b0f1a]/40 hover:border-white/[0.1]'}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all ${isSelected ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' : 'bg-white/[0.03] text-slate-600'}`}>{idx + 1}</div>
                        <span className={`font-black text-sm tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`}>{opt.days}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-black text-xl transition-colors ${isSelected ? 'text-violet-400' : 'text-slate-200'}`}>৳{opt.price}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-violet-500 bg-violet-500' : 'border-white/[0.05]'}`}>{isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                      </div>
                    </button>
                    {isSelected && <button onClick={clearSelection} className="absolute -top-1 -right-1 w-8 h-8 bg-[#0b0f1a] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-3xl z-10 animate-fade-in"><X className="w-4 h-4" /></button>}
                  </div>
                );
              })}
            </div></div></div>
          </div>
        ))}

        {!selectedOption && (
          <div className="mt-12 py-10 flex flex-col items-center justify-center animate-fade-in opacity-40 group pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4 transition-transform group-hover:translate-y-[-4px]"><MousePointer2 className="w-5 h-5 text-slate-600 animate-pulse" /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">প্রথমে একটি প্যাকেজ নির্বাচন করুন</p>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-800 mt-2">Select a plan to continue</p>
          </div>
        )}
      </div>

      {selectedOption && !showBkash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
          <div className="w-full max-w-sm bg-[#0b0f1a] border border-white/[0.08] rounded-[3.5rem] p-10 shadow-[0_30px_100px_-15px_rgba(0,0,0,1)] pointer-events-auto animate-slide-up relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/[0.05] rounded-full blur-[60px] -mr-16 -mt-16"></div>
            <button onClick={() => clearSelection()} className="absolute top-8 right-8 p-2 text-slate-600 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            <div className="mb-10">
              <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-violet-500/20"><ShieldCheck className="w-8 h-8 text-violet-400" /></div>
              <p className="text-violet-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Secure Order Hub</p>
              <h4 className="text-3xl font-black text-white leading-tight mb-4 tracking-tighter">{selectedOption.cat.name}</h4>
              <div className="flex flex-col items-center gap-3">
                 <div className="px-5 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]"><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{selectedOption.opt.days} Package</span></div>
                 <span className="text-3xl font-black text-white neon-text">৳{selectedOption.opt.price}</span>
              </div>
            </div>
            <div className="space-y-6">
              <button onClick={handleStartCheckout} className="w-full bg-violet-600 hover:bg-violet-500 py-6 rounded-[2rem] font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 text-white transition-all shadow-2xl shadow-violet-600/30 active:scale-[0.97]">
                <CreditCard className="w-5 h-5" /> BUY PAID PANEL
              </button>
              <div className="flex items-center justify-center gap-3 opacity-30"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-400">Encrypted Transaction Flow</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'home' | 'paid'>('landing');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const handleJoinedTelegram = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f1a] selection:bg-violet-500/20 text-slate-100 overflow-x-hidden font-sans">
      {currentScreen === 'landing' ? (
        <TelegramLandingScreen onJoin={handleJoinedTelegram} />
      ) : currentScreen === 'home' ? (
        <>
          <Header title="NS WEB OFC" />
          <main className="flex-1">
            <HomeScreen onNavigateToPaid={() => setCurrentScreen('paid')} />
          </main>
        </>
      ) : (
        <>
          <Header 
            title="SECURE CHECKOUT" 
            showBack 
            onBack={() => setCurrentScreen('home')} 
          />
          <main className="flex-1">
            <PaidPanelSelectionScreen onBack={() => setCurrentScreen('home')} />
          </main>
        </>
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
