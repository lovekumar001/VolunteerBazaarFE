import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string; 
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, bg }) => {
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 10 ? top + 5 : 30;

    return (
        <View style={{ flex: 1, paddingTop, backgroundColor: bg }}>
            {children}
        </View>
    );
};

export default ScreenWrapper;
