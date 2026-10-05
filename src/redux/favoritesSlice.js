import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

export const isSameRecipe = (favorite, recipe) => {
  if (!favorite || !recipe) return false;

  if (favorite.idFood != null || recipe.idFood != null) {
    return favorite.idFood != null && favorite.idFood === recipe.idFood;
  }

  if (favorite.idCategory != null || recipe.idCategory != null) {
    return (
      favorite.idCategory != null &&
      favorite.idCategory === recipe.idCategory
    );
  }

  if (favorite.id != null || recipe.id != null) {
    return favorite.id != null && favorite.id === recipe.id;
  }

  const hasCustomRecipeFields =
    recipe.title != null || recipe.image != null || recipe.description != null;

  return (
    hasCustomRecipeFields &&
    favorite.title === recipe.title &&
    favorite.image === recipe.image &&
    favorite.description === recipe.description
  );
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;
      const existingIndex = state.favoriterecipes.findIndex(
        (favrecipe) => isSameRecipe(favrecipe, recipe)
      );

      if (existingIndex >= 0) {
        // Already in favorites -> remove it
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        // Not in favorites -> add it
        state.favoriterecipes.push(recipe);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
