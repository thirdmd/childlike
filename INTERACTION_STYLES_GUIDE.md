# Centralized Interaction Styles Guide

## Overview

All hover effects and interactive element behaviors are **centralized** in a single config file to maintain consistency across the entire website.

**File:** `src/config/interactionStyles.ts`

---

## Why Centralized?

- **Single Source of Truth** - Change hover effect once, applies everywhere
- **No Hardcoding** - All interactive elements use the same classes
- **Consistency** - Same behavior across all buttons, icons, links
- **Maintainability** - Easy to update brand interactions globally
- **Efficiency** - Zero code duplication

---

## Available Classes

### 1. Icon Button Hover
**Use for:** Account icon, Shopping cart icon, Back button, Logo

```typescript
import { iconButtonHoverClass } from "@/config/interactionStyles";

<button className={`w-10 h-10 rounded-full ${iconButtonHoverClass}`}>
  <User className="w-5 h-5" />
</button>
```

**Effect:** Scale up 25% with smooth 300ms transition

---

### 2. Navigation Item
**Use for:** Menu tabs (Home, Products, About, FAQ, Contact)

**Desktop:** Text size `text-2xl`, black font weight
**Mobile:** Text size `text-lg`, black font weight

**States:**
- **Active:** Scale 110% + white bottom border
- **Inactive:** Transparent border + hover scale 125%

---

### 3. Button Hover
**Use for:** Standard buttons

```typescript
import { buttonHoverClass } from "@/config/interactionStyles";

<button className={`px-6 py-2 ${buttonHoverClass}`}>
  Click Me
</button>
```

**Effect:** Scale up 5% + opacity change on hover

---

### 4. Link Hover
**Use for:** Text links

```typescript
import { linkHoverClass } from "@/config/interactionStyles";

<a href="/page" className={`${linkHoverClass}`}>
  Click Here
</a>
```

**Effect:** Scale up 5% on hover

---

### 5. Form Element Hover
**Use for:** Input fields, textareas, form controls

```typescript
import { formElementHoverClass } from "@/config/interactionStyles";

<input className={`${formElementHoverClass}`} />
```

**Effect:** Brightness increase on hover

---

## How to Use

### Step 1: Import the style class
```typescript
import { iconButtonHoverClass } from "@/config/interactionStyles";
```

### Step 2: Apply to your element
```typescript
<button className={`base-classes ${iconButtonHoverClass}`}>
  Button Text
</button>
```

### Step 3: Done!
No hardcoding hover effects. The system handles consistency automatically.

---

## Adding New Interactive Elements

**Rule:** ALL new buttons, icons, links MUST use these centralized classes.

**DO:**
```typescript
// ✅ CORRECT - Using centralized class
<button className={`px-4 py-2 ${iconButtonHoverClass}`}>Click</button>
```

**DON'T:**
```typescript
// ❌ WRONG - Hardcoding hover effect
<button className="px-4 py-2 hover:scale-125 transition-all">Click</button>
```

---

## Current Implementation

### Components Using Centralized Styles

| Component | File | Class Used |
|-----------|------|-----------|
| Header Logo | `src/components/layout/Header.tsx` | `iconButtonHoverClass` |
| Nav Items | `src/components/layout/Header.tsx` | Custom nav logic |
| Account Icon | `src/components/layout/Header.tsx` | `iconButtonHoverClass` |
| Cart Icon | `src/components/layout/Header.tsx` | `iconButtonHoverClass` |
| Back Button (Product) | `src/routes/ProductDetail.tsx` | `iconButtonHoverClass` |
| Continue Shopping | `src/routes/Cart.tsx` | `iconButtonHoverClass` |

---

## Modifying Hover Behavior

To change hover effects globally:

1. Open `src/config/interactionStyles.ts`
2. Modify the desired class (e.g., `iconButtonHoverClass`)
3. All components using that class automatically update

**Example:** Change icon button scale from 125% to 110%:
```typescript
// Before
hover:scale-125

// After
hover:scale-110
```

---

## Future Enhancements

- Add form input focus effects
- Add disabled state styles
- Add mobile-specific hover behaviors
- Add animation transitions library

---

**Last Updated:** November 19, 2025
**Maintained By:** Childlike Product Team
