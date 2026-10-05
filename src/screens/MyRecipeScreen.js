import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchrecipes = useCallback(async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
    } catch (error) {
      console.log("Error loading recipes:", error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchrecipes();
    const unsubscribe = navigation.addListener("focus", fetchrecipes);
    return unsubscribe;
  }, [fetchrecipes, navigation]);

  const handleAddrecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handlerecipeClick = (recipe, index) => {
    navigation.navigate("CustomRecipesScreen", { recipe, index });
  };

  const deleterecipe = async (index) => {
    try {
      const updatedrecipes = [...recipes];
      updatedrecipes.splice(index, 1);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedrecipes));
      setRecipes(updatedrecipes);
    } catch (error) {
      console.log("Error deleting recipe:", error);
    }
  };

  const editrecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#4F75FF"
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => {
              const description = recipe.description ?? "";
              const descriptionPreview =
                description.length > 50
                  ? `${description.slice(0, 50)}...`
                  : description;

              return (
                <View
                  key={recipe.id ?? `${recipe.title ?? "recipe"}-${index}`}
                  style={styles.recipeCard}
                  testID="recipeCard"
                >
                  <TouchableOpacity
                    accessibilityRole="button"
                    testID="handlerecipeBtn"
                    onPress={() => handlerecipeClick(recipe, index)}
                  >
                    {recipe.image ? (
                      <Image
                        source={{ uri: recipe.image }}
                        style={styles.recipeImage}
                      />
                    ) : null}
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    {descriptionPreview ? (
                      <Text style={styles.recipeDescription} testID="recipeDescp">
                        {descriptionPreview}
                      </Text>
                    ) : null}
                  </TouchableOpacity>

                  <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => editrecipe(recipe, index)}
                      style={[styles.actionButton, styles.editButton]}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={() => deleterecipe(index)}
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: hp(1.5),
  },
  backButtonText: {
    color: "#4F75FF",
    fontSize: hp(2.2),
  },
  addButton: {
    width: "100%",
    alignItems: "center",
    marginBottom: hp(2),
    paddingVertical: hp(1.2),
    borderRadius: 8,
    backgroundColor: "#4F75FF",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },
  loader: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(2),
  },
  noRecipesText: {
    marginTop: hp(5),
    color: "#6B7280",
    fontSize: hp(2),
    textAlign: "center",
  },
  recipeCard: {
    marginBottom: hp(2),
    padding: wp(4),
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeImage: {
    width: "100%",
    height: hp(22),
    marginBottom: hp(1),
    borderRadius: 8,
  },
  recipeTitle: {
    marginBottom: hp(0.5),
    color: "#111827",
    fontSize: hp(2.2),
    fontWeight: "600",
  },
  recipeDescription: {
    marginBottom: hp(1),
    color: "#6B7280",
    fontSize: hp(1.8),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: hp(1),
  },
  actionButton: {
    minWidth: wp(20),
    alignItems: "center",
    marginLeft: wp(2),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: "#34D399",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: hp(1.8),
    fontWeight: "600",
  },
});
