import { Modal, StyleSheet, Text, View } from "react-native";

import * as Progress from 'react-native-progress';

import colors from "@/app/constants/colors";

type Percent = {
    percentCompleted: number,
    value?: string;
};

const UploadSpinnerModal = ({percentCompleted, value}: Percent) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
                {
                    value && (
                        <View style={{marginVertical: 30}}>
                            <Text style={styles.text}>{value}</Text>
                        </View>
                        
                    )
                }
                <View style={styles.spinnerContainer}>
                    <Progress.Circle 
                        size={150} 
                        progress={percentCompleted / 100}
                        color={colors.primaryAccent500}
                        formatText={() => `${percentCompleted}%`}
                        showsText={true}
                        thickness={3}
                    />
                </View>
            </View>
        </Modal>
    )
};

export default UploadSpinnerModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.95)",
    },

    spinnerContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.95)",
        borderRadius: 100,
    },

    text: {
        color: colors.secondaryAccent900,
    }
})