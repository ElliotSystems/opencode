/**
 * Elliot AI CLI wordmark.
 *
 * Deliberately defined here rather than re-exported from `@opencode-ai/tui/logo`
 * (which this file used to do in one line). The CLI banner and the TUI splash
 * shared that module, so overriding it locally rebrands the CLI *without*
 * touching the TUI — which is a separate, later step.
 *
 * Geometry matches the upstream grid exactly: 4-column glyphs separated by one
 * space, `left` rendered muted and `right` bright. "ELLIOT"(29) + gap + "AI"(9)
 * = 39 columns, identical to the "open"+"code" it replaces, so no layout moves.
 * `_` is a shading mark substituted by the renderer (see `marks`).
 */
export const logo = {
  left: [
    "█▀▀▀ █    █    ▀▀▀ █▀▀█ ▀▀▀",
    "█^^^ █    █     █  █__█  █ ",
    "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀ ▀▀▀▀  ▀ ",
  ],
  // Leading space gives the design's two-column separation; the renderer adds one.
  right: [" █▀▀█ ▀▀▀", " █^^█  █ ", " ▀  ▀ ▀▀▀"],
}

// The "Go" sub-brand glyphs and shading marks stay upstream's - they are not
// Elliot branding and `cli/cmd/run/splash.ts` imports `go` from here.
export { go, marks } from "@opencode-ai/tui/logo"
