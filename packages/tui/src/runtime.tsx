import path from "path"

/**
 * A directory and its branch as one line of chrome.
 *
 * Three call sites built this string independently -- the home screen, the home
 * footer and the sidebar footer -- so the separator could (and did) drift. One
 * definition means the whole UI answers "where am I" the same way.
 *
 * A middot, not a colon: `Elliot-AI:feat/tui-redesign` reads as one opaque token,
 * or worse as a Windows drive or a host:port, while `Elliot-AI · feat/tui-redesign`
 * reads as the two separate facts it is.
 */
export function formatDirectory(directory: string, branch?: string) {
  if (!branch) return directory
  return directory + " · " + branch
}

export function abbreviateHome(input: string, home: string) {
  if (!home) return input
  const relative = path.relative(home, input)
  if (relative === "") return "~"
  if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) return input
  return "~" + path.sep + relative
}
