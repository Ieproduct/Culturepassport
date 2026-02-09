// IE Design System — Shadow Tokens
// Source: Figma node 3834:510696

export const shadowTokens = {
  down: {
    20: '0px 2px 2px 0px rgba(0, 0, 0, 0.2)',
    40: '0px 2px 2px 0px rgba(0, 0, 0, 0.4)',
    60: '0px 2px 2px 0px rgba(0, 0, 0, 0.6)',
    80: '0px 2px 2px 0px rgba(0, 0, 0, 0.8)',
    100: '0px 2px 2px 0px rgba(0, 0, 0, 1)',
  },
  right: {
    20: '2px 0px 2px 0px rgba(0, 0, 0, 0.2)',
    40: '2px 0px 2px 0px rgba(0, 0, 0, 0.4)',
    60: '2px 0px 2px 0px rgba(0, 0, 0, 0.6)',
    80: '2px 0px 2px 0px rgba(0, 0, 0, 0.8)',
    100: '2px 0px 2px 0px rgba(0, 0, 0, 1)',
  },
  top: {
    20: '0px -2px 2px 0px rgba(0, 0, 0, 0.2)',
    40: '0px -2px 2px 0px rgba(0, 0, 0, 0.4)',
    60: '0px -2px 2px 0px rgba(0, 0, 0, 0.6)',
    80: '0px -2px 2px 0px rgba(0, 0, 0, 0.8)',
    100: '0px -2px 2px 0px rgba(0, 0, 0, 1)',
  },
  left: {
    20: '-2px 0px 2px 0px rgba(0, 0, 0, 0.2)',
    40: '-2px 0px 2px 0px rgba(0, 0, 0, 0.4)',
    60: '-2px 0px 2px 0px rgba(0, 0, 0, 0.6)',
    80: '-2px 0px 2px 0px rgba(0, 0, 0, 0.8)',
    100: '-2px 0px 2px 0px rgba(0, 0, 0, 1)',
  },
  spread: {
    20: '0px 0px 8px 0px rgba(0, 0, 0, 0.2)',
    40: '0px 0px 8px 0px rgba(0, 0, 0, 0.4)',
    60: '0px 0px 8px 0px rgba(0, 0, 0, 0.6)',
    80: '0px 0px 4px 0px rgba(0, 0, 0, 0.8)',
    100: '0px 0px 8px 0px rgba(0, 0, 0, 1)',
  },
} as const;

// Map to MUI's 25-level shadow array (index 0 = none)
// We map IE shadows to MUI elevation levels:
// 0: none, 1: down-20, 2: down-40, 3: down-60, 4: down-80,
// 5: spread-20, 6: spread-40, 7: spread-60, 8: spread-80,
// rest: progressive shadows for higher elevations
export function buildMuiShadows() {
  return [
    'none',
    shadowTokens.down[20],
    shadowTokens.down[40],
    shadowTokens.down[60],
    shadowTokens.down[80],
    shadowTokens.spread[20],
    shadowTokens.spread[40],
    shadowTokens.spread[60],
    shadowTokens.spread[80],
    shadowTokens.down[100],
    shadowTokens.spread[100],
    // 11-24: repeat last meaningful shadow for MUI compatibility
    ...Array(14).fill(shadowTokens.spread[100]),
  ] as const;
}
