// ASCII assets for the HackRice 16 hero.
// Wordmark generated with figlet (font: "ANSI Shadow"), composed letter-by-
// letter with a one-column gap — the font's own smushing packs letters
// together, which kills legibility in the browser.

export const WORDMARK = `██╗  ██╗  █████╗   ██████╗ ██╗  ██╗ ██████╗  ██╗  ██████╗ ███████╗
██║  ██║ ██╔══██╗ ██╔════╝ ██║ ██╔╝ ██╔══██╗ ██║ ██╔════╝ ██╔════╝
███████║ ███████║ ██║      █████╔╝  ██████╔╝ ██║ ██║      █████╗
██╔══██║ ██╔══██║ ██║      ██╔═██╗  ██╔══██╗ ██║ ██║      ██╔══╝
██║  ██║ ██║  ██║ ╚██████╗ ██║  ██╗ ██║  ██║ ██║ ╚██████╗ ███████╗
╚═╝  ╚═╝ ╚═╝  ╚═╝  ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═════╝ ╚══════╝`;

export const SIXTEEN = ` ██╗ ██████╗
███║██╔════╝
╚██║███████╗
 ██║██╔═══██╗
 ██║╚██████╔╝
 ╚═╝ ╚═════╝`;

export type Suit = "♠" | "♥" | "♦" | "♣";

export const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];

export const isRedSuit = (suit: Suit) => suit === "♥" || suit === "♦";

/** Build a compact ASCII playing card (11 cols × 9 rows). */
export function makeCardArt(rank: string, suit: Suit): string {
  const r = rank.slice(0, 2);
  const rows = [
    "╭─────────╮",
    `│${r.padEnd(9)}│`,
    `│${suit.padEnd(9)}│`,
    "│         │",
    `│    ${suit}    │`,
    "│         │",
    `│${suit.padStart(9)}│`,
    `│${r.padStart(9)}│`,
    "╰─────────╯",
  ];
  return rows.join("\n");
}

/** The signature "16" card — all four suits at its heart. */
export const SIXTEEN_CARD = `╭─────────╮
│16       │
│         │
│         │
│ ♠ ♥ ♦ ♣ │
│         │
│         │
│       16│
╰─────────╯`;

export interface HandCard {
  rank: string;
  suit: Suit;
  art: string;
  red: boolean;
  sixteen?: boolean;
}

/**
 * The dealt hand: the four track cards (A♥ Healthcare, K♠ Games,
 * Q♦ Finance, J♣ Work & Productivity) around the 16 card.
 */
export const HAND: HandCard[] = [
  { rank: "A", suit: "♥", art: makeCardArt("A", "♥"), red: true },
  { rank: "K", suit: "♠", art: makeCardArt("K", "♠"), red: false },
  { rank: "16", suit: "♠", art: SIXTEEN_CARD, red: false, sixteen: true },
  { rank: "Q", suit: "♦", art: makeCardArt("Q", "♦"), red: true },
  { rank: "J", suit: "♣", art: makeCardArt("J", "♣"), red: false },
];
