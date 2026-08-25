/**
 * ELLIOT / AI as plain block letters.
 *
 * The previous grid was a half-block design carrying shading marks (`_` and `^`,
 * see `marks` below), which the renderers turn into cells painted on a tinted
 * background. In this wordmark that put `█__█` inside the O, so the letter drew
 * with a dark box in the middle of it — and the half-height rows left E, I and T
 * hard to tell apart at a glance.
 *
 * These glyphs use nothing but `█` and spaces. No marks means no tint and no
 * background cells, so every consumer renders the same thing — `component/logo.tsx`,
 * `util/presentation.ts`, and any terminal regardless of how it treats
 * background colour.
 *
 * Metrics: five rows; letters are four columns wide except `I` and `T` which are
 * three, separated by a single space. `left` is 27 columns, `right` is 8. The two
 * arrays must stay the same length, because `logo.right[index]` is looked up once
 * per row of `logo.left`.
 */
export const logo = {
  left: [
    "████ █    █    ███ ████ ███",
    "█    █    █     █  █  █  █ ",
    "███  █    █     █  █  █  █ ",
    "█    █    █     █  █  █  █ ",
    "████ ████ ████ ███ ████  █ ",
  ],
  right: ["████ ███", "█  █  █ ", "████  █ ", "█  █  █ ", "█  █ ███"],
}
export const go = {
  left: ["    ", "█▀▀▀", "█_^█", "▀▀▀▀"],
  right: ["    ", "█▀▀█", "█__█", "▀▀▀▀"],
}

export const marks = "_^~,"
