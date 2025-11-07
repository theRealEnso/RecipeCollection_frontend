import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { ReactNode } from "react";

import colors from "../constants/colors";

type CustomButtonProps = {
    value: string | ReactNode;
    width: number;
    onButtonPress?: () => void;
    mutationPending?: boolean;
    color?: string;
    radius?: number;
    textSize?: number;
    textPadding?: number;
};

const CustomButton = ({
    value, 
    width, 
    onButtonPress, 
    mutationPending,
    color,
    radius,
    textSize,
    textPadding,
}: CustomButtonProps) => {
    return (
        <View style={[styles.buttonOuterContainer, {width: width, borderRadius: radius}]}>
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
                : <Text style={[{color: "#fff"}, {fontSize: textSize ? textSize : 14, padding: textPadding ? textPadding : 2, fontWeight: "600"}]}>{value}</Text>
            }
            </Pressable>
        </View>
    )
};

export default CustomButton;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        overflow: "hidden",
    },

    pressable: {
        borderWidth: 2,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
      },
    
    pressed: {
        opacity: 0.75,
    },
});