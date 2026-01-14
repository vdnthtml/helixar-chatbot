# Grok AI - Design System

## Color Palette

### Background Colors
- **Primary Background**: `#000000` (Pure Black)
- **Secondary Background**: `#0A0A0A` (Near Black)
- **Card/Panel Background**: `#1A1A1A` (Dark Gray)
- **Input Background**: `#1E1E20` (Darker Gray)
- **Elevated Surface**: `#2A2A2D` (Medium Dark Gray)

### Border Colors
- **Primary Border**: `#2A2A2D` (Subtle Dark Gray)
- **Secondary Border**: `#3A3A3C` (Medium Gray Border)
- **Focus Border**: `#FFFFFF` (White - subtle)

### Text Colors
- **Primary Text**: `#FFFFFF` (White)
- **Secondary Text**: `#8E8E93` (Light Gray)
- **Tertiary Text**: `#5C5C5E` (Medium Gray)
- **Disabled Text**: `#3A3A3C` (Dark Gray)
- **Link Text**: `#FFFFFF` (White with underline)

### Accent Colors
- **Brand/Logo**: `#00D4AA` (Teal/Cyan)
- **Interactive Elements**: `#FFFFFF` (White)
- **Hover State**: `#2A2A2D` (Slight elevation)

### Button Colors
- **Primary Button Background**: `#FFFFFF` (White)
- **Primary Button Text**: `#000000` (Black)
- **Secondary Button Background**: `#1A1A1A` (Dark Gray)
- **Secondary Button Text**: `#FFFFFF` (White)
- **Disabled Button**: `#2A2A2D` (Medium Dark Gray)
- **Disabled Button Text**: `#5C5C5E` (Medium Gray)

### Status Colors
- **Beta Badge Background**: `#2A2A2D`
- **Beta Badge Text**: `#FFFFFF`

---

## Typography

### Font Family
- **Primary Font**: Sans-serif (likely Inter, SF Pro, or similar modern sans-serif)
- **Monospace Font**: Monospace (for code/technical elements)

### Font Sizes
- **Hero/Logo**: `32px` - `40px`
- **Page Title**: `24px` - `28px`
- **Section Heading**: `18px` - `20px`
- **Body Large**: `16px`
- **Body Medium**: `14px`
- **Body Small**: `13px`
- **Caption**: `12px`
- **Micro**: `10px` - `11px`

### Font Weights
- **Light**: `300`
- **Regular**: `400`
- **Medium**: `500`
- **Semi-Bold**: `600`
- **Bold**: `700`

### Line Heights
- **Tight**: `1.2` (Headings)
- **Normal**: `1.5` (Body text)
- **Relaxed**: `1.75` (Long-form content)

### Letter Spacing
- **Tight**: `-0.02em` (Large headings)
- **Normal**: `0`
- **Wide**: `0.05em` (All caps labels)

---

## Button Styles

### Primary Button (White)
- **Background**: `#FFFFFF`
- **Text Color**: `#000000`
- **Border Radius**: `24px` (Pill-shaped)
- **Padding**: `12px 24px`
- **Font Size**: `14px`
- **Font Weight**: `600`
- **Shadow**: `0 2px 8px rgba(255, 255, 255, 0.1)`
- **Hover**: Slight opacity decrease to `0.9`
- **Active**: Scale down to `0.98`

### Secondary Button (Dark)
- **Background**: `#1A1A1A`
- **Text Color**: `#FFFFFF`
- **Border**: `1px solid #2A2A2D`
- **Border Radius**: `24px`
- **Padding**: `12px 24px`
- **Font Size**: `14px`
- **Font Weight**: `600`
- **Hover**: Background `#2A2A2D`

### Icon Button
- **Background**: Transparent
- **Border Radius**: `8px` - `12px`
- **Padding**: `8px`
- **Size**: `32px x 32px` or `40px x 40px`
- **Hover**: Background `#1A1A1A`

### Small Button
- **Border Radius**: `20px`
- **Padding**: `8px 16px`
- **Font Size**: `12px`
- **Font Weight**: `600`

### Button States
- **Default**: Full opacity
- **Hover**: Opacity `0.9` or background change
- **Active/Pressed**: Transform `scale(0.98)`
- **Disabled**: Opacity `0.5`, cursor `not-allowed`
- **Focus**: Outline `2px solid #FFFFFF` with `4px` offset

---

## Spacing System

### Base Unit
- **Base**: `4px`

