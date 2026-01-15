# Grok AI 2.0 - Design System Spec

> [!IMPORTANT]
> **Core Aesthetic Philosophy**: "Midnight Premium". The interface should feel like it absorbs light. Pure blacks, distinct but subtle borders, and high-contrast text. No "gray slop".

## 1. Color Palette

### Surfaces
- **Universe Black (Background)**: `#000000` (The void)
- **Void Black (Panels/Modals)**: `#090909` (Slightly lighter than void)
- **Deep Space (Inputs)**: `#121212` (Distinguishable input fields)
- **Stellar (Accents)**: `#1E1E1E` (Hover states, secondary elements)

### Borders
- **Subtle (Dividers)**: `#1A1A1A`
- **Definition (Cards/Inputs)**: `#2A2A2A`
- **Focus Ring**: `rgba(255, 255, 255, 0.15)`

### Typography Colors
- **Starlight (Primary)**: `#FFFFFF` (100% Opacity)
- **Nebula (Secondary)**: `#8E8E93` (Subtle, readable gray)
- **Dimmed (Tertiary)**: `#555555` (Meta data)
- **Link**: `#FFFFFF` with `text-decoration: underline`

---

## 2. Typography System

**Primary Font**: Sans-serif (Inter / System UI).
**Code Font**: Monospace (JetBrains Mono / Fira Code / System Mono).

### Hierarchy
| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | `24px` | `600` (SemiBold) | `1.2` | `-0.02em` | Page Titles |
| **H2** | `20px` | `600` (SemiBold) | `1.3` | `-0.01em` | Section Headers |
| **H3** | `17px` | `600` (SemiBold) | `1.4` | `0` | Card Titles |
| **Body**| `15px` | `400` (Regular) | `1.6` | `0` | Chat Messages |
| **Mono**| `13px` | `400` (Regular) | `1.5` | `0` | Code Blocks |
| **Small**| `13px` | `500` (Medium) | `1.0` | `0` | Labels/Buttons |

### **Correction Protocol**
1.  **Bold Text**: Must be distinct. Use `font-semibold` (600) or `font-bold` (700) with `#FFFFFF`.
2.  **Italic Text**: Must use `text-gray-300` or lighter to ensure readability against black.

---

## 3. Layout & Spacing

### The Grid
- **Base Unit**: `4px`
- **Chat Container**: Max-width `800px` (Strictly centered)
- **Message Gap**: `32px` (Between different speakers)
- **Bubble Padding**: `12px 20px` (Horizontal breathing room)

### Alignments
- **User Messages**: Right aligned. Background: `#1A1A1A` (or subtle gradient).
- **Bot Messages**: Left aligned. Background: Transparent or `#000000`.
- **System Messages**: Center aligned.

### The "Scrollbar"
- **Width**: `8px`
- **Track**: Transparent
- **Thumb**: `#333333` (Rounded full) on hover `#555555`
- **Position**: Floating on the right edge, not taking layout space.

---

## 4. Components

### Code Blocks
- **Font**: Monospace.
- **Background**: `#0F0F0F`.
- **Border**: `1px solid #222`.
- **Header**: Flex row with language label and **Copy Button**.
- **Syntax Highlighting**: VSC Dark Plus or similar high-contrast theme.

### Tables
- **Container**: `border border-white/10 rounded-lg overflow-hidden`.
- **Header**: Background `#151515`, Text `#FFFFFF` Bold.
- **Row**: `border-b border-white/5` hover `#111`.
- **Cell**: Padding `12px 16px`.

### Chat Input
- **Shape**: Pill / Rounded.
- **Background**: `#000000` (or transparent with blur).
- **Border**: Top border only or floating island.
- **Spacing**: Significant whitespace (`60px+`) between last message and input area.

## 5. Assets
- **Logo**: Remove "HX" SVG. Replace with sleek typography "Helixar" or geometric abstract icon.
