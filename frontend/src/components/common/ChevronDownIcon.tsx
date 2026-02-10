import { SvgIcon, type SvgIconProps } from '@mui/material'

/**
 * Custom ChevronDown icon matching Figma 9629:1352 (Solid variant).
 * Used as the dropdown indicator across all Select components in the system.
 */
export function ChevronDownIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 25.89 14.94">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.33333 0.390525C1.85403 -0.130174 2.69825 -0.130175 3.21895 0.390524L12.9428 10.1144L22.6667 0.390525C23.1874 -0.130174 24.0316 -0.130174 24.5523 0.390524L25.4951 1.33333C26.0158 1.85403 26.0158 2.69825 25.4951 3.21895L14.357 14.357C13.576 15.1381 12.3096 15.1381 11.5286 14.357L0.390524 3.21895C-0.130175 2.69825 -0.130175 1.85403 0.390524 1.33333L1.33333 0.390525Z"
        fill="currentColor"
      />
    </SvgIcon>
  )
}
