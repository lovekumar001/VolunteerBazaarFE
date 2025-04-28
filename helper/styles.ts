import { ViewStyle, TextStyle, ImageStyle, StyleSheet } from 'react-native';

/**
 * Helper type for React Native styles to fix TypeScript linting errors
 */
export type StyleType<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Helper function to create styles with proper TypeScript typing
 * This is a wrapper around StyleSheet.create that adds proper typing
 */
export const createStyles = <T extends StyleType<T>>(styles: T) => {
  return StyleSheet.create(styles);
};

/**
 * A type-safe way to merge styles for Text components
 */
export const mergeTextStyles = (base: TextStyle | TextStyle[], additional: TextStyle | TextStyle[]) => {
  if (Array.isArray(base)) {
    if (Array.isArray(additional)) {
      return [...base, ...additional] as TextStyle[];
    }
    return [...base, additional] as TextStyle[];
  }
  
  if (Array.isArray(additional)) {
    return [base, ...additional] as TextStyle[];
  }
  
  return [base, additional] as TextStyle[];
};

/**
 * A type-safe way to merge styles for View components
 */
export const mergeViewStyles = (base: ViewStyle | ViewStyle[], additional: ViewStyle | ViewStyle[]) => {
  if (Array.isArray(base)) {
    if (Array.isArray(additional)) {
      return [...base, ...additional] as ViewStyle[];
    }
    return [...base, additional] as ViewStyle[];
  }
  
  if (Array.isArray(additional)) {
    return [base, ...additional] as ViewStyle[];
  }
  
  return [base, additional] as ViewStyle[];
};

/**
 * Creates a conditional style object based on a condition
 * If the condition is true, returns a merged style of base and trueStyle
 * If the condition is false, returns the base style
 */
export const conditionalStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  baseStyle: T | T[],
  trueStyle: T | T[]
) => {
  if (condition) {
    if (Array.isArray(baseStyle)) {
      if (Array.isArray(trueStyle)) {
        return [...baseStyle, ...trueStyle];
      }
      return [...baseStyle, trueStyle];
    }
    
    if (Array.isArray(trueStyle)) {
      return [baseStyle, ...trueStyle];
    }
    
    return [baseStyle, trueStyle];
  }
  
  return baseStyle;
}; 