import * as React from "react";
import type { CardItem } from "./types";

type SearchState = {
    query: string;
    results: CardItem[];
    selectedIndex: number;
    isOpen: boolean;
};

type SearchContextType = {
    searchState: SearchState;
    setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
    targetCard: CardItem | null;
    setTargetCard: (card: CardItem | null) => void;
    hoveredCard: CardItem | null;
    setHoveredCard: (card: CardItem | null) => void;
};

const SearchContext = React.createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchState, setSearchState] = React.useState<SearchState>({
        query: "",
        results: [],
        selectedIndex: -1,
        isOpen: false,
    });

    const [targetCard, setTargetCard] = React.useState<CardItem | null>(null);
    const [hoveredCard, setHoveredCard] = React.useState<CardItem | null>(null);

    return (
        <SearchContext.Provider
            value={{
                searchState,
                setSearchState,
                targetCard,
                setTargetCard,
                hoveredCard,
                setHoveredCard,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = React.useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
};
