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
 * Two horizontal rules — the prompt's frame, used with `border={["top","bottom"]}`.
 *
 * A rule above and a rule below, and deliberately nothing at the sides. Vertical
 * edges would box the input in and cost two columns of every wrapped line; open
 * ends let the text run the full width of the terminal, which is what the input
 * is for. It is also the shape a terminal reader already understands as "the
 * field", the same one Claude Code's prompt uses.
 *
 * The four corners are `─` rather than corner glyphs precisely because there are
 * no verticals for them to join: a `╭` with nothing descending from it reads as a
 * broken box. Painting them as more of the rule keeps each line unbroken from
 * edge to edge.
 */
export const RuleBorder = {
  topLeft: "─",
  topRight: "─",
  bottomLeft: "─",
  bottomRight: "─",
  horizontal: "─",
  vertical: " ",
  topT: "─",
  bottomT: "─",
  leftT: "─",
  rightT: "─",
  cross: "─",
}

export const SplitBorder = {
  border: ["left" as const, "right" as const],
  customBorderChars: {
    ...EmptyBorder,
    vertical: "┃",
  },
}
