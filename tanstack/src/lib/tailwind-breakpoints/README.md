# Tailwind breakpoints

Reads the breakpoints from the Tailwind theme so the dev toolbar can show which one is active. Nothing is hardcoded: change a `--breakpoint-*` value in `@theme` and the readout follows.

- `vite-plugin.ts` compiles `src/styles.css` with Tailwind at build time and serves the breakpoints as `virtual:tailwind-breakpoints`. This has to happen in Vite because Tailwind's compiler runs in Node, and the browser never receives the breakpoint values as CSS variables. It also serves the named `--spacing-*` tokens as `virtual:tailwind-spacing` for the dev tray rulers.
- `index.ts` picks the active breakpoint with `matchMedia` and exposes `useTailwindViewport()`.
- `virtual.d.ts` types the virtual module.

The plugin relies on `__unstable__loadDesignSystem`, an internal Tailwind API that a Tailwind upgrade could break.
