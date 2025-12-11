import { Image, StyleSheet, Text, View, } from "react-native";

import { Review } from "../RecipeDetailsScreen";
type Item = {
    item: Review
};

const formatterUS = new Intl.DateTimeFormat("en-us", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h12"
});

const UserReview = ({item}: Item) => {
    const formattedDate = new Date(item.updatedAt);
    return (
        <View style={[styles.reviewContainer, {width: "100%"}]}>
            <View style={{padding: 10,}}>
                <View style={{flexDirection: "row"}}>
                    <Image 
                        src={item.user.image} 
                        style={
                            {
                                marginHorizontal: 5, 
                                height: 40, 
                                width: 40,
                                borderRadius: 20,
                            }
                        }
                        >  
                        </Image>

                    <View style={{marginHorizontal: 5,}}>
                        <Text style={{marginHorizontal: 10, color:"white", fontWeight: "bold", fontSize: 16}}>{`${item.user.firstName}`}</Text>

                        <Text style={{marginHorizontal: 10, color:"white", fontSize: 12, marginVertical: 5,}}>{`${formatterUS.format(formattedDate)}`}</Text>

                        <Text style={{color: "white", marginTop: 10, marginLeft: 10, maxWidth: "90%"}}>{`${item.comment}`}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserReview;

const styles = StyleSheet.create({
    reviewContainer: {
        marginVertical: 10,
        // backgroundColor: "#9499a1",
        borderRadius: 6,
        borderBottomWidth: 1,
        borderColor: "white"
    },
})