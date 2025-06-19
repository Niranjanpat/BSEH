import {configureFonts, DefaultTheme} from 'react-native-paper';
import {FONTS} from './fonts';
import spacings from './spacings';
import {COLORS} from './colors';
import typography from './typography';

const fontConfig = {
  default: {
    regular: {
      fontFamily: FONTS.regular,
      fontWeight: 'normal',
    },

    medium: {
      fontFamily: FONTS.bold,
      fontWeight: 'normal',
    },

    light: {
      fontFamily: FONTS.light,
      fontWeight: 'normal',
    },

    thin: {
      fontFamily: FONTS.light,
      fontWeight: 'normal',
    },
  },
};

export default theme = {
  ...DefaultTheme,

  fonts: configureFonts(fontConfig),
  roundness: 10,
  colors: {
    background:'#fbf5e9',
    dark: false,
    ...DefaultTheme.colors,
    ...COLORS,
  },
};

export const SPACINGS = spacings;
export const TYPOGRAPHY = typography;
