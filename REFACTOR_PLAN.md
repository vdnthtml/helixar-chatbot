# Refactor Plan: Desktop & Mobile Split

I confirm that I understand the **Iron Rule**: The visuals of the Desktop Layout will remain completely unchanged. The move to `DesktopLayout.tsx` will be a strict code migration with no styling modifications.

## 1. State Lifting Strategy
To ensure data preservation during resize (The Traffic Cop's main duty), I will lift the following state variables from `App.tsx` and `ChatInput.tsx` into the main `App` component:

*   **Chat Data**: `sessions`, `currentSessionId`, `tempSession`.
*   **Input State**: `inputValue` (Currently internal to `ChatInput`, will be lifted to `App` to persist text on resize).
*   **UI State**: `isTyping`, `selectedModel`.
*   **Global Config**: `theme`, `accentColor`.
*   **Modals**: `isPricingOpen`, `isSettingsOpen`, `isShareOpen`, `isSearchOpen`.

**Note**: `isSidebarOpen` will likely remain in `DesktopLayout` unless you prefer it lifted, but typically mobile has its own navigation state. For now, I will keep layout-specific toggles inside their respective layouts unless otherwise instructed.

## 2. Proposed File Structure

*   `src/App.tsx` (Main Controller / Traffic Cop)
*   `src/components/layouts/DesktopLayout.tsx` (Encapsulated Desktop UI)
*   `src/components/layouts/MobileLayout.tsx` (New Mobile Shell)
*   `src/hooks/useIsMobile.ts` (Breakpoint detector)

## 3. Interfaces
`DesktopLayout` will receive a Prop interface containing all the lifted state and their updater functions (e.g., `onSendMessage`, `onToggleTheme`).

Awaiting your confirmation to execute.
