import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../constants/colors";

type IngredientListProps = {
    ingredients: string[];
};

const IngredientList = ({ingredients}: IngredientListProps) => {
    return (
        <FlatList
            data={ingredients}
            renderItem={({item}) => {
                return (
                    <View style={styles.listContainer}>
                        <Text style={[styles.text, {fontSize: 25, fontWeight: "bold"}]}>{"\u2022"}</Text>
                        <View style={styles.touchableContainer}>
                            <TouchableOpacity style={styles.touchable}>
                                <Text style={styles.text2}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }}
        >
        </FlatList>
    )
};

export default IngredientList;

const styles = StyleSheet.create({
    listContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    text: {
        marginHorizontal: 5,
    },

    text2: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },

    touchableContainer: {
        width: 100,
    },

    touchable: {
        marginHorizontal: 5,
        backgroundColor: colors.textPrimary700,
        borderWidth: 1,
        borderColor: colors.textPrimary700,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center"
    }
});

