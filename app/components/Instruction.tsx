import { StyleSheet, Text, View } from "react-native";

//import component(s)
import CustomButton from "./CustomButton";

//import type(s)
import { CookingInstructions } from "@/types/Recipe";

// import expo icons
import FontAwesome from '@expo/vector-icons/FontAwesome';

//import colors
import colors from "../constants/colors";


type InstructionProps = {
    instructionData: CookingInstructions;
    onDelete: (instructionId: string) => void;
};

const Instruction = ({instructionData, onDelete}: InstructionProps) => {

    const { instruction, instruction_id } = instructionData;
    return (
        <View style={styles.container}>
            <View style={styles.instructionItem}>
                <Text style={{fontSize: 16, padding: 10, color: "white"}}>{instruction}</Text>
            </View>
            

            <CustomButton
                value={<FontAwesome name="trash" size={24} color={colors.primaryAccent700} />}
                onButtonPress={() => onDelete(instruction_id)}
                width={35}
                radius={25}
                color={colors.secondaryAccent500}
            >
            </CustomButton>
            
        </View>
    );
};

export default Instruction;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "100%",
    },

    instructionItem: {
        backgroundColor: colors.primaryAccent000,
        alignItems: "center",
        justifyContent: "center",
        width: "75%",
        height: "auto",
        borderRadius: 10,
        marginVertical: 10,
    },
});