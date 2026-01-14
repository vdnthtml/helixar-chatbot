
import React, { useState, useEffect, useRef } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [segment, setSegment] = useState<'individual' | 'business'>('individual');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto no-scrollbar py-10 px-4">
      {/* Background Star Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div ref={modalRef} className="relative w-full max-w-6xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-0 -top-8 lg:top-0 p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4 text-4xl lg:text-5xl font-semibold tracking-tight">
            <span className="text-white">helixar</span>
            <div className="relative flex items-center px-3 py-1 border-2 border-[#00bcd4] rounded-[14px]">
              <span className="text-[#00bcd4] text-3xl lg:text-4xl">pro</span>
            </div>
          </div>
          <p className="text-[#8e8e93] text-lg font-medium">Introducing Helixar 4.1<br />The most powerful AI model</p>
        </div>

        {/* Toggle Individual/Business */}
        <div className="flex p-1 bg-[#1a1a1c] rounded-full mb-12 border border-[#2a2a2d]">
          <button
            onClick={() => setSegment('individual')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${segment === 'individual' ? 'bg-[#2a2a2d] text-white shadow-lg' : 'text-[#5c5c5e] hover:text-zinc-300'}`}
          >
            Individual
          </button>
          <button
            onClick={() => setSegment('business')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${segment === 'business' ? 'bg-[#2a2a2d] text-white shadow-lg' : 'text-[#5c5c5e] hover:text-zinc-300'}`}
          >
            Business
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Basic Plan */}
          <div className="bg-[#121214] border border-[#1e1e20] rounded-[32px] p-8 flex flex-col hover:border-[#2a2a2d] transition-colors">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#8e8e93] mb-1">Basic</h3>
              <div className="text-4xl font-bold text-white">Free</div>
            </div>

            <button onClick={() => console.log('Current Plan clicked')} className="w-full py-3 px-4 rounded-full bg-[#1e1e20] text-zinc-500 font-bold text-sm mb-10 transition-colors">
              Current Plan
            </button>

            <ul className="space-y-4 flex-1 text-sm text-[#8e8e93]">
              <FeatureItem label="Limited access to chat models" />
              <FeatureItem label="Limited context memory" />
              <FeatureItem label="Aurora image model" />
              <FeatureItem label="Voice access" />
              <FeatureItem label="Projects" />
              <FeatureItem label="Tasks" />
            </ul>
          </div>

          {/* Helixar Pro Plan */}
          <div className="bg-[#121214] border border-[#1e1e20] rounded-[32px] p-8 flex flex-col relative scale-105 shadow-2xl z-10 hover:border-[#2a2a2d] transition-colors">
            <div className="absolute -top-3 right-8 bg-[#1e1e20] text-zinc-400 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-[#2a2a2d]">
              Popular
            </div>
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#8e8e93] mb-1">Helixar Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">₹700.00</span>
                <span className="text-xs text-[#5c5c5e] font-medium">INR/month</span>
              </div>
            </div>

            <button onClick={() => console.log('Upgrade to Helixar Pro clicked')} className="w-full py-3 px-4 rounded-full bg-white text-black font-bold text-sm mb-10 hover:bg-zinc-200 transition-colors">
              Upgrade to Helixar Pro
            </button>

            <ul className="space-y-4 flex-1 text-sm text-[#8e8e93]">
              <FeatureItem active label="Increased access to Helixar 4.1" />
              <li className="pl-6 text-[11px] -mt-3 text-[#5c5c5e]">Improved reasoning and search capabilities</li>
              <FeatureItem label="Extended memory 128,000 tokens" icon="info" />
              <FeatureItem label="Priority voice access" icon="voice" />
              <FeatureItem label="Imagine image model" icon="image" />
              <FeatureItem label="Companions Ani and Valentine" icon="comp" />
              <FeatureItem label="Everything in Basic" icon="plus" />
            </ul>
          </div>

          {/* Helixar Pro Heavy Plan */}
          <div className="bg-[#121214] border border-[#1e1e20] rounded-[32px] p-8 flex flex-col hover:border-[#2a2a2d] transition-colors">
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#8e8e93] mb-1">Helixar Pro Heavy</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$300.00</span>
                <span className="text-xs text-[#5c5c5e] font-medium">USD/month</span>
              </div>
            </div>

            <button onClick={() => console.log('Upgrade to Heavy clicked')} className="w-full py-3 px-4 rounded-full bg-[#e3e3e3] text-black font-bold text-sm mb-10 hover:bg-white transition-colors">
              Upgrade to Heavy
            </button>

            <ul className="space-y-4 flex-1 text-sm text-[#8e8e93]">
              <FeatureItem active label="Exclusive preview of Helixar 4 Heavy" icon="bolt" />
              <FeatureItem label="Extended access to Helixar 4.1" />
              <FeatureItem label="Longest memory 256,000 tokens" icon="info" />
              <FeatureItem label="Early access to new features" icon="flask" />
              <FeatureItem label="Everything in Helixar Pro" icon="plus" />
            </ul>
          </div>
        </div>

        {/* Yearly Billing Toggle */}
        <div className="mt-12 flex items-center gap-4 text-sm font-medium text-[#8e8e93]">
          <span>Save with yearly billing</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-1 ${isYearly ? 'bg-indigo-600' : 'bg-[#1e1e20]'}`}
          >
            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isYearly ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ label, active, icon }: { label: string; active?: boolean; icon?: string }) => (
  <li className={`flex items-start gap-3 ${active ? 'text-zinc-200' : ''}`}>
    <span className="mt-0.5 shrink-0">
      {icon === 'bolt' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-2 10h3L11 22l2-10h-3l2-10z"></path></svg> :
        icon === 'info' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> :
          icon === 'voice' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg> :
            icon === 'image' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg> :
              icon === 'comp' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> :
                icon === 'flask' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12"></path><path d="M8 11h8"></path><path d="M10 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3"></path><path d="M14 3v12a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V3"></path><path d="M8.5 21h7"></path></svg> :
                  icon === 'plus' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> :
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>}
    </span>
    {label}
  </li>
);
