import { Message, Role } from '../types';

export const mockDesignChat: Message[] = [
    {
        id: 'design_1',
        role: 'user',
        content: 'I need to redesign the settings panel for our mobile app. Users complain it\'s cluttered. I want something clean, like iOS settings but with a dark, futuristic neon accent. Can you generate a layout idea and color palette?',
        timestamp: 1705310000000,
    },
    {
        id: 'design_2',
        role: 'assistant',
        content: '_Thinking... Accessing design systems knowledge base... Synthesizing "Futuristic Neon" with "iOS Minimal"..._',
        timestamp: 1705310005000,
    },
    {
        id: 'design_3',
        role: 'assistant',
        content: '### Design Concept: "Neon Glass" \n\nFor a clutter-free but futuristic look, we should use **Glassmorphism** combined with high-contrast neon accents. Instead of long lists, we\'ll use **grouped cards**.\n\n#### Recommended Palette\n\n| Color Name | Hex Code | Usage |\n| :--- | :--- | :--- |\n| **Void Black** | `#050505` | Background |\n| **Glass Surface** | `#1A1A1A` | Card Background (with blur) |\n| **Cyber Lime** | `#CCFF00` | Primary Actions / Toggles |\n| **Electric Blue** | `#00F0FF` | Active States / Icons |',
        timestamp: 1705310010000,
    },
    {
        id: 'design_4',
        role: 'user',
        content: 'I like the palette. particularly Cyber Lime. Show me a React component structure for one of these "grouped cards" - maybe the "Notifications" section. Use Tailwind for the styling.',
        timestamp: 1705310025000,
    },
    {
        id: 'design_5',
        role: 'assistant',
        content: 'Got it. We\'ll build a `SettingsGroup` component. I\'ll use `backdrop-blur` for the glass effect and `accent-[#CCFF00]` for the toggles.\n\nHere is the component implementation:',
        timestamp: 1705310030000,
    },
    {
        id: 'design_6',
        role: 'assistant',
        content: '```tsx\nimport React, { useState } from \'react\';\n\ninterface ToggleItemProps {\n  label: string;\n  description?: string;\n  isActive: boolean;\n  onToggle: () => void;\n}\n\nconst ToggleItem = ({ label, description, isActive, onToggle }: ToggleItemProps) => (\n  <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">\n    <div>\n      <div className="text-sm font-medium text-white">{label}</div>\n      {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}\n    </div>\n    <button \n      onClick={onToggle}\n      className={`w-12 h-7 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-[#CCFF00]/50 ${isActive ? \'bg-[#CCFF00]\' : \'bg-white/10\'}`}\n    >\n      <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-black shadow-sm transition-transform duration-300 ${isActive ? \'translate-x-5\' : \'translate-x-0\'}`} />\n    </button>\n  </div>\n);\n\nexport const NotificationSettings = () => {\n  const [pushEnabled, setPushEnabled] = useState(true);\n  const [emailEnabled, setEmailEnabled] = useState(false);\n\n  return (\n    <div className="w-full max-w-md mx-auto">\n      <h3 className="text-xs font-bold text-[#CCFF00] uppercase tracking-wider mb-3 px-1">Notifications</h3>\n      <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">\n        <ToggleItem \n          label="Push Notifications" \n          description="Real-time alerts for new messages"\n          isActive={pushEnabled}\n          onToggle={() => setPushEnabled(!pushEnabled)}\n        />\n        <ToggleItem \n          label="Email Digest" \n          description="Weekly summary of activity"\n          isActive={emailEnabled}\n          onToggle={() => setEmailEnabled(!emailEnabled)}\n        />\n      </div>\n    </div>\n  );\n};\n```',
        timestamp: 1705310035000,
    },
    {
        id: 'design_7',
        role: 'user',
        content: 'That looks clean. Now, how should the transition work when I click a toggle? I want it to feel "alive".',
        timestamp: 1705310050000,
    },
    {
        id: 'design_8',
        role: 'assistant',
        content: '_Thinking... Evaluating animation curves... Spring vs Ease-out..._',
        timestamp: 1705310055000,
    },
    {
        id: 'design_9',
        role: 'assistant',
        content: 'To make it feel "alive" and responsive, you should use a **spring animation** rather than a linear duration. It adds a subtle "bounce" that mimics physical toggles.\n\nIn Tailwind config, extend your `transitionTimingFunction` or use a library like `framer-motion` for best results. If sticking to pure CSS/Tailwind:\n\n1.  **Add this class:** `transition-[background-color,transform]`\n2.  **Duration:** `duration-300` seems right, but try `duration-500` with a custom bezier.\n3.  **Haptic:** If possible, trigger a light haptic feedback on mobile tap.',
        timestamp: 1705310060000,
    },
];
