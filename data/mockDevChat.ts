import { Message, Role } from '../types';

export const mockDevChat: Message[] = [
    {
        id: 'dev_1',
        role: 'user',
        content: 'I need to build a high-performance analytics dashboard for a crypto trading platform. It needs to handle real-time WebSocket data for 50+ pairs and render sub-second updates without lag. Stack: Next.js, Tailwind, and maybe a specialized charting lib. Where do I start?',
        timestamp: 1705300000000,
    },
    {
        id: 'dev_2',
        role: 'assistant',
        content: '_Thinking... Analyzing performance constraints for high-frequency data rendering... Evaluating library options: Recharts vs Lightweight Charts..._',
        timestamp: 1705300005000,
    },
    {
        id: 'dev_3',
        role: 'assistant',
        content: '### Real-Time Architecture Strategy\n\nFor sub-second updates with that many pairs, React state updates will choke the main thread. You need a **bypass strategy**.\n\nHere is the recommended stack:\n\n*   **State Manager:** `Zustand` (transient updates) or direct ref manipulation.\n*   **Charting:** `TradingView Lightweight Charts` (Canvas-based, far superior performance to SVG-based Recharts).\n*   **Transport:** `Socket.io` or raw `WebSocket` with message batching.\n\nI\'ve sketched out the core data flow below:',
        timestamp: 1705300010000,
    },
    {
        id: 'dev_4',
        role: 'user',
        content: 'Okay, that makes sense. I don\'t want to use standard React state for the tick updates. Show me how to set up the Zustand store to handle high-frequency writes without re-rendering the whole component tree every tick.',
        timestamp: 1705300025000,
    },
    {
        id: 'dev_5',
        role: 'assistant',
        content: 'Exactly. We\'ll use **transient updates**. The idea is to subscribe only specific components to specific slices of state, or better yet, have the chart component listen directly to a stream.\n\nHere is a highly optimized Zustand store pattern for this:',
        timestamp: 1705300030000,
    },
    {
        id: 'dev_6',
        role: 'assistant',
        content: '```typescript\nimport { create } from \'zustand\';\nimport { subscribeWithSelector } from \'zustand/middleware\';\n\ntype PriceData = { price: number; volume: number; timestamp: number };\ntype MarketState = Record<string, PriceData>;\n\ninterface CryptoStore {\n  prices: MarketState;\n  updatePrice: (pair: string, data: PriceData) => void;\n}\n\nexport const useCryptoStore = create(\n  subscribeWithSelector<CryptoStore>((set) => ({\n    prices: {},\n    updatePrice: (pair, data) => set((state) => ({\n      prices: { ...state.prices, [pair]: data }\n    })),\n  }))\n);\n\n// Usage: Bind directly to the store for non-reactive access if needed\n// or use useCryptoStore.subscribe() in your Chart component\n```',
        timestamp: 1705300035000,
    },
    {
        id: 'dev_7',
        role: 'user',
        content: 'Nice. Now, I need a component that wraps the Lightweight Chart and connects to this store. Just show me the basic setup for one pair, say "BTC-USD".',
        timestamp: 1705300050000,
    },
    {
        id: 'dev_8',
        role: 'assistant',
        content: 'Here is the `PriceChart` component. Notice I\'m using a `useEffect` to subscribe to the store changes manually to update the chart series, avoiding React render cycles completely for price ticks.',
        timestamp: 1705300055000,
    },
    {
        id: 'dev_9',
        role: 'assistant',
        content: '```tsx\nimport React, { useEffect, useRef } from \'react\';\nimport { createChart } from \'lightweight-charts\';\nimport { useCryptoStore } from \'./store\';\n\nexport const PriceChart = ({ pair }: { pair: string }) => {\n  const containerRef = useRef<HTMLDivElement>(null);\n  const chartRef = useRef<any>(null);\n  const seriesRef = useRef<any>(null);\n\n  useEffect(() => {\n    if (!containerRef.current) return;\n\n    chartRef.current = createChart(containerRef.current, {\n      width: 600,\n      height: 300,\n      layout: { background: { color: \'#000\' }, textColor: \'#DDD\' },\n      grid: { vertLines: { color: \'#333\' }, horzLines: { color: \'#333\' } },\n    });\n\n    seriesRef.current = chartRef.current.addCandlestickSeries();\n\n    // Optimized Subscription: specific to this pair\n    const unsub = useCryptoStore.subscribe(\n      (state) => state.prices[pair],\n      (newPrice) => {\n        if (newPrice) seriesRef.current.update(newPrice);\n      }\n    );\n\n    return () => {\n      unsub();\n      chartRef.current.remove();\n    };\n  }, [pair]);\n\n  return <div ref={containerRef} className="w-full h-[300px]" />;\n};\n```',
        timestamp: 1705300060000,
    },
    {
        id: 'dev_10',
        role: 'user',
        content: 'Perfect. One last thing - what kind of WebSocket frame structure should I aim for to minimize bandwidth? I\'m paying for egress.',
        timestamp: 1705300075000,
    },
    {
        id: 'dev_11',
        role: 'assistant',
        content: 'To minimize payload size, avoid verbose JSON keys. improved Protobufs are ideal, but a compact array-based JSON structure is a good middle ground if you want human readability during debug.\n\n### Bandwidth Comparison\n\n| Format | Payload Structure | Size (Approx) | Parsing Cost |\n| :--- | :--- | :--- | :--- |\n| **Verbose JSON** | `{"pair":"BTC","p":40200,"v":1.5}` | ~35 bytes | Low |\n| **Compact JSON** | `["BTC",40200,1.5]` | ~18 bytes | Low |\n| **Protobuf** | (binary) | ~8 bytes | Medium |',
        timestamp: 1705300080000,
    },
];
