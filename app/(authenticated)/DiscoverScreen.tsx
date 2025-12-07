import { useContext, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";

// import context(s)
import { RecipeContext } from "@/context/RecipeContext";
import { UserContext } from "@/context/UserContext";

import { getAllPublicRecipesPaged } from "@/api/recipes";
import { useInfiniteQuery, } from "@tanstack/react-query";

// import component(s)
import DiscoverItem from "../components/DiscoverItem";
import SearchRecipesInput from "../components/SearchRecipesInput";
import colors from "../constants/colors";

// import debounce utility helper function(s);
import { debounce, useDebouncedInput } from "@/utils/debounceHelpers";

const PAGE_ITEM_LIMIT = 20;

const DiscoverScreen = () => {
    const { width: screenWidth } = useWindowDimensions();

    const { accessToken } = useContext(UserContext);
    const { searchRecipesInput } = useContext(RecipeContext);


    const numColumns = useMemo(() => {
        if(screenWidth >= 1024) return 4;

        if(screenWidth >= 768) return 3;
        
        return 2;
    }, [screenWidth]);

    const debouncedSearchInput = useDebouncedInput(searchRecipesInput, 500, debounce);

    // useInfiniteQuery for searching public recipes
    const searchQuery = useInfiniteQuery({
        queryKey: ["publicRecipes", "search", "discover", debouncedSearchInput,],
        initialPageParam: null,
        queryFn: ({pageParam, signal}) => getAllPublicRecipesPaged({
            accessToken,
            limit: PAGE_ITEM_LIMIT,
            cursor: pageParam,
            q: debouncedSearchInput,
            signal,
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        enabled: !!debouncedSearchInput,
        staleTime: 10000, // 10 seconds
        gcTime: 60000 * 10, // 10 minutes
    });

    // useInfiniteQuery for infinite scroll
    const discoverQuery = useInfiniteQuery({
        queryKey: ["publicRecipes", "discover",],

        initialPageParam: null,

        // - on first call: pageParam = initialPageParam (null)
        // - on second call: pageParam = return value of getNextPageParam (our cursor i.e nextCursor)
        queryFn: ({pageParam, signal}) => getAllPublicRecipesPaged({
            accessToken,
            limit: PAGE_ITEM_LIMIT,
            cursor: pageParam, // feeds the cursor (i.e the bookmark) to the backend
            signal,
        }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
        staleTime: 60000, // 1 minute
        gcTime: 60000 * 10, // 10 minutes,
    });

    //if there is a debounched search input, then the active query is searchQuery. Otherwise, active query will be discoverQuery. Then we will render whatever the activeQuery is
    const activeQuery = debouncedSearchInput && debouncedSearchInput.length ? searchQuery : discoverQuery;

    // flattening all pages to a single array of items so that it works with FlatList
    const recipes = activeQuery.data?.pages.flatMap((page) => page.items) ?? [];
    // data.pages looks like:
    //     data.pages = [
    //   { items: [...20],         nextCursor: "C1" },
    //   { items: [...next 20],    nextCursor: "C2" },
    // ];

    // data.pageParams = [
    //   null,   // first page’s pageParam
    //   "C1",   // second page used "C1"
    // ];

    //function that fetches the next page when flatlist reaches the end of the page that user scrolls
    // Avoids spamming extra requests while fetch is happening or there is no next page
    const handleEndReached = () => {
        if(!discoverQuery.hasNextPage || discoverQuery.isFetchingNextPage) return;

        discoverQuery.fetchNextPage();
    };

    if(activeQuery.isLoading){
        return (
            <View style={styles.outerContainer}>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text>Loading public recipes...</Text>
                    <ActivityIndicator size={32} color={colors.primaryAccent900}></ActivityIndicator>
                </View>

            </View>
        );
    };

    if(activeQuery.isError){
        return (
            <View style={[styles.outerContainer, {alignItems: "center"}]}>
                <Text style={styles.errorTitle}>Error loading public recipes</Text>
                <Text style={styles.errorDetail}>{activeQuery.isError ?? "Please try again."}</Text>
            </View>
        )
    };

    if(recipes.length === 0 || !recipes.length){
        return (
            <View style={[styles.outerContainer, {alignItems: "center",}]}>
                <SearchRecipesInput></SearchRecipesInput>
                <Text>No recipes found!</Text>
            </View>
        );
    };

    return (
        <View style={styles.outerContainer}>
            {
                activeQuery.data && (
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <SearchRecipesInput></SearchRecipesInput>
                    </View>
                )
            }
            <FlatList 
                data={recipes}
                keyExtractor={(item) => item._id }
                renderItem={({item}) => {
                    return (
                        <DiscoverItem recipeData={item}></DiscoverItem>
                    )
                }}
                horizontal={false}
                numColumns={numColumns}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={numColumns > 1 ? styles.rowGap : undefined}
                showsVerticalScrollIndicator={false}

                onEndReachedThreshold={0.4}
                onEndReached={handleEndReached}
                ListFooterComponent={
                    discoverQuery.isFetchingNextPage ? (
                        <View>
                            <ActivityIndicator size={24} color={colors.primaryAccent800}></ActivityIndicator>
                        </View>
                    ) : null
                }
                refreshing={discoverQuery.isRefetching}
                onRefresh={() => discoverQuery.refetch()}
            />
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "white",
        // alignItems: "center",
        // justifyContent: "center",
    },

    listContent: {
        paddingHorizontal: 15,
        rowGap: 10,

    },

    rowGap: {
        columnGap: 10,
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#B91C1C",
  },
  errorDetail: {
        marginTop: 6,
        color: "#6B7280",
  },
});