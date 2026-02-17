import * as React from "react";
import type { CardItem } from "~/src/infinite-canvas/types";
import styles from "./style.module.css";

export function Frame({ cards }: { cards: CardItem[] }) {
  // Stats calculation
  const totalSubscribers = React.useMemo(() => {
    return cards.reduce((acc, card) => acc + card.subscribers, 0);
  }, [cards]);

  return (
    <div className={styles.frame}>
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
