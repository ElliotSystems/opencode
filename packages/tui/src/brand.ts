import { RGBA } from "@opentui/core"

/**
 * Elliot's brand orange.
 *
 * A fixed asset, not a themeable role. `dashboard/src/App.css` and
 * `terminal/src/App.css` both treat the mark's orange this way: the identity
 * must not drift if a palette is ever repointed, so the wordmark and the prompt
 * rail read this constant rather than `theme.primary`.
 *
 * It lives here rather than in the theme because the active theme is upstream's,
 * whose `primary` is a peach (#fab283) and whose `secondary` — the colour the
 * prompt rail used to take — is a blue (#5c9cf5). Neither is Elliot's. Adding a
 * whole Elliot palette to reach one colour would be a much larger change than
 * the two places that actually need it.
 */
export const ELLIOT_ORANGE = RGBA.fromHex("#FF6600")
