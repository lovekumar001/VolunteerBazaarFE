import React from 'react';
import {Text , View , Button} from 'react-native';
import {useRouter} from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

const index = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <Text>Index</Text>
            <Button title='welcome' onPress={()=>router.push('/welcome')}/>
        </ScreenWrapper>
    );
};

export default index;