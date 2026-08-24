export const EmptyBorder = {
  topLeft: "",
  bottomLeft: "",
  vertical: "",
  topRight: "",
  bottomRight: "",
  horizontal: " ",
  bottomT: "",
  topT: "",
  cross: "",
  leftT: "",
  rightT: "",
}

/**
 * A closed outline with rounded corners — the prompt's frame.
 *
 * Rounded rather than square because the input is the one element that should
 * look soft and enterable; square corners on a full box read as a table cell.
 * Every junction is defined even though a plain rectangle uses none of the
 * T-pieces: an undefined junction renders as a hole the moment something nests
 * inside the box.
 */
export const RoundedBorder = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  topT: "┬",
  bottomT: "┴",
  leftT: "├",
  rightT: "┤",
  cross: "┼",
}

export const SplitBorder = {
  border: ["left" as const, "right" as const],
  customBorderChars: {
    ...EmptyBorder,
    vertical: "┃",
  },
}
