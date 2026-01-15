import { Message, Role } from '../types';

export const mockChatHistory: Message[] = [
    {
        id: 'msg_1',
        role: 'user',
        content: 'Validate this idea.',
        timestamp: 1705290000000,
    },
    {
        id: 'msg_2',
        role: 'assistant',
        content: '_Thinking... Parsing video concept and analyzing viral potential..._',
        timestamp: 1705290005000,
    },
    {
        id: 'msg_3',
        role: 'assistant',
        content: '### Vertical Video Strategy\n\nI\'ve analyzed your concept for **"The Future of Remote Work"**. Here\'s the breakdown:\n\n*This topic is currently trending with a 15% increase in engagement over the last 30 days.*\n\nThe core appeal lies in the **freedom vs. isolation** paradox.',
        timestamp: 1705290010000,
    },
    {
        id: 'msg_4',
        role: 'assistant',
        content: 'Here are the key **Viral Triggers** identified:\n\n*   **Relatability:** The "Zoom Fatigue" visual hook.\n*   **Controversy:** "Offices are dead" statement.\n*   **Utility:** 3 tools to double productivity.\n*   **Aspiration:** Digital Nomad B-roll footage.',
        timestamp: 1705290015000,
    },
    {
        id: 'msg_5',
        role: 'user',
        content: 'The concept is basically a day-in-the-life style vlog where I start working from a cramped apartment in New York City, demonstrating the noise and chaos, then transition to a serene beachside cafe in Bali using a teleportation transition effect. I want to monologue about how technology has untethered us from geography but tethered us to time zones, essentially trading one constraint for another. It needs to feel cinematic but also raw and honest about the loneliness of being a digital nomad.',
        timestamp: 1705290030000,
    },
    {
        id: 'msg_6',
        role: 'assistant',
        content: '| Metric | Top Competitor | Average Niche | Viral Score |\n| :--- | :--- | :--- | :--- |\n| Views | 1.2M | 45K | 92/100 |\n| Retention | 65% | 40% | High |\n| Shares | 12K | 800 | Very High |',
        timestamp: 1705290035000,
    },
    {
        id: 'msg_7',
        role: 'assistant',
        content: '```json\n{\n  "meta_metrics": {\n    "estimated_views": 85000,\n    "keywords": ["digital nomad", "wfh", "travel vlog"],\n    "sentiment_score": 0.85\n  }\n}\n```',
        timestamp: 1705290040000,
    },
    {
        id: 'msg_8',
        role: 'assistant',
        content: '> **SYSTEM ALERT:** Network latency detected. Analysis quality may be slightly degraded. Re-connecting to Helixar Neural Engine...',
        timestamp: 1705290045000,
    },
];
