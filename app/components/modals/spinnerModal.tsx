import { Modal, StyleSheet, View } from "react-native";

import * as Progress from 'react-native-progress';

import colors from "@/app/constants/colors";

type Percent = {
    percentCompleted: number,
};

const UploadSpinnerModal = ({percentCompleted}: Percent) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
        >
            <View style={styles.overlay}>
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
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    spinnerContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 100,
    }
})