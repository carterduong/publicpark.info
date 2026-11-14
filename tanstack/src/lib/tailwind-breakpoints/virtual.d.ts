declare module 'virtual:tailwind-breakpoints' {
  export const tailwindBreakpoints: readonly {
    name: string
    minWidth: string
  }[]
}

declare module 'virtual:tailwind-spacing' {
  export const tailwindSpacing: readonly {
    name: string
    /** Raw theme value, for example `var(--spacing-gutter)`. */
    value: string
  }[]
}
