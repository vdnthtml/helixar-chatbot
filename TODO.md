# Helixar AI - Functional Gaps & Issues

## Broken Event Listeners & Empty Handlers

### App.tsx
- **Lines 314-332**: Top menu buttons (Move to project, Pin chat, Archive, Report) - No onClick handlers
- **Line 376**: "Cookie Preferences" span - No click handler

### ChatInput.tsx
- **Lines 59-103**: All MenuItem components in feature menu - No onClick handlers
  - Add photos & files
  - Add from Google Drive
  - Create image
  - Deep research
  - Shopping research
  - Thinking
  - Study and learn
  - Web search
  - Canvas
  - Quizzes
  - Your Year with Helixar
  - Explore apps
- **Line 134**: Microphone button - No onClick handler

### ChatMessage.tsx
- **Lines 93-95**: MenuItem components in message dropdown - No onClick handlers
  - Branch in new chat
  - Read aloud
  - Report message

### Sidebar.tsx
- **Line 78**: "Helix Dashboard" IconButton (collapsed view) - No onClick handler
- **Lines 127-132**: "Helix Dashboard" button (expanded view) - No onClick handler
- **Lines 139-142**: All HelixItem buttons - No onClick handlers
  - competitor analysis
  - AI script writter
  - comparison code
  - Explore Marketplace
- **Lines 149-156**: Project buttons - No onClick handlers
  - New project
  - X (project button)

### PricingModal.tsx
- **Lines 77, 104, 129**: Upgrade buttons - No onClick handlers
  - "Current Plan" button
  - "Upgrade to Helixar Pro" button
  - "Upgrade to Heavy" button

### SettingsModal.tsx
- **Line 55**: "Learn more" button in GroupChatModal - No onClick handler
- **Line 323**: "Separate voice mode" toggle - No onClick handler
- **Lines 353, 367, 385**: Personalization section interactions - No onClick handlers
  - Name toggle
  - Domain selector dropdown
  - "Receive feedback emails" checkbox
- **Lines 402, 427**: Account section buttons - No onClick handlers
  - "Manage" dropdown (subscription)
  - "Manage" button (payment)

### SearchOverlay.tsx
- **Line 53**: "Search inside a specific chat" button - No onClick handler
- **Lines 89-91**: Action buttons in history list - No onClick handlers
  - Open in external window
  - Edit
  - Delete
- **Lines 134-142**: Footer action buttons - No onClick handlers
  - Go
  - Edit
  - Delete

## Incomplete Sections / Placeholder Content

### SettingsModal.tsx
- **Lines 204-209**: Sections marked as "coming soon"
  - Notifications
  - Apps
  - Data controls
  - Security
  - Parental controls

### SearchOverlay.tsx
- **Line 49**: Placeholder text "google" in search input

### Sidebar.tsx
- **Line 155**: Incomplete project name "X"

## Missing Functionality

### App.tsx
- **Line 49**: "Cookie Preferences" functionality not implemented
- Temporary mode toggle (line 299) changes state but no actual functionality implemented

### ChatInput.tsx
- Voice input functionality (microphone button) - UI exists but no implementation
- All feature menu items exist but have no backend integration

### ChatMessage.tsx
- "Branch in new chat" - No implementation
- "Read aloud" - No implementation
- "Report message" - No implementation

### SearchOverlay.tsx
- "Thought for 5s" (line 110) - Appears to be placeholder/hardcoded text
- Keyboard shortcuts shown but not implemented (⏎, ⌘ E, ⌘ D)

## Recommendations

1. **Priority High**: Implement core button handlers for main navigation and actions
2. **Priority Medium**: Add console logging to all menu items to track user intent
3. **Priority Low**: Implement advanced features (voice, canvas, etc.)
4. **Code Quality**: Remove placeholder text and replace with actual content
5. **UX**: Add disabled states or tooltips for coming-soon features

## Notes
- No styling issues identified - all CSS appears intentional
- Some features may be intentionally unimplemented (future roadmap items)
- Consider adding a feature flag system for gradual rollout
