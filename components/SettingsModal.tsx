import React, { useState, useEffect, useRef } from 'react';

export type SettingsSection =
  | 'appearance'
  | 'personalization'
  | 'ambient'
  | 'model'
  | 'account'; // Keeping account for compatibility with Sidebar calls, though we might redirect it

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: SettingsSection;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
}

/* --- Reusable Components --- */

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-medium text-white mb-6">{children}</h3>
);

const Label = ({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-neutral-300 mb-2">
    {children}
  </label>
);

const HelperText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
    {children}
  </p>
);

const Input = ({ value, onChange, placeholder, type = 'text' }: { value: string | number, onChange: (val: any) => void, placeholder?: string, type?: string }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-[#1A1A1A] text-white text-sm px-4 py-3 rounded-xl border border-[#2A2A2D] focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-neutral-600"
  />
);

const TextArea = ({ value, onChange, placeholder, rows = 4 }: { value: string, onChange: (val: string) => void, placeholder?: string, rows?: number }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full bg-[#1A1A1A] text-white text-sm px-4 py-3 rounded-xl border border-[#2A2A2D] focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-neutral-600 resize-none"
  />
);

const Select = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: { label: string, value: string }[] }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1A1A1A] text-white text-sm px-4 py-3 rounded-xl border border-[#2A2A2D] focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
    </div>
  </div>
);

const SegmentedControl = ({ options, value, onChange }: { options: { label: string, value: string, icon?: React.ReactNode }[], value: string, onChange: (val: string) => void }) => (
  <div className="bg-[#1A1A1A] p-1 rounded-xl flex gap-1 border border-[#2A2A2D]">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-all ${value === opt.value
          ? 'bg-[#2A2A2D] text-white shadow-sm'
          : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
          }`}
      >
        {opt.icon}
        {opt.label}
      </button>
    ))}
  </div>
);

/* --- Feature Item Component for Model Cards --- */
const FeatureItem: React.FC<{ label: string; active?: boolean; icon?: string }> = ({ label, active, icon }) => (
  <li className={`flex items-start gap-2 text-xs ${active ? 'text-zinc-300' : 'text-zinc-500'}`}>
    <span className="mt-0.5 shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={active ? "text-white" : "text-zinc-600"}>
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    {label}
  </li>
);

/* --- Model Card Component --- */
const ModelCard = ({
  name,
  description,
  price,
  features,
  isActive,
  onClick,
  isPopular
}: {
  name: string,
  description: string,
  price: string,
  features: string[],
  isActive: boolean,
  onClick: () => void,
  isPopular?: boolean
}) => (
  <div
    onClick={onClick}
    className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${isActive
      ? 'bg-[#1A1A1A] border-white/20 ring-1 ring-white/10'
      : 'bg-[#0F0F0F] border-[#1E1E20] hover:border-[#2A2A2D] hover:bg-[#141414]'
      }`}
  >
    {isPopular && (
      <div className="absolute -top-3 right-4 bg-[#1E1E20] text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#2A2A2D]">
        Popular
      </div>
    )}
    <div className="mb-4">
      <h4 className="text-sm font-bold text-white mb-1">{name}</h4>
      <p className="text-xs text-zinc-500 font-medium mb-3">{description}</p>
      <div className="text-xl font-bold text-white">{price}</div>
    </div>
    <ul className="space-y-2 mb-4 flex-1">
      {features.map((feature, i) => (
        <FeatureItem key={i} label={feature} active={isActive} />
      ))}
    </ul>
    <div className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-center transition-colors ${isActive
      ? 'bg-white text-black'
      : 'bg-[#1E1E20] text-zinc-500'
      }`}>
      {isActive ? 'Current Model' : 'Select Model'}
    </div>
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSection = 'appearance',
  theme,
  setTheme
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');
  const modalRef = useRef<HTMLDivElement>(null);

  // Form State
  const [themeMode, setThemeMode] = useState<'light' | 'system' | 'dark'>(theme === 'light' ? 'light' : 'dark');
  const [shadows, setShadows] = useState('everywhere');
  const [preferredName, setPreferredName] = useState('Vedant Swami');
  const [email, setEmail] = useState('vedantswami2020@gmail.com');
  const [autoApprovedEmails, setAutoApprovedEmails] = useState('');
  const [responseStyle, setResponseStyle] = useState(`- Your email tone varies significantly depending on the context, ranging from highly professional to extremely direct.
