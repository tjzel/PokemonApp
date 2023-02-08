import { Dispatch, SetStateAction, createContext } from "react";

export interface FavouriteContextType {
  favouritePokemon: string | number | null;
  setFavouritePokemon: Dispatch<SetStateAction<string | number | null>> | null;
}

export const FavouriteContext = createContext<FavouriteContextType>({
  favouritePokemon: null,
  setFavouritePokemon: null,
});
