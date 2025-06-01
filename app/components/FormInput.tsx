import { StyleSheet, TextInput, View } from "react-native";

type FormInputProps = {
    placeholder: string;
    value: string;
    onChange?: React.Dispatch<React.SetStateAction<{email: string; password: string}>>;
};

const FormInput = ({placeholder, value, onChange}: FormInputProps) => {

    // handle input change
    const handleInputChange = (userInput: string): void => {

    };

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input} 
                placeholder={placeholder}
                onChangeText={handleInputChange}
            >
                {value}
            </TextInput>
        </View>
    )
};

export default FormInput;

const styles = StyleSheet.create({
    container: {
        marginVertical: 5,
    },
    
    input: {
        borderWidth: 2,
        width: 250,
    }
});