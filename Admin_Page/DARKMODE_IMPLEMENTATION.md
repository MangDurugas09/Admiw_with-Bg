# Dark Mode Toggle Implementation

This document explains the dark mode/light mode toggle implementation for the ElectriPay Admin Dashboard.

## Features

✨ **Key Features:**

- **Smooth 0.5s transitions** between light and dark modes
- **Glassmorphism design** with frosted glass effect
- **Persistent storage** - saves user preference to localStorage
- **System preference detection** - respects OS dark mode settings
- **Accessible** - keyboard navigation support, ARIA labels
- **Professional aesthetics** - industrial power grid theme with day/night contrast

## Files Created

### 1. **styles/darkmode.css**

Main stylesheet with all theme variables, glass-morphism cards, and toggle styles.

**Key CSS Variables:**

```css
:root {
  --transition-duration: 0.5s;
  --light-bg: linear-gradient(135deg, #f0f4f8 0%, #d9e8f5 100%);
  --dark-bg: linear-gradient(135deg, #0a1a3a 0%, #1a2a4a 100%);
  --accent-light: #f4bf24;
  --accent-dark: #ffd700;
}
```

**Color Palette:**

- **Light Mode**: Bright whites, warm accents (#f4bf24), clear backgrounds
- **Dark Mode**: Deep navy (#020a2b), electric cyan accents (#12c6ff), glassmorphism overlays

### 2. **lib/darkModeContext.tsx**

React Context for managing dark mode state across your app.

**Usage:**

```tsx
import { DarkModeProvider, useDarkMode } from "@/lib/darkModeContext";

// Wrap your app with provider
<DarkModeProvider>
  <App />
</DarkModeProvider>;

// Use the hook in components
function MyComponent() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <button onClick={toggleDarkMode}>
      Current mode: {isDarkMode ? "Dark" : "Light"}
    </button>
  );
}
```

### 3. **components/ThemeToggle.tsx**

React component for the toggle switch UI.

**Usage in Your Pages:**

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Dashboard() {
  return (
    <div>
      <ThemeToggle />
      {/* Rest of your content */}
    </div>
  );
}
```

### 4. **darkmode-demo.html**

Standalone demo page showing the complete implementation with vanilla JavaScript.

**To view the demo:**

```bash
# Open in browser
open darkmode-demo.html
```

## Integration Steps

### For React/Expo Web:

#### 1. **Wrap your root component:**

```tsx
// app/_layout.tsx or your root layout
import { DarkModeProvider } from "@/lib/darkModeContext";

export default function Layout() {
  return (
    <DarkModeProvider>{/* Your routes and components */}</DarkModeProvider>
  );
}
```

#### 2. **Add toggle to navigation:**

```tsx
// components/AdminShell.tsx
import { ThemeToggle } from "./ThemeToggle";

export function AdminShell({ title, children }: AdminShellProps) {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{title}</Text>
        <ThemeToggle />
      </View>
      {children}
    </View>
  );
}
```

#### 3. **Use glassmorphism cards:**

```tsx
<View className="glass-card">
  <Text>Card Content</Text>
</View>
```

### For Plain HTML/JavaScript:

The `darkmode-demo.html` file is fully functional standalone. Simply:

1. Copy the CSS from `styles/darkmode.css`
2. Add the toggle HTML:

```html
<div
  class="theme-toggle-switch"
  id="themeToggle"
  role="switch"
  aria-checked="false"
  aria-label="Toggle dark mode"
>
  <span class="toggle-label">Light</span>
  <div class="toggle-track">
    <div class="toggle-knob"></div>
    <span class="toggle-icon icon-moon">🌙</span>
    <span class="toggle-icon icon-gear">⚙️</span>
  </div>
</div>
```

3. Add the toggle script:

```javascript
// Initialize theme from localStorage
function initializeTheme() {
  const savedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedMode !== null ? savedMode === "true" : prefersDark;

  if (isDark) {
    document.body.classList.add("dark-mode");
  }
}

// Toggle handler
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode"),
  );
});

initializeTheme();
```

## CSS Classes Reference

### Theme Toggle:

- `.theme-toggle-switch` - Main toggle container
- `.toggle-track` - Background track
- `.toggle-knob` - Circular button
- `.toggle-icon` - Moon and gear icons
- `.toggle-label` - "Light"/"Dark" label

### Content:

- `.glass-card` - Glassmorphism card
- `.btn` - Button base
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button

### State:

- `body.dark-mode` - Applied to `<body>` when dark mode is active

## Transition Timing

All transitions use **0.5 seconds** with `ease-in-out` timing:

```css
transition:
  background 0.5s ease-in-out,
  color 0.5s ease-in-out,
  border-color 0.5s ease-in-out;
```

This creates smooth, professional animations between themes.

## Accessibility Features

✅ **ARIA Labels:**

```html
role="switch" aria-checked="true/false" aria-label="Toggle dark mode"
```

✅ **Keyboard Support:**

- `Enter` key to toggle
- `Space` key to toggle
- `Tab` to focus

✅ **Respects System Preferences:**

```javascript
window.matchMedia("(prefers-color-scheme: dark)").matches;
```

## LocalStorage Integration

User preference is saved as:

```javascript
localStorage.setItem("darkMode", "true" | "false");
```

**Priority:**

1. Saved localStorage value
2. System OS preference
3. Default to light mode

## Color Specifications

### Light Mode:

```
Background Gradient: #f0f4f8 → #d9e8f5
Accent: #f4bf24 (warm orange-gold)
Text: #1a1a1a
Card: rgba(255, 255, 255, 0.7)
```

### Dark Mode:

```
Background Gradient: #0a1a3a → #1a2a4a
Accent: #ffd700 (bright gold)
Text: #f3f6ff (cool white)
Card: rgba(10, 32, 82, 0.5)
Cyan Accent: #12c6ff
```

## Performance Notes

- CSS transitions use `ease-in-out` for natural motion
- Single class toggle on `<body>` for all theme changes
- No JavaScript animation frames needed
- GPU-accelerated with `transform` where applicable
- Minimal repaints due to CSS variable inheritance

## Browser Support

✅ Modern browsers (Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+)
✅ Respects `prefers-color-scheme` media query
✅ Works with and without JavaScript (CSS default fallback)

## Customization

### Change Colors:

Edit `styles/darkmode.css`:

```css
:root {
  --accent-light: #your-color;
  --accent-dark: #your-color;
  --light-bg: linear-gradient(...);
  --dark-bg: linear-gradient(...);
}
```

### Change Transition Speed:

```css
:root {
  --transition-duration: 0.3s; /* Faster */
}
```

### Modify Card Styles:

```css
.glass-card {
  backdrop-filter: blur(20px); /* More blur */
  padding: 30px; /* More padding */
}
```

## Testing

Open `darkmode-demo.html` in a browser to:

1. Click the toggle switch
2. Verify smooth transitions
3. Check localStorage in DevTools (Application tab)
4. Reload page - preference persists
5. Test keyboard navigation (Tab → Enter/Space)

## Notes

- The implementation respects system dark mode preferences
- Preference persists across sessions
- All transitions are hardware-accelerated
- Compatible with your existing Expo/React Native setup
- Ready for production use

---

For questions or customization needs, refer to the individual component files or the demo HTML.