- Your email structure tends to be concise and purpose-driven.`);
  const [calendarInfo, setCalendarInfo] = useState(`- Your calendar usage pattern suggests you may be someone who values spontaneity.
- As a young entrepreneur running Helixar, your minimal calendar structure might reflect a startup environment.`);
  const [businessInfo, setBusinessInfo] = useState('Helixar is an AI-powered content analysis platform specializing in video content breakdown and insights generation.');
  const [aboutUser, setAboutUser] = useState('Vedant Swami is a young entrepreneur and the Co-founder & CEO of Helixar.');
  const [timezone, setTimezone] = useState('Asia/Calcutta');
  const [dailyLimit, setDailyLimit] = useState(15);
  const [weeklyLimit, setWeeklyLimit] = useState(100);
  const [selectedModel, setSelectedModel] = useState('pro');

  useEffect(() => {
    if (isOpen) {
      // Map old 'account' or 'general' to 'personalization' or 'appearance' if needed, otherwise use initialSection
      if (initialSection === 'account') setActiveSection('personalization');
      else if (initialSection === 'general') setActiveSection('appearance');
      else setActiveSection(initialSection || 'appearance');
    }
  }, [isOpen, initialSection]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Sync theme with prop
  useEffect(() => {
    if (themeMode !== 'system') {
      setTheme(themeMode);
    }
  }, [themeMode, setTheme]);

  if (!isOpen) return null;

  const renderContent = () => {
    return (
      <div className="space-y-12 pb-12">
        {/* Appearance Section */}
        <div id="appearance">
          <SectionHeader>Appearance</SectionHeader>
          <div className="space-y-6">
            <div>
              <Label>Theme</Label>
              <div className="max-w-xs">
                <SegmentedControl
                  value={themeMode}
                  onChange={(v) => setThemeMode(v as any)}
                  options={[
                    { label: 'Light', value: 'light', icon: <SunIcon /> },
                    { label: 'System', value: 'system', icon: <MonitorIcon /> },
                    { label: 'Dark', value: 'dark', icon: <MoonIcon /> },
                  ]}
                />
              </div>
            </div>
            <div>
              <Label>Shadows</Label>
              <div className="max-w-xs">
                <SegmentedControl
                  value={shadows}
                  onChange={setShadows}
                  options={[
                    { label: 'Everywhere', value: 'everywhere', icon: <SunIcon /> }, // Using Sun as placeholder
                    { label: 'Home Only', value: 'home', icon: <MonitorIcon /> },
                  ]}
                />
              </div>
              <HelperText>Controls when animated shadows appear in the background. "Everywhere" shows shadows on all pages.</HelperText>
            </div>
          </div>
        </div>

        {/* Personalization Section */}
        <div id="personalization" className="pt-8 border-t border-white/5">
          <SectionHeader>Personalization</SectionHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Preferred Name</Label>
                <Input value={preferredName} onChange={setPreferredName} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={setEmail} />
              </div>
            </div>

            <div>
              <Label>Additional Auto-Approved Email Addresses</Label>
              <Input value={autoApprovedEmails} onChange={setAutoApprovedEmails} placeholder="Type email and press space or comma..." />
              <HelperText>Email addresses added here will not require approval when sending emails in flows with auto-approve mode.</HelperText>
            </div>

            <div>
              <Label>How should CoFounder respond to you?</Label>
              <Input
                value=""
                onChange={() => { }}
                placeholder="e.g., Be concise, formal, friendly..."
              />
            </div>

            <div>
              <Label>How should CoFounder respond to emails?</Label>
              <TextArea value={responseStyle} onChange={setResponseStyle} rows={6} />
            </div>

            <div>
              <Label>What are some things CoFounder should know about your calendar?</Label>
              <TextArea value={calendarInfo} onChange={setCalendarInfo} rows={6} />
            </div>

            <div>
              <Label>Tell CoFounder about your business</Label>
              <TextArea value={businessInfo} onChange={setBusinessInfo} rows={6} />
            </div>

            <div>
              <Label>Tell CoFounder about yourself</Label>
              <TextArea value={aboutUser} onChange={setAboutUser} rows={6} />
            </div>

            <div>
              <Label>Timezone</Label>
              <Select
                value={timezone}
                onChange={setTimezone}
                options={[
                  { label: 'Asia/Calcutta', value: 'Asia/Calcutta' },
                  { label: 'America/New_York', value: 'America/New_York' },
                  { label: 'Europe/London', value: 'Europe/London' },
                  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Ambient Suggestions Section */}
        <div id="ambient" className="pt-8 border-t border-white/5">
          <SectionHeader>Ambient Suggestions</SectionHeader>
          <p className="text-sm text-neutral-400 mb-6 font-normal">
            CoFounder proactively monitors your connected integrations and surfaces high-value opportunities for you to act on. Configure limits below.
          </p>
          <div className="space-y-6 max-w-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>Daily suggestion limit</Label>
                <HelpIcon />
              </div>
              <Input value={dailyLimit} onChange={setDailyLimit} type="number" />
              <HelperText>Maximum ambient suggestions per day (0-50). Set to 0 to disable.</HelperText>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>Weekly suggestion limit</Label>
                <HelpIcon />
              </div>
              <Input value={weeklyLimit} onChange={setWeeklyLimit} type="number" />
              <HelperText>Maximum ambient suggestions per week (0-350). Set to 0 to disable.</HelperText>
            </div>
          </div>
        </div>

        {/* Model Selection Section */}
        <div id="model" className="pt-8 border-t border-white/5">
          <SectionHeader>Model Configuration</SectionHeader>
          <p className="text-sm text-neutral-400 mb-6">
            Choose the AI model that best fits your workflow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ModelCard
              name="Helixar Mini"
              description="Fast & Efficient"
              price="Free"
              features={['Standard speed', 'Basic reasoning', '16k context']}
              isActive={selectedModel === 'mini'}
              onClick={() => setSelectedModel('mini')}
            />
            <ModelCard
              name="Helixar Standard"
              description="Balanced"
              price="$10/mo"
              features={['Fast response', 'Enhanced logic', '32k context', 'Priority support']}
              isActive={selectedModel === 'standard'}
              onClick={() => setSelectedModel('standard')}
            />
            <ModelCard
              name="Helixar Pro"
              description="Maximum Power"
              price="$30/mo"
              features={['Top-tier reasoning', '128k context', 'Voice Mode', 'Imagine generation']}
              isActive={selectedModel === 'pro'}
              onClick={() => setSelectedModel('pro')}
              isPopular
            />
          </div>
        </div>
      </div>
    );
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="w-[1000px] h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Sidebar */}
        <aside className="w-[240px] hidden md:flex flex-col border-r border-white/5 p-6 bg-[#0A0A0A]">
          <h2 className="text-xl font-medium text-white mb-8 px-2">Settings</h2>
          <nav className="space-y-1">
            <NavTab label="Appearance" onClick={() => scrollToSection('appearance')} />
            <NavTab label="Personalization" onClick={() => scrollToSection('personalization')} />
            <NavTab label="Ambient Suggestions" onClick={() => scrollToSection('ambient')} />
            <NavTab label="Model Configuration" onClick={() => scrollToSection('model')} />
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-black p-8 md:p-12 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const NavTab = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
  >
    {label}
  </button>
);

/* --- Icons --- */
const SunIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2m0 18v2m9-11h-2M5 12H3m16.36-6.36l-1.4 1.4M6.04 19.98l-1.4-1.4M18.36 18.36l-1.4-1.4M6.04 4.04l-1.4 1.4"></path></svg>;
const MoonIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const MonitorIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const HelpIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
