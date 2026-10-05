import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { isSameRecipe, toggleFavorite } from "../redux/favoritesSlice";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const routeParams = route.params;
  const recipe = routeParams?.recipe ?? routeParams?.article ?? routeParams;
  const index = routeParams?.index ?? 0;
  const favoriteRecipes = useSelector(
    (state) => state.favorites?.favoriterecipes ?? []
  );

  if (!recipe || typeof recipe !== "object" || Object.keys(recipe).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>没有可用的食谱详细信息</Text>
      </View>
    );
  }

  const isFavourite = favoriteRecipes.some((favorite) =>
    isSameRecipe(favorite, recipe)
  );
  const imageUrl = recipe.image ?? recipe.recipeImage;
  const title = recipe.title ?? recipe.recipeName;
  const description = recipe.description ?? recipe.recipeInstructions;
  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      testID="scrollContent"
    >
      <View style={styles.imageContainer} testID="imageContainer">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.articleImage,
              { height: index % 3 === 0 ? hp(25) : hp(35) },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.topButtonsContainer} testID="topButtonsContainer">
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          testID="GoBack"
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            isFavourite ? "Remove from favorites" : "Add to favorites"
          }
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
          testID="toggleFavorite"
        >
          <Text>{isFavourite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer} testID="contentContainer">
        <Text style={styles.recipeTitle}>{title}</Text>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.contentText}>{description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: wp(5),
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  imageContainer: {
    alignItems: "center",
  },
  articleImage: {
    width: wp(98),
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginTop: 4,
  },
  topButtonsContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(4),
  },
  backButton: {
    padding: 8,
    marginLeft: wp(5),
    borderRadius: 50,
    backgroundColor: "white",
  },
  favoriteButton: {
    padding: 8,
    marginRight: wp(5),
    borderRadius: 50,
    backgroundColor: "white",
  },
  contentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
  },
  title: {
    fontSize: hp(2.5),
    color: "#4B5563",
    textAlign: "center",
  },
  recipeTitle: {
    marginBottom: hp(2),
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#4B5563",
  },
  sectionContainer: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    marginBottom: hp(1),
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "#4B5563",
  },
  contentText: {
    fontSize: hp(1.8),
    color: "#4B5563",
  },
});
