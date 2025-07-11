import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { ReactNode } from "react";

import colors from "../constants/colors";

type CustomButtonProps = {
    value: string | ReactNode;
    width: number;
    onButtonPress?: () => void;
    mutationPending?: boolean;
};

const CustomButton = ({value, width, onButtonPress, mutationPending}: CustomButtonProps) => {
    return (
        <Pressable 
            style={({pressed}) => pressed ? [styles.pressable, styles.pressed, {width: width}] : [styles.pressable, {width: width}]} 
            android_ripple={{color: colors.primaryAccent600}}
            onPress={onButtonPress}
        >
        {
            mutationPending
            ? <ActivityIndicator color="#fff"></ActivityIndicator>
            : <Text style={{color: "#fff"}}>{value}</Text>
        }
        </Pressable>
    )
};

export default CustomButton;

const styles = StyleSheet.create({
    pressable: {
        backgroundColor: colors.primaryAccent500,
        borderColor: colors.primaryAccent500,
        borderWidth: 2,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
      },
    
    pressed: {
        opacity: 0.75,
    },
});