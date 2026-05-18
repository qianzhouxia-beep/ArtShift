# Particle Animation Fix - Final Summary

## Task
Fix ParticleBackground.tsx animation visibility and appearance issues on ArtShift homepage.

## Problem History (2026-05-18 03:52 - 14:32 GMT+8)

### Issue 1: Particles not visible at all
**Root cause:** Vite build cache had stale output; ParticleBackground code not in bundled JS.
**Fix:** `rm -rf dist node_modules/.vite && npm run build`

### Issue 2: Particles invisible on white background
**Root cause:** White fade overlay `rgba(255,255,255,0.15)` was "washing out" particles.
**Fix:** Changed to much lighter fade `0.02`, then ultimately to `clearRect()` (no trail).

### Issue 3: Particles hidden behind hero section background
**Root cause:** `zIndex: 0` placed canvas below page content.
**Fix:** `zIndex: 1` (with `pointerEvents: none`).

### Issue 4: Trail looks messy on white sections
**Root cause:** Semi-transparent fade accumulates, creating visual noise on white bg.
**Fix:** Use `clearRect(0,0,w,h)` each frame instead of fade overlay.

### Issue 5: Colors too light/dark
**Evolution:**
- v1: `opacity 0.6-1.0` → too light
- v2: `opacity 0.8-1.0` → still too light  
- v3: `opacity 1.0` → too dark on white sections
- **v4 (final):** `opacity 0.12-0.24` → subtle, works on all backgrounds

### Issue 6: Particle style wrong
**User feedback:** "我要昨天那种小方块的" — had circles instead of rounded rectangles.
**Fix:** Restored `quadraticCurveTo()` rounded rect drawing code from original `pixel-particles-demo.html`.

## Final Configuration (commit `f4efd7f`)

```typescript
Particle count: 35
Size: 6-20px
Opacity: 0.12-0.24
Speed: 0.3 (slow)
Repel radius: 120px
Repel force: 2
Trail: None (clearRect each frame)
zIndex: 1 (above content)
Colors: #6D28D9 → #2563EB (gradient)
Shape: Rounded rectangle (3px radius)
```

## Result
✅ User confirmed: "嗯，现在好了" (14:32 GMT+8)

## Key Learnings

1. **Full-screen canvas on multi-section pages:**
   - Use `pointerEvents: none` + `zIndex: 1`
   - No trail effects on white backgrounds (visual noise)
   - Low opacity (0.1-0.25) works on ALL bg colors

2. **Build caching issues:**
   - Vite persistent cache can serve stale builds
   - `rm -rf dist node_modules/.vite` = nuke + rebuild

3. **User feedback loop:**
   - "颜色太浅" → deepen → "还小再加深" → deepen → "好了"
   - Multiple iterations needed; don't assume one adjustment is enough

## Files Modified
- `src/ParticleBackground.tsx` (5+ revisions)
- `memory/2026-05-18.md` (appended after each iteration)

## Next Steps (Suggested)
- Backend API integration (AI image generation)
- Printful POD integration
- User authentication system
- Stripe payment integration
- Make "Upload Your Photo" functional
