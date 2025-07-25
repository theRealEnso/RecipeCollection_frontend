import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { ReactNode } from "react";

import colors from "../constants/colors";

type CustomButtonProps = {
    value: string | ReactNode;
    width: number;
    onButtonPress?: () => void;
    mutationPending?: boolean;
    color?: string;
    radius?: number;
};

const CustomButton = ({
    value, 
    width, 
    onButtonPress, 
    mutationPending,
    color,
    radius,
}: CustomButtonProps) => {
    return (
        <Pressable 
            style={
                ({pressed}) => pressed  
                    ? [
                        styles.pressable, 
                        styles.pressed, 
                        {
                            width: width, 
                            borderColor: color ? color : colors.primaryAccent500, 
                            backgroundColor: color ? color : colors.primaryAccent500,
                            borderRadius: radius ? radius : 12,
                        }
                    ] 
                    : [
                        styles.pressable, 
                        {
                            width: width,
                            borderColor: color ? color : colors.primaryAccent500, 
                            backgroundColor: color ? color : colors.primaryAccent500,
                            borderRadius: radius ? radius : 12,
                        },

                    ]
            } 
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
        // backgroundColor: colors.primaryAccent500,
        // borderColor: colors.primaryAccent500,
        borderWidth: 2,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
      },
    
    pressed: {
        opacity: 0.75,
    },
});