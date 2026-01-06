import { StyleSheet, TextInput } from "react-native";

import colors from "../constants/colors";

type FormInputProps = {
    placeholder: string;
    value: string | undefined;
    width: number;
    onChangeText: (value: string) => void;
    multiline?: boolean;
    numLines?: number;
    color?: string;
};

const FormInput = ({placeholder, value, width, onChangeText, color, multiline, numLines}: FormInputProps) => {

    return (
        <TextInput 
            style={[
                styles.text, {width: width, borderColor: color ? color : colors.primaryAccent600}
            ]} 
            placeholder={placeholder}
            placeholderTextColor={colors.primaryAccent600}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
            numberOfLines={numLines}
            textAlignVertical="top"
        >
        </TextInput>
    )
};

export default FormInput;

const styles = StyleSheet.create({
    text: {
    color: colors.primaryAccent900,
    borderWidth: 3,
    marginVertical: 5,
    borderRadius: 8,
    padding: 10,
    fontWeight: "700",
  },

});