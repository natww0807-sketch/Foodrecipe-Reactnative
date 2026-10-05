import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();
  const favoriteRecipes = useSelector(
    (state) => state.favorites?.favoriterecipes ?? []
  );

  const openRecipe = (recipe, index) => {
    const isCustomRecipe =
      recipe.title != null || recipe.description != null || recipe.image != null;

    if (isCustomRecipe) {
      navigation.navigate("CustomRecipesScreen", { recipe, index });
    } else {
      navigation.navigate("RecipeDetail", recipe);
    }
  };

  const renderFavorite = ({ item, index }) => {
    const image = item.image ?? item.recipeImage;
    const title = item.title ?? item.recipeName ?? "Untitled recipe";
    const description = item.description ?? item.recipeInstructions;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => openRecipe(item, index)}
        style={styles.cardContainer}
        testID="favoriteRecipeCard"
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <View style={[styles.recipeImage, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {title}
          </Text>
          {description ? (
            <Text style={styles.recipeDescription} numberOfLines={3}>
              {description}
            </Text>
          ) : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} testID="FavoriteRecipes">
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>My Favorite Recipes</Text>
      </View>

      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item, index) =>
          String(
            item.idFood ??
              item.idCategory ??
              item.id ??
              `${item.title ?? item.recipeName ?? "recipe"}-${index}`
          )
        }
        renderItem={renderFavorite}
        contentContainerStyle={
          favoriteRecipes.length === 0
            ? styles.emptyListContainer
            : styles.listContentContainer
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite recipes yet!</Text>
        }
        testID="favoriteRecipesList"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
    paddingBottom: hp(1.5),
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
  },
  backButtonText: {
    color: "#2563EB",
    fontSize: hp(2),
  },
  heading: {
    marginTop: hp(1),
    fontSize: hp(3.2),
    fontWeight: "600",
    color: "#4B5563",
  },
  listContentContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(3),
  },
  emptyListContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
  },
  emptyText: {
    color: "#6B7280",
    fontSize: hp(2.2),
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
    padding: wp(3),
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  recipeImage: {
    width: wp(22),
    height: wp(22),
    marginRight: wp(3),
    borderRadius: 10,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: hp(1.5),
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    color: "#374151",
    fontSize: hp(2.1),
    fontWeight: "bold",
  },
  recipeDescription: {
    marginTop: hp(0.5),
    color: "#6B7280",
    fontSize: hp(1.7),
  },
  chevron: {
    marginLeft: wp(2),
    color: "#9CA3AF",
    fontSize: hp(3.5),
  },
});
