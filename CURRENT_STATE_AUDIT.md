# Current State Artifact: Helixar AI

## 1. Data Schema Audit
**Status:** 🔴 **No External Database / MCP Connected**

Currently, the application relies entirely on **Client-Side Storage**. There is no SQL or NoSQL database connected.

### Local Storage Schema
The application uses browser `localStorage` for persistence.
- **Key:** `helixar_sessions`
  - **Structure:** Array of `ChatSession` objects.
  - **JSON Payload:**
    ```typescript
    interface ChatSession {
      id: string;        // Random math string (e.g., "x7z9q")
      title: string;     // Chat title
      messages: Message[]; // Array of message objects
      updatedAt: number; // Timestamp
      isGroup: boolean;  // Boolean flag
      groupLink: string; // Fake generated link
    }
    ```
- **Key:** `helixar_theme` ('dark' | 'light')
- **Key:** `helixar_accent` (Hex color string)

## 2. Logic Flow & State Machine
**Core Logic:** Client-Side React SPA (Single Page Application).

1.  **Initialization**:
    - App loads -> Checks `localStorage` -> Loads sessions into React `useState`.
    - If no sessions, creates a fresh session ID locally.

2.  **Messaging Flow**:
    - User types message -> `handleSendMessage` updates local state immediately.
    - **API Call**: Triggers `triggerModelResponse`.
    - **Endpoint**: Direct call to Google Gemini API (`@google/genai` SDK) using `process.env.API_KEY`.
    - **Response**: AI text is appended to local state -> `useEffect` syncs to `localStorage`.

3.  **Features**:
    - **Group Chat**: Sets a local flag `isGroup: true` and generates a dummy URL. **Does not actually create a server-side session.**
    - **Sharing**: Generates a dummy URL `https://helixar.ai/share/{id}`. **Link is non-functional for recipients** (404 or empty) because data lives only in the creator's browser.

## 3. Gap Analysis
**Critical Missing Components:**

| Component | Status | Impact |
| :--- | :--- | :--- |
| **Database** | ❌ Missing | No data persistence across devices. Clearing cache deletes all history. |
| **Backend API** | ❌ Missing | "Group Chat" and "Share" features are dead links. |
| **MCP Integration** | ❌ Missing | No connection to Model Context Protocol (databases, tools, etc.). |
| **Markdown Rendering** | ⚠️ Limited | Messages render as raw text. Code blocks and formatting will not display correctly. |
| **Authentication** | ❌ Missing | No user accounts. Everyone is an anonymous local user. |

## 4. Security & Access Audit

### API Permissions
- **Google Gemini API**: Accessed directly from the client browser.
  - **Key Location**: `process.env.API_KEY` embedded in client bundle.
  - **Risk**: 🔴 **High**. The API key is exposed to any user who inspects the network traffic or application bundle. Usage quotas could be drained by malicious actors.

### Browser/Client Security
- **XSS Vulnerability**: 🟢 **Low**. React automatic escaping is in use. No `dangerouslySetInnerHTML` found.
- **Data Privacy**: ⚠️ **Medium**. Chat history is stored unencrypted in `localStorage`. Any script running on the same domain (or XSS vulnerability) can read all chat history.

### Access Control
- **Authorization**: None. No barriers to entry.
- **Row Level Security**: N/A (No database).

---
**Recommendation**:
1.  Move API calls to a backend proxy/Edge Function to hide the API Key.
2.  Implement a real database (Supabase, Postgres, or Firebase) to support Sharing and Group Chat.
3.  Add Markdown rendering support for better AI response display.
