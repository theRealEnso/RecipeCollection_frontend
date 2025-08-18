import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

//import components
// import FormInput from "./FormInput";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from "./CustomButton";
import Direction from "./Direction";

// import Recipe context
import { RecipeContext } from "@/context/RecipeContext";

// import colors
import colors from "../constants/colors";

//import type definitions

//import utility function to generate random ID
import { generateUUID } from "@/utils/generateUUID";

type SubDirectionsProp = {
    name: string;
    id: string;
};

const Subdirections = ({name, id,}: SubDirectionsProp) => {
    const subDirectionsRef = useRef(null)
    const {subDirections, setSubDirections} = useContext(RecipeContext);

    const [input, setInput] = useState<string>("");
    const [dirId, setDirId] = useState<string>("");

    const handleInputChange = (userInput: string) => {
        setInput(userInput);
    };

    //function to add a direction to the sub directions array
    const addDirections = () => {
        if(!input || input.length ===0 ){
            return;
        }

        let subDirection = {
            sublistName: name,
            sublistId: id,
            direction: input,
            direction_id: generateUUID(),
        };

        let updatedDirections = [...subDirections, subDirection];
        setSubDirections(updatedDirections);
        setInput("");
    };

    //function to remove a direction from the sub directions array
    const removeDirection = (directionId: string) => {
        const updatedSubDirections = subDirections.filter((subDirection) => subDirection.direction_id !== directionId);
        setSubDirections(updatedSubDirections);
    };

    //function to edit a specific direction from the sub directions array
    const updateDirection = (directionId: string, updatedDirection: string) => {
        const updatedSubDirections = subDirections.map((subDirection) => subDirection.direction_id === directionId ? {...subDirection, direction: updatedDirection} : subDirection);

        setSubDirections(updatedSubDirections);
    };

    const filteredSubDirections = subDirections.filter((subDirection) => subDirection.sublistId === id);

    useEffect(() => {
        if(subDirectionsRef.current){
            subDirectionsRef.current.scrollToEnd({
                animated: true,
            });
        };
    }, [subDirections]);
    
    return (
        <View style={{height: 250}}>
            <Pressable style={styles.container}>
                <View style={{marginBottom: 10,}}>
                    <Text style={styles.listLabel}>{`Prep/cooking instructions for ${name}`}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <View style={{width: 280, marginHorizontal: 5}}>
                        <TextInput 
                            placeholder="Add food handling directions" 
                            value={input}
                            onChangeText={(typedValue) => handleInputChange(typedValue) }
                            style={styles.textInputStyles}
                        >
                        </TextInput>
                    </View>
                    <View style={{marginHorizontal: 5}}>
                        <CustomButton
                            value={<MaterialIcons name="add-task" size={24} color="black" />}
                            width={35}
                            color={colors.primaryAccent900}
                            radius={20}
                            onButtonPress={addDirections}
                        >
                        </CustomButton>
                    </View>
                </View>

                {
                    subDirections 
                         && subDirections.length > 0
                        && (
                            <FlatList
                                ref={subDirectionsRef}
                                data={filteredSubDirections}
                                keyExtractor={(item) => item.direction_id}
                                renderItem={({item}) => (
                                    <Direction
                                        sublistName={item.sublistName}
                                        sublistId={item.sublistId}
                                        direction={item.direction}
                                        directionId={item.direction_id}
                                        onEdit={updateDirection}
                                        onDelete={removeDirection}
                                        dirId={dirId}
                                        setDirId={setDirId}
                
                                    >
                                    </Direction>
                                )}
                            >
                            </FlatList>
                        )
                }
            </Pressable>
        </View>
    )
};

export default Subdirections;

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: "white",
        padding: 5,
    },

    textInputStyles: {
        borderRadius: 10,
        borderColor: colors.textPrimary600,
        borderWidth: 2,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    listLabel: {
        color: colors.textPrimary700,
        fontWeight: "bold",
    },
});