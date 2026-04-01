import { Platform } from 'react-native';

export const Typography = {
  // Font Families
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Font Sizes
  heroHeading: 30,
  sectionHeading: 21,
  cardTitle: 17,
  body: 15,
  caption: 13,
  
  // Font Weights
  weightRegular: '400' as const,
  weightBold: '700' as const,
  weightExtraBold: '800' as const,
};
