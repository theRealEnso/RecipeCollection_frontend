import { StyleSheet, TextInput } from "react-native";

import colors from "../constants/colors";

type FormInputProps = {
    placeholder: string;
    value: string | undefined;
    width: number;
    onChangeText: (value: string) => void;
    multiline?: boolean;
};

const FormInput = ({placeholder, value, width, onChangeText, multiline}: FormInputProps) => {

    return (
        <TextInput 
            style={[styles.text, {width: width}]} 
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            multiline={multiline}
        >
        </TextInput>
    )
};

export default FormInput;

const styles = StyleSheet.create({
    text: {
    color: colors.textPrimary600,
    borderWidth: 2,
    marginVertical: 5,
    borderRadius: 8,
    borderColor: colors.textPrimary600,
    padding: 10,
  },

});