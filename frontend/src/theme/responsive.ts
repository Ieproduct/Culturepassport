// Responsive display helpers for MUI sx prop
// Use these instead of inline { xs: 'none', md: 'flex' } objects

/** Show as flex on desktop (md+), hidden on mobile */
export const DESKTOP_FLEX = { xs: 'none', md: 'flex' } as const

/** Show as block on desktop (md+), hidden on mobile */
export const DESKTOP_BLOCK = { xs: 'none', md: 'block' } as const

/** Show as flex on mobile, hidden on desktop (md+) */
export const MOBILE_FLEX = { xs: 'flex', md: 'none' } as const

/** Show as block on mobile, hidden on desktop (md+) */
export const MOBILE_BLOCK = { xs: 'block', md: 'none' } as const
