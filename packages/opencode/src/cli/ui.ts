import { EOL } from "os"
import { Schema } from "effect"
import { logo as glyphs } from "./logo"

const wordmark = [
  `█▀▀▀ █    █    ▀▀▀ █▀▀█ ▀▀▀  █▀▀█ ▀▀▀`,
  `█▀▀▀ █    █     █  █  █  █   █▀▀█  █ `,
  `▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀ ▀▀▀▀  ▀   ▀  ▀ ▀▀▀`,
]

export class CancelledError extends Schema.TaggedErrorClass<CancelledError>()("UICancelledError", {}) {}

/**
 * Elliot AI brand colours.
 *
 * #FF6600 is the accent shared with the terminal app (terminal/src/App.css)
 * and the legacy CLI (elliot-cli/src/theme.ts ACCENT), so the CLI now matches
 * the rest of the product. Emitted as 24-bit colour for exact brand fidelity;
 * terminals without truecolour degrade to their nearest palette entry.
 *
 * Only the ACCENT roles are rebranded. Danger/warning/success keep their
 * conventional red/yellow/green: an error that stops looking red is a
 * usability regression, not branding.
 */
const ORANGE = "\x1b[38;2;255;102;0m"
const ORANGE_DIM = "\x1b[38;2;166;66;0m"
const ORANGE_SHADOW_FG = "\x1b[38;2;92;37;0m"
const ORANGE_SHADOW_BG = "\x1b[48;2;46;18;0m"
const ORANGE_DEEP_FG = "\x1b[38;2;138;55;0m"
const ORANGE_DEEP_BG = "\x1b[48;2;66;26;0m"

export const Style = {
  TEXT_HIGHLIGHT: ORANGE,
  TEXT_HIGHLIGHT_BOLD: ORANGE + "\x1b[1m",
  TEXT_DIM: "\x1b[90m",
  TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
  TEXT_NORMAL: "\x1b[0m",
  TEXT_NORMAL_BOLD: "\x1b[1m",
  TEXT_WARNING: "\x1b[93m",
  TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
  TEXT_DANGER: "\x1b[91m",
  TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
  TEXT_SUCCESS: "\x1b[92m",
  TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
  TEXT_INFO: ORANGE,
  TEXT_INFO_BOLD: ORANGE + "\x1b[1m",
}

export function println(...message: string[]) {
  print(...message)
  process.stderr.write(EOL)
}

export function print(...message: string[]) {
  blank = false
  process.stderr.write(message.join(" "))
}

let blank = false
export function empty() {
  if (blank) return
  println("" + Style.TEXT_NORMAL)
  blank = true
}

export function logo(pad?: string) {
  if (!process.stdout.isTTY && !process.stderr.isTTY) {
    const result = []
    for (const row of wordmark) {
      if (pad) result.push(pad)
      result.push(row)
      result.push(EOL)
    }
    return result.join("").trimEnd()
  }

  const result: string[] = []
  const reset = "\x1b[0m"
  const left = {
    fg: ORANGE_DIM,
    shadow: ORANGE_SHADOW_FG,
    bg: ORANGE_SHADOW_BG,
  }
  const right = {
    fg: ORANGE,
    shadow: ORANGE_DEEP_FG,
    bg: ORANGE_DEEP_BG,
  }
  const gap = " "
  const draw = (line: string, fg: string, shadow: string, bg: string) => {
    const parts: string[] = []
    for (const char of line) {
      if (char === "_") {
        parts.push(bg, " ", reset)
        continue
      }
      if (char === "^") {
        parts.push(fg, bg, "▀", reset)
        continue
      }
      if (char === "~") {
        parts.push(shadow, "▀", reset)
        continue
      }
      if (char === " ") {
        parts.push(" ")
        continue
      }
      parts.push(fg, char, reset)
    }
    return parts.join("")
  }
  glyphs.left.forEach((row, index) => {
    if (pad) result.push(pad)
    result.push(draw(row, left.fg, left.shadow, left.bg))
    result.push(gap)
    const other = glyphs.right[index] ?? ""
    result.push(draw(other, right.fg, right.shadow, right.bg))
    result.push(EOL)
  })
  return result.join("").trimEnd()
}

export async function input(prompt: string): Promise<string> {
  const readline = require("readline")
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

export function error(message: string) {
  if (message.startsWith("Error: ")) {
    message = message.slice("Error: ".length)
  }
  println(Style.TEXT_DANGER_BOLD + "Error: " + Style.TEXT_NORMAL + message)
}

export function markdown(text: string): string {
  return text
}

export * as UI from "./ui"
