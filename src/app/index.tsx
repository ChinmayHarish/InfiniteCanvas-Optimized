import * as React from "react";
import cardsData from "~/src/data/cards.json";
import { Frame } from "~/src/frame";
import { InfiniteCanvas } from "~/src/infinite-canvas";
import type { CardItem } from "~/src/infinite-canvas/types";

import { SearchProvider } from "~/src/infinite-canvas/search-context";

export function App() {
  const [cards] = React.useState<CardItem[]>(() =>
    (cardsData as Omit<CardItem, "id">[]).map(c => ({ ...c, id: c.name }))
  );

  return (
    <SearchProvider>
      <Frame cards={cards} />
      <InfiniteCanvas cards={cards} />
    </SearchProvider>
  );
}
