import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

// import icon(s)
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

//import component(s)
import CustomButton from "./CustomButton";

// import colors
import colors from "../constants/colors";


// define types
type SubIngredientProps = {
    subItemName: string;
    subItemId: string;
    onEdit: (ingredientId: string, updatedIngredient: string) => void;
    onDelete: (ingredientId: string) => void;
    itemId: string;
    setItemId: React.Dispatch<React.SetStateAction<string>>;
};

const ListItem = ({subItemName, subItemId, onEdit, onDelete, itemId, setItemId}: SubIngredientProps) => {
    const [ingredient, setIngredient] = useState<string>("");
    
    const pressSubItem = () => {
        setItemId(subItemId);
        setIngredient(subItemName);
    };

    const updateIngredient = (itemId: string) => {
        onEdit(itemId, ingredient);
        setItemId("");
    };

    return (
        <View style={styles.container}>
            {
                itemId === subItemId 
                ? (
                    <View style={styles.textInputContainer}>
                        <TextInput 
                            style={styles.textInput} 
                            value={ingredient}
                            onChangeText={(typedValue) => setIngredient(typedValue)}
                        >
                        </TextInput>

                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <View>
                                <CustomButton
                                    value={<Feather name="check" size={22} color={colors.primaryAccent900} />}
                                    width={40}
                                    radius={15}
                                    onButtonPress={() => updateIngredient(itemId)}
                                >
                                </CustomButton>
                            </View>
                            <View>
                                <CustomButton
                                    value={<Fontisto name="close-a" size={16} color={colors.secondaryAccent900} />}
                                    width={40}
                                    radius={15}
                                    onButtonPress={() => setItemId("")}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.ingredientContainer}>
                            <Text style={styles.ingredientItem}>{subItemName}</Text>
                        </View>

                        {/* icons */}
                        <View style={{marginHorizontal: 5, flexDirection: "row", alignItems: "center"}}>
                            <View>
                                <CustomButton
                                    value={<Entypo name="edit" size={22} color="black" />}
                                    width={40}
                                    radius={15}
                                    onButtonPress={() => pressSubItem()}
                                >
                                </CustomButton>
                            </View>

                            <View>
                                <CustomButton
                                    value={<MaterialCommunityIcons name="delete" size={26} color={colors.secondaryAccent900} />}
                                    width={40}
                                    radius={15}
                                    onButtonPress={() => onDelete(subItemId)}
                                >
                                </CustomButton>
                            </View>
                        </View>
                    </View>
                )
            }
        </View>
       
    );
};

export default ListItem;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderWidth: 2,
        // borderColor: "red",

    },

    ingredientContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    ingredientItem: {
        color: colors.primaryAccent900, 
        fontWeight: "400", 
        fontSize: 16,
    },

    textInputContainer: {
        marginTop: 10,
        paddingHorizontal: 5,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        maxWidth: "100%",
        width: "100%",
        // borderColor: "red",
        // borderWidth: 2,

    },

    textInput: {
        borderBottomWidth: 2,
        borderRadius: 10,
        borderColor: colors.primaryAccent600,
        // paddingHorizontal: 15,
        paddingVertical: 5,
        maxWidth: "90%",
        width: "75%",
        fontSize: 16,
        fontWeight: 400,
        color: colors.secondaryAccent900,
    },
});