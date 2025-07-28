import { StyleSheet, Text, View, } from "react-native";

// define types
type CookingDirections = {
    cookingDirections: string[];
};

const CookingDirectionsList = ({cookingDirections}: CookingDirections) => {
    return (
        <View>
            {
                cookingDirections.map((cookingDirection, index) => (<Text key={index}>{cookingDirection}</Text>))
            }
        </View>
    )
};

export default CookingDirectionsList;

const styles = StyleSheet.create({
    
});