### Spacing Scale
- **XXS**: `4px` (0.25rem)
- **XS**: `8px` (0.5rem)
- **SM**: `12px` (0.75rem)
- **MD**: `16px` (1rem)
- **LG**: `24px` (1.5rem)
- **XL**: `32px` (2rem)
- **2XL**: `48px` (3rem)
- **3XL**: `64px` (4rem)
- **4XL**: `96px` (6rem)

### Component Spacing
- **Input Padding**: `12px 16px`
- **Card Padding**: `24px`
- **Modal Padding**: `32px`
- **Section Gap**: `24px` - `32px`
- **List Item Gap**: `8px` - `12px`
- **Button Gap** (in groups): `8px` - `12px`

### Layout Spacing
- **Container Max Width**: `1200px` - `1400px`
- **Content Max Width**: `800px` - `1000px`
- **Sidebar Width**: `280px` - `320px`
- **Collapsed Sidebar Width**: `60px` - `80px`

---

## Border Radius

### Scale
- **None**: `0px`
- **XS**: `4px` (Small elements)
- **SM**: `8px` (Cards, inputs)
- **MD**: `12px` (Panels)
- **LG**: `16px` (Modals)
- **XL**: `20px` (Large cards)
- **2XL**: `24px` (Pills, rounded buttons)
- **Full**: `9999px` or `50%` (Circles, pills)

---

## Shadows

### Elevation Levels
- **Level 0** (Flat): `none`
- **Level 1** (Subtle): `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Level 2** (Card): `0 4px 8px rgba(0, 0, 0, 0.15)`
- **Level 3** (Elevated): `0 8px 16px rgba(0, 0, 0, 0.2)`
- **Level 4** (Modal): `0 16px 32px rgba(0, 0, 0, 0.3)`
- **Level 5** (Maximum): `0 24px 48px rgba(0, 0, 0, 0.4)`

### Special Shadows
- **Focus Shadow**: `0 0 0 4px rgba(255, 255, 255, 0.1)`
- **Glow Effect**: `0 0 20px rgba(0, 212, 170, 0.3)` (Brand color glow)

---

## Input Styles

### Text Input
- **Background**: `#1E1E20`
- **Border**: `1px solid #2A2A2D`
- **Border Radius**: `24px` (Pill-shaped)
- **Padding**: `12px 16px`
- **Font Size**: `14px`
- **Placeholder Color**: `#5C5C5E`
- **Text Color**: `#FFFFFF`
- **Focus Border**: `1px solid #3A3A3C`
- **Focus Shadow**: `0 0 0 4px rgba(255, 255, 255, 0.05)`

### Toggle Switch
- **Width**: `44px`
- **Height**: `24px`
- **Border Radius**: `12px` (Full)
- **Thumb Size**: `20px`
- **Off Background**: `#2A2A2D`
- **On Background**: `#FFFFFF` or accent color
- **Thumb Color**: `#FFFFFF`

---

## Modal/Dialog Styles

### Settings Modal
- **Background**: `#1E1E20`
- **Border**: `1px solid #2A2A2D`
- **Border Radius**: `24px` - `32px`
- **Padding**: `32px` - `40px`
- **Shadow**: `0 24px 48px rgba(0, 0, 0, 0.4)`
- **Backdrop**: `rgba(0, 0, 0, 0.6)` with blur

---

## Icon Sizes

- **Small**: `16px x 16px`
- **Medium**: `20px x 20px`
- **Large**: `24px x 24px`
- **XLarge**: `32px x 32px`

---

## Animation & Transitions

### Duration
- **Fast**: `150ms`
- **Normal**: `200ms` - `250ms`
- **Slow**: `300ms` - `350ms`

### Easing
- **Standard**: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Decelerate**: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- **Accelerate**: `cubic-bezier(0.4, 0.0, 1, 1)`

### Common Transitions
- **Background**: `background-color 200ms ease`
- **Color**: `color 200ms ease`
- **Transform**: `transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Opacity**: `opacity 200ms ease`
- **All**: `all 200ms ease`

---

## Notes

- **Dark Mode First**: This design system is built with dark mode as the primary theme
- **Consistency**: Maintain consistent spacing using the 4px base unit
- **Accessibility**: Ensure all interactive elements have sufficient contrast (WCAG AA minimum)
- **Touch Targets**: Minimum touch target size of `44px x 44px` for mobile
- **Focus States**: Always provide visible focus indicators for keyboard navigation
