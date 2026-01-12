
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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
  Copy
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

// --- Components ---

const LoadingOverlay = ({ show, message }: { show: boolean, message?: string }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-[#0b0f1a]/95 backdrop-blur-2xl z-[200] flex items-center justify-center animate-fade-in-fast">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-2 border-violet-500/10 rounded-full"></div>
          <div className="w-24 h-24 border-2 border-violet-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          <Shield className="w-10 h-10 text-violet-500 absolute animate-pulse" />
        </div>
        <p className="mt-10 text-white font-black tracking-[0.4em] text-[9px] uppercase opacity-80">
          {message || "SECURE PROTOCOL INITIALIZING..."}
        </p>
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
      alert("দয়া করে সঠিক ট্রানজেকশন আইডি দিন");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 1500);
  };

  const finishAndHandoff = () => {
    onComplete(trxId);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 animate-fade-in-fast">
        <div className="w-24 h-24 bg-[#00A859] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/30 animate-slide-up">
          <Check className="w-12 h-12 text-white stroke-[3px]" />
        </div>
        <h2 className="text-[#00A859] text-2xl font-black mb-2 animate-slide-up">সফল হয়েছে!</h2>
        <p className="text-gray-500 text-sm font-bold text-center mb-10 animate-slide-up">পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। এখনই অর্ডারটি নিশ্চিত করুন।</p>
        
        <div className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-10 animate-slide-up">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Transaction ID</span>
            <span className="text-gray-800 font-black uppercase tracking-wider">{trxId.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Amount Paid</span>
            <span className="text-[#00A859] font-black">৳{selected.opt.price}</span>
          </div>
        </div>

        <button 
          onClick={finishAndHandoff}
          className="w-full bg-[#e2136e] hover:bg-[#c10e5d] py-5 rounded-2xl font-black text-white tracking-widest text-[12px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#e2136e]/20 active:scale-95 animate-slide-up"
        >
          CONFIRM ORDER <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#f5f5f5] flex flex-col animate-fade-in-fast font-sans">
      {/* bKash App Header */}
      <div className="bg-[#e2136e] p-6 pt-12 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-none">বিকাশ সেন্ড মানি</h1>
            <p className="text-[10px] opacity-80 mt-1 uppercase tracking-wider">bKash Send Money</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
           <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Bkash_logo.png" className="w-full h-full object-contain p-1 invert brightness-0" alt="bKash" />
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Recipient Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Recipient / প্রাপক</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-[#e2136e]">
                <Fingerprint className="w-6 h-6 text-[#e2136e]" />
              </div>
              <div>
                <p className="font-black text-gray-800 text-lg">{BKASH_NUMBER}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">NS WEB OFC (Personal)</p>
              </div>
            </div>
            <button 
              onClick={handleCopy}
              className={`p-3 rounded-xl flex items-center gap-2 transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-[#e2136e] active:scale-90'}`}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Amount Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Amount / পরিমাণ</p>
            <span className="text-[#00A859] font-black text-2xl">৳{selected.opt.price}</span>
          </div>
          <div className="h-[1px] bg-gray-100 w-full mb-6"></div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Reference / রেফারেন্স</p>
          <div className="bg-gray-50 p-4 rounded-xl text-gray-600 font-bold text-sm border border-gray-100">
            {selected.cat.name} ({selected.opt.days})
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-[#e2136e] shrink-0 mt-0.5" />
            <p className="text-gray-800 text-sm font-black">প্রথমে উপরের নাম্বারে টাকা সেন্ড মানি করুন, তারপর ট্রানজেকশন আইডি এখানে দিন।</p>
          </div>
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Enter Transaction ID (TRX ID)" 
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 font-black text-gray-800 focus:border-[#e2136e] focus:outline-none transition-all placeholder:text-gray-300 uppercase"
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
