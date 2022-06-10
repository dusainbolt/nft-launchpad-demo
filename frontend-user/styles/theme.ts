import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';

type DefaultStyle = {
  container: any;
  main: any;
  btnStyle: (color: string, hoverBackground: string) => any;
};

export const defaultStyle: DefaultStyle = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 1280,
    margin: 'auto',
  },
  main: {
    marginTop: 100,
  },
  btnStyle: (color: string, hoverBackground: string = '') => ({
    borderColor: color,
    color: color,
    '&:hover': {
      borderColor: color,
      background: hoverBackground,
    },
  }),
};

// Create a theme instance.
const theme = createTheme({
  palette: {
    common: {
      black: '#19192B',
      white: '#ffffff',
    },
    primary: {
      light: '#B3E5FC',
      main: '#1976d2',
      dark: '#0288D1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#607D8B', // omitting light and dark will calculate from main
      contrastText: '#757575',
    },
    grey: {
      '500': '#bcbcbc',
      '700': '#79797a',
    },
    info: {
      main: '#1bb2f1',
    },
    success: {
      main: '#00d589',
    },
    error: {
      main: '#ff4263',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
});

export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export default theme;
