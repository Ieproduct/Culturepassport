import { SvgIcon, type SvgIconProps } from '@mui/material'

/**
 * Chevron Left icon from DesignStem IE (Figma 9629:1657)
 * Variants: "solid" (filled) | "stroke" (outlined)
 */
export function IconChevronLeft({
  variant = 'stroke',
  ...props
}: SvgIconProps & { variant?: 'solid' | 'stroke' }) {
  if (variant === 'stroke') {
    return (
      <SvgIcon viewBox="0 0 16.4428 27.3856" {...props}>
        <g transform="translate(16.4428, 27.3856) rotate(180)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.14052 25.3023C0.619826 24.7816 0.619825 23.9374 1.14052 23.4167L10.8644 13.6928L1.14052 3.96895C0.619826 3.44825 0.619826 2.60403 1.14052 2.08333L2.08333 1.14053C2.60403 0.619826 3.44825 0.619824 3.96895 1.14052L15.107 12.2786C15.8881 13.0596 15.8881 14.326 15.107 15.107L3.96895 26.2451C3.44825 26.7658 2.60403 26.7658 2.08333 26.2451L1.14052 25.3023Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </g>
      </SvgIcon>
    )
  }

  return (
    <SvgIcon viewBox="0 0 14.9428 25.8856" {...props}>
      <g transform="translate(14.9428, 25.8856) rotate(180)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.390525 24.5523C-0.130174 24.0316 -0.130175 23.1874 0.390524 22.6667L10.1144 12.9428L0.390525 3.21895C-0.130174 2.69825 -0.130174 1.85403 0.390524 1.33333L1.33333 0.390525C1.85403 -0.130174 2.69825 -0.130176 3.21895 0.390524L14.357 11.5286C15.1381 12.3096 15.1381 13.576 14.357 14.357L3.21895 25.4951C2.69825 26.0158 1.85403 26.0158 1.33333 25.4951L0.390525 24.5523Z"
          fill="currentColor"
        />
      </g>
    </SvgIcon>
  )
}
