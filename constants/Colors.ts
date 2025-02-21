/**
 * Color scheme for the app using a minimalist black and white theme.
 * This modern approach creates a clean, sophisticated look that emphasizes content and functionality.
 */

const tintColorLight = '#000000';
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: '#000000',          // Pure black for primary text
    background: '#FFFFFF',     // Pure white for background
    tint: tintColorLight,     // Black for interactive elements
    icon: '#666666',          // Dark gray for secondary elements
    tabIconDefault: '#666666', // Dark gray for inactive tabs
    tabIconSelected: tintColorLight, // Black for active tabs
  },
  dark: {
    text: '#FFFFFF',          // Pure white for primary text
    background: '#000000',    // Pure black for background
    tint: tintColorDark,     // White for interactive elements
    icon: '#999999',         // Light gray for secondary elements
    tabIconDefault: '#999999', // Light gray for inactive tabs
    tabIconSelected: tintColorDark, // White for active tabs
  },
};
