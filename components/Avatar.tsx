import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helper/common'

const Avatar = ({
    uri,
    size = hp(4.5),
    rounded = theme.radius.md,
    style = {}
}) => {
    return (
        <Image source={{ uri }}
            transition={100}
            style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
        />
    )
}

export default Avatar

const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        borderColor: theme.colors.darkLight,
        borderWidth: 1
    }
})