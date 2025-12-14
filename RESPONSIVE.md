# Childlike Responsive System

**Centralized responsive design architecture for consistent mobile/tablet/desktop experiences.**

---

## 📁 File Structure

```
src/
├── config/
│   ├── responsive.ts          ⭐ Breakpoints, screen detection utilities
│   └── design-tokens.ts       ⭐ Spacing, typography, layout tokens
└── hooks/
    └── useBreakpoint.ts       ⭐ React hook for responsive behavior
```

---

## 🎯 Quick Start

### 1. Use Tailwind Responsive Classes (Recommended)

The **easiest** way for most cases:

```tsx
// Mobile-first approach
<div className="text-2xl md:text-4xl lg:text-6xl p-4 md:p-6 lg:p-8">
  Hello Childlike
</div>
```

**Breakpoints:**
- Default (no prefix) = Mobile (< 768px)
- `md:` = Tablet (≥ 768px)
- `lg:` = Desktop (≥ 1024px)

### 2. Use React Hook for Dynamic Behavior

When you need **different components or logic** per screen size:

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

function Navigation() {
  const { isMobile, isDesktop } = useBreakpoint();

  if (isMobile) {
    return <MobileNav />;  // Hamburger menu
  }

  return <DesktopNav />;   // Full navigation
}
```

### 3. Use Design Tokens for Consistent Spacing

When you need **centralized design values**:

```tsx
import { SPACING, TYPOGRAPHY } from '@/config/design-tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';

function Hero() {
  const { screenCategory } = useBreakpoint();
  const spacing = SPACING[screenCategory];
  const typography = TYPOGRAPHY[screenCategory];

  return (
    <section className={`${spacing.section.py} ${spacing.section.px}`}>
      <h1 className={typography.h1}>
        Innovation meets nutrition
      </h1>
    </section>
  );
}
```

---

## 📐 Breakpoints Reference

| Breakpoint | Width | Device | Tailwind Prefix |
|------------|-------|--------|-----------------|
| Mobile | < 768px | Phones | (default) |
| Tablet | 768px - 1023px | Tablets | `md:` |
| Desktop | ≥ 1024px | Laptops/Desktops | `lg:` |

**Edit breakpoints:** `src/config/responsive.ts`

---

## 🔧 Common Patterns

### Pattern 1: Responsive Grid

```tsx
// 1 column on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</div>
```

### Pattern 2: Hide/Show Elements

```tsx
// Show only on mobile
<div className="block md:hidden">
  Mobile-only content
</div>

// Show only on desktop
<div className="hidden lg:block">
  Desktop-only content
</div>
```

### Pattern 3: Different Layouts

```tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

function ProductDetail() {
  const { isMobile } = useBreakpoint();

  return (
    <div className={isMobile ? 'flex-col' : 'flex-row'}>
      <ProductImage />
      <ProductInfo />
    </div>
  );
}
```

### Pattern 4: Responsive Padding/Spacing

```tsx
// Use centralized spacing tokens
import { SPACING } from '@/config/design-tokens';

function Section() {
  return (
    <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8">
      Content
    </section>
  );
}
```

### Pattern 5: Responsive Typography

```tsx
// Use centralized typography tokens
import { TYPOGRAPHY } from '@/config/design-tokens';

function Heading() {
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
      Childlike Products
    </h1>
  );
}
```

---

## 🐛 Debugging Mobile Issues

### Step 1: Identify the Problem Area

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device: iPhone SE, iPad, Desktop

### Step 2: Find Which Component Needs Fixing

Look for:
- Overflowing content
- Wrong spacing/padding
- Text too large/small
- Layout breaking

### Step 3: Edit the Right File

**For spacing/padding issues:**
- Edit `src/config/design-tokens.ts` → `SPACING.mobile`

**For typography issues:**
- Edit `src/config/design-tokens.ts` → `TYPOGRAPHY.mobile`

**For layout issues:**
- Edit component directly with Tailwind responsive classes
- Or use `useBreakpoint()` hook for conditional rendering

**For breakpoint changes:**
- Edit `src/config/responsive.ts` → `BREAKPOINTS`

### Step 4: Test Across All Sizes

Always test on:
- Mobile (375px - iPhone SE)
- Tablet (768px - iPad)
- Desktop (1440px - Laptop)

---

## 📝 Examples: Before & After

### ❌ BEFORE (Inconsistent, hard to debug)

```tsx
// Random spacing values scattered everywhere
<div className="px-6 py-14">           {/* Desktop value hardcoded */}
  <h1 className="text-7xl">            {/* Too big for mobile */}
    Products
  </h1>
</div>
```

### ✅ AFTER (Centralized, easy to debug)

```tsx
// Centralized values, mobile-first
<div className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
    Products
  </h1>
</div>
```

---

## 🎨 Design Tokens Overview

### Spacing Scale

```typescript
SPACING = {
  mobile: {
    section: { py: 'py-12', px: 'px-4', gap: 'gap-8' },
    container: { maxW: 'max-w-full', px: 'px-4' },
    card: { p: 'p-4', gap: 'gap-4' },
  },
  tablet: {
    section: { py: 'py-16', px: 'px-6', gap: 'gap-12' },
    container: { maxW: 'max-w-4xl', px: 'px-6' },
    card: { p: 'p-6', gap: 'gap-6' },
  },
  desktop: {
    section: { py: 'py-24', px: 'px-8', gap: 'gap-16' },
    container: { maxW: 'max-w-7xl', px: 'px-8' },
    card: { p: 'p-8', gap: 'gap-8' },
  },
}
```

### Typography Scale

```typescript
TYPOGRAPHY = {
  mobile: {
    h1: 'text-4xl font-bold',      // 36px
    h2: 'text-3xl font-bold',      // 30px
    body: 'text-base',             // 16px
  },
  tablet: {
    h1: 'text-5xl font-bold',      // 48px
    h2: 'text-4xl font-bold',      // 36px
    body: 'text-lg',               // 18px
  },
  desktop: {
    h1: 'text-6xl font-bold',      // 60px
    h2: 'text-5xl font-bold',      // 48px
    body: 'text-lg',               // 18px
  },
}
```

---

## 🚀 Best Practices

### ✅ DO

- Use **mobile-first** approach (style mobile first, then add `md:` and `lg:`)
- Use **centralized tokens** from `design-tokens.ts`
- Use **consistent spacing** (4, 6, 8, 12, 16, 24)
- Test on **all three breakpoints** before committing

### ❌ DON'T

- Don't use random pixel values (`w-[347px]`)
- Don't hardcode mobile/desktop in one place
- Don't create custom breakpoints unless necessary
- Don't forget to test on mobile before pushing

---

## 🔗 Related Files

- `CLAUDE.md` - Main project rules
- `tailwind.config.ts` - Tailwind configuration
- `src/config/responsive.ts` - Breakpoints
- `src/config/design-tokens.ts` - Design values
- `src/hooks/useBreakpoint.ts` - Responsive hook

---

**Last Updated:** December 14, 2024
**Questions?** Check this doc first, then ask!
