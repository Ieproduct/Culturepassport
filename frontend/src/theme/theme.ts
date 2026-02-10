import { createTheme, type Shadows } from '@mui/material/styles';
import { colors } from './colors';
import { SPACING_BASE } from './spacing';
import { buildMuiShadows } from './shadows';
import { typographyTokens } from './typography';
import { ChevronDownIcon } from '@/components/common/ChevronDownIcon';

const theme = createTheme({
  // Spacing: 8px grid (Constitution Principle II)
  spacing: SPACING_BASE,

  // Palette: IE Design System colors
  palette: {
    primary: {
      main: colors.red[600],       // #DC2626 — IE brand red
      light: colors.red[400],
      dark: colors.red[800],
      contrastText: colors.base.white,
    },
    secondary: {
      main: colors.blue[600],      // #2563EB
      light: colors.blue[400],
      dark: colors.blue[800],
      contrastText: colors.base.white,
    },
    error: {
      main: colors.red[500],
      light: colors.red[300],
      dark: colors.red[700],
      contrastText: colors.base.white,
    },
    warning: {
      main: colors.amber[500],
      light: colors.amber[300],
      dark: colors.amber[700],
      contrastText: colors.base.black,
    },
    info: {
      main: colors.sky[500],
      light: colors.sky[300],
      dark: colors.sky[700],
      contrastText: colors.base.white,
    },
    success: {
      main: colors.green[500],
      light: colors.green[300],
      dark: colors.green[700],
      contrastText: colors.base.white,
    },
    grey: {
      50: colors.gray[50],
      100: colors.gray[100],
      200: colors.gray[200],
      300: colors.gray[300],
      400: colors.gray[400],
      500: colors.gray[500],
      600: colors.gray[600],
      700: colors.gray[700],
      800: colors.gray[800],
      900: colors.gray[900],
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[500],
      disabled: colors.gray[400],
    },
    background: {
      default: colors.base.bg,       // #F6F6F7
      paper: colors.base.white,
    },
    divider: colors.gray[200],
  },

  // Typography: Inter font with IE text styles
  typography: {
    fontFamily: typographyTokens.fontFamily,
    h1: typographyTokens.h1,
    h2: typographyTokens.h2,
    h3: typographyTokens.h3,
    h4: typographyTokens.h4,
    h5: typographyTokens.h3,   // alias to H3 (IE has 4 header levels)
    h6: typographyTokens.h4,   // alias to H4
    subtitle1: typographyTokens.subtitle1,
    subtitle2: typographyTokens.subtitle2,
    body1: typographyTokens.body1,
    body2: typographyTokens.body2,
    caption: typographyTokens.caption,
    overline: typographyTokens.overline,
    button: typographyTokens.button,
  },

  // Shadows: IE Design System shadow tokens
  shadows: buildMuiShadows() as unknown as Shadows,

  // Shape
  shape: {
    borderRadius: SPACING_BASE, // 8px
  },

  // Breakpoints (Constitution Principle IV)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  // Component overrides
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.base.bg,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: t.spacing(1),      // 8px
          padding: t.spacing(1, 3),        // 8px 24px
          minHeight: 44,                   // Touch target (Principle IV)
          fontWeight: 600,
        }),
        sizeSmall: ({ theme: t }) => ({
          padding: t.spacing(0.75, 2),     // 6px 16px
          minHeight: 36,
        }),
        sizeLarge: ({ theme: t }) => ({
          padding: t.spacing(1.5, 4),      // 12px 32px
          minHeight: 48,
        }),
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minWidth: 44,
          minHeight: 44,                   // Touch target (Principle IV)
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: t.spacing(2),      // 16px
          boxShadow: 'none',
          border: `1px solid ${colors.gray[200]}`,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          padding: t.spacing(3),           // 24px
          '&:last-child': {
            paddingBottom: t.spacing(3),
          },
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: ({ theme: t }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: t.spacing(1),    // 8px
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: t.spacing(0.75),   // 6px
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme: t }) => ({
          borderRadius: t.spacing(2),      // 16px
          padding: t.spacing(1),
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          padding: t.spacing(1.5, 2),      // 12px 16px
          borderColor: colors.gray[200],
        }),
        head: {
          fontWeight: 600,
          color: colors.gray[700],
          backgroundColor: colors.gray[50],
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.base.white,
          color: colors.gray[900],
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.gray[200]}`,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ChevronDownIcon,
      },
      styleOverrides: {
        icon: {
          fontSize: 20,
          right: 12,
          color: '#6B7280',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
});

export default theme;
