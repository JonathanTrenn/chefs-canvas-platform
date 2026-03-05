# Chef’s Canvas — Prototype Truth (Phase 3)

## Servers
- Platform (Next.js): http://localhost:3000
  - Note: if port 3000 is busy, Next may run on 3001. Always use the port shown in the terminal output.
- Studio (Sanity): http://localhost:3333

## Truth routes (do not test on `/`)
- Dish pages:
  http://localhost:3000/<restaurantSlug>/dish/<dishSlug>

## Important
- `/` (home) is intentionally a neutral placeholder.
- If pages “disappear” or the browser can’t connect:
  1) confirm the dev server is running (and which port),
  2) confirm you are using a truth route,
  3) only then investigate code.