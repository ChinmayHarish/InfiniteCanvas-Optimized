import * as React from "react";
import { useSearch } from "~/src/infinite-canvas/search-context";
import type { CardItem } from "~/src/infinite-canvas/types";
import styles from "./style.module.css";

export function Frame({ cards }: { cards: CardItem[] }) {
  const { searchState, setSearchState, setTargetCard } = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalSubscribers = React.useMemo(() => {
    return cards.reduce((acc, card) => acc + card.subscribers, 0);
  }, [cards]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const lowerQuery = query.toLowerCase();

    // Simple filter logic limited to top 5 results for speed
    const results = query
      ? cards.filter((c) => c.name.toLowerCase().includes(lowerQuery)).slice(0, 5)
      : [];

    setSearchState((prev) => ({
      ...prev,
      query,
      results,
      isOpen: !!query,
    }));
  };

  const selectResult = (card: CardItem) => {
    setTargetCard(card);
    setSearchState((prev) => ({
      ...prev,
      isOpen: false,
      query: card.name,
      results: []
    }));
  };

  return (
    <div className={styles.frame}>
      {/* Top Bar: Search */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search subreddits..."
            value={searchState.query}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          {searchState.isOpen && (
            <div className={styles.searchResults}>
              {searchState.results.map((card) => (
                <div
                  key={card.id}
                  className={styles.searchResult}
                  onClick={() => selectResult(card)}
                >
                  <span className={styles.resultName}>r/{card.name}</span>
                  <span className={styles.resultSubs}>
                    {(card.subscribers / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
              {searchState.results.length === 0 && (
                <div className={styles.noResults}>No matches found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Left: Stats */}
      <div className={styles.statsPanel}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Subreddits</span>
          <span className={styles.statValue}>{cards.length.toLocaleString()}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Members</span>
          <span className={styles.statValue}>
            {(totalSubscribers / 1_000_000).toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Bottom Right: Controls */}
      <div className={styles.controlsHint}>
        <div className={styles.keyGroup}>
          <span className={styles.key}>W</span>
          <span className={styles.key}>A</span>
          <span className={styles.key}>S</span>
          <span className={styles.key}>D</span>
          <span className={styles.label}>Move</span>
        </div>
        <div className={styles.keyGroup}>
          <span className={styles.key}>Space</span>
          <span className={styles.label}>Zoom</span>
        </div>
      </div>
    </div>
  );
}
