import { StyleSheet, Text, View, ScrollView, Pressable, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helper/common'
import Header from '@/components/Header'
import { useRouter } from 'expo-router'
import Icon from '@/assets/icons'
import Button from '@/components/Button'
import Input from '@/components/input'
import Avatar from '@/components/Avatar'

const editProfile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: null,
        bio: '',
        address: '',
        rating: 4.5,
        hoursCompleted: 120,
        points: 850
    })

    const onPickImage = async() => {
        // Image picker logic here
    }

    const onSubmit = async () => {
        let userData = {...user};
        let {name, phoneNumber, address, image, bio} = userData;
        if(!name || !phoneNumber || !address || !bio){
            Alert.alert('Profile', "Please fill all the fields");
            return;
        }
        setLoading(true);
        // Submit logic here
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <ScrollView style={{flex:1}}>
                <Header title="Edit Profile" mb={30} />

                    <View style={styles.form}>
                        <View style={styles.avatarContainer}>
                            <Avatar size={hp(14)} rounded={theme.radius.xxl * 1.8} />
                            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                                <Icon name='camera' size={20} strokeWidth={2.5} />
                            </Pressable>
                        </View>


                        <Text style={styles.subtitle}>
                            Please Fill your Profile Details
                        </Text>

                        <Input 
                            icon={<Icon name="user" />}
                            placeholder="Enter your name"
                            value={user.name}
                            onChangeText={(value) => setUser({...user, name: value})}
                        />    
                        <Input 
                            icon={<Icon name="call" />}
                            placeholder="Enter your phone number"
                            value={user.phoneNumber}
                            onChangeText={(value) => setUser({...user, phoneNumber: value})}
                        />  
                        <Input 
                            icon={<Icon name="location" />}
                            placeholder="Enter your location"
                            value={user.address}
                            multiline={true}
                            containerStyle={styles.bio}
                            onChangeText={(value) => setUser({...user, address: value})}
                        />  
                        <Input 
                            placeholder="Enter your bio"
                            value={user.bio}
                            onChangeText={(value) => setUser({...user, bio: value})}
                        />  

                        <Button 
                            title='Update'
                            loading={loading}
                            onPress={onSubmit}
                            buttonStyle={styles.updateButton}
                            textStyle={styles.buttonText}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default editProfile

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(2)
    },
    headerTitle: {
        fontSize: hp(2.2),
        fontWeight: '600',
        color: theme.colors.text
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: hp(2),
        paddingVertical: hp(2),
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.lg
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: hp(2.5),
        fontWeight: '700',
        color: theme.colors.primary
    },
    statLabel: {
        fontSize: hp(1.6),
        color: theme.colors.textLight
    },
    subtitle: {
        fontSize: hp(1.5),
        color: theme.colors.text,
        marginBottom: hp(1)
    },
    input:{
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        padding: 17,
        paddingHorizontal: 20,
        gap: 15
    },
    bio:{
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 15
    },
    form:{
        gap: 10,
        marginTop: 20
    },
    cameraIcon:{
        position:'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    avatarContainer:{
        height: hp(14),
        width: hp(14),
        alignSelf: 'center'
    },
    container:{
        flex: 1,
        paddingHorizontal: wp(4),
    },
    updateButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        paddingVertical: hp(1.5),
        marginTop: hp(2)
    },
    buttonText: {
        color: 'white',
        fontSize: hp(1.8),
        fontWeight: '600'
    }
})