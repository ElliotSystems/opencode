import { TextAttributes } from "@opentui/core"
import { Prompt, type PromptRef } from "../component/prompt"
import { createEffect, createMemo, createSignal, onMount } from "solid-js"
import { useSync } from "../context/sync"
import { Toast } from "../ui/toast"
import { useArgs } from "../context/args"
import { useRouteData } from "../context/route"
import { usePromptRef } from "../context/prompt"
import { useLocal } from "../context/local"
import { usePluginRuntime } from "../plugin/runtime"
import { useEditorContext } from "../context/editor"
import { useTerminalDimensions } from "@opentui/solid"
import { useTuiConfig } from "../config"
import { HomeSessionDestinationProvider } from "./home/session-destination"
import { useDirectory } from "../context/directory"
import { useTheme } from "../context/theme"

let once = false
/*
 * Knowledge-shaped, not TODO-shaped.
 *
 * This is the most-read copy in the product -- the first thing on screen in an
 * empty prompt -- and "Fix a TODO in the codebase" says nothing about why this
 * terminal is different from any other coding agent. The first suggestion a user
 * sees should be the thing only Elliot can do: answer from the organisation's
 * indexed knowledge, not just from the files in front of it.
 *
 * Shell suggestions stay as upstream's; shell mode is upstream's feature and its
 * examples are already the right ones.
 */
const placeholder = {
  normal: [
    "Ask why this service is built the way it is",
    "Which PRs changed the auth flow?",
    "Summarise what this repo does for a new joiner",
  ],
  shell: ["ls -la", "git status", "pwd"],
}

export function Home() {
  const pluginRuntime = usePluginRuntime()
  const sync = useSync()
  const route = useRouteData("home")
  const promptRef = usePromptRef()
  const [ref, setRef] = createSignal<PromptRef | undefined>()
  const args = useArgs()
  const local = useLocal()
  const editor = useEditorContext()
  const dimensions = useTerminalDimensions()
  const tuiConfig = useTuiConfig()
  const directory = useDirectory()
  const { theme } = useTheme()
  /*
   * Full width by default; `tui.prompt.max_width` still wins when it is set.
   *
   * The default was 75 columns, which -- with the header no longer centred --
   * left the input stopping short of the right edge for no visible reason, and
   * made it a different width from the session prompt, so it visibly resized the
   * moment you sent the first message. Full width matches the session route, so
   * the field the user is looking at does not move when the conversation starts.
   */
  const promptMaxWidth = createMemo(() => {
    const configured = tuiConfig.prompt?.max_width
    if (configured === undefined) return undefined
    if (configured === "auto") return Math.max(75, Math.floor(dimensions().width * 0.7))
    return configured
  })
  let sent = false

  onMount(() => {
    editor.clearSelection()
  })

  const bind = (r: PromptRef | undefined) => {
    setRef(r)
    promptRef.set(r)
    if (once || !r) return
    if (route.prompt) {
      r.set(route.prompt)
      once = true
      return
    }
    if (!args.prompt) return
    r.set({ input: args.prompt, parts: [] })
    once = true
  }

  // Wait for sync and model store to be ready before auto-submitting --prompt
  createEffect(() => {
    const r = ref()
    if (sent) return
    if (!r) return
    if (!sync.ready || !local.model.ready) return
    if (!args.prompt) return
    if (r.current.input !== args.prompt) return
    sent = true
    r.submit()
  })

  return (
    <HomeSessionDestinationProvider>
      {/*
       * Header at the top, input at the bottom, void between.
       *
       * This screen used to centre a large block wordmark mid-terminal, which
       * read as a splash screen rather than a tool: the identity took the space
       * the conversation was about to need, and the one useful fact on screen
       * (where am I) was a lone `~` under it.
       *
       * The layout now states identity compactly in the top-left corner and gets
       * out of the way. The empty middle is deliberate -- it is exactly where the
       * transcript appears, so the first message fills the void instead of
       * shoving a centred logo aside. Left-aligned throughout: centred text in a
       * terminal reads as decoration, and every line below is left-aligned
       * anyway, so centring only the header made it look detached.
       */}
      <box flexGrow={1} paddingLeft={2} paddingRight={2}>
        <box flexShrink={0} paddingTop={1}>
          <pluginRuntime.Slot name="home_logo" mode="replace">
            <box flexDirection="row" gap={1}>
              {/*
               * The play triangle from the Elliot mark, and the only place the
               * brand orange appears up here. `dashboard/src/App.css` calls the
               * mark's triangle a fixed asset rather than a themeable role, so it
               * reads `primary` (#FF6600) directly.
               */}
              <text fg={theme.primary} selectable={false}>
                ▶
              </text>
              <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
                Elliot AI
              </text>
            </box>
          </pluginRuntime.Slot>
        </box>
        {/*
         * Where am I, on what branch -- the one fact a terminal welcome genuinely
         * owes the reader. Indented two columns so it hangs under the wordmark
         * rather than starting a second column.
         *
         * Model and agent are deliberately NOT repeated here: they already sit
         * directly under the input, and a header that restates them just makes
         * two places to read the same thing.
         */}
        <box flexShrink={0} paddingLeft={2}>
          <text fg={theme.textMuted} selectable={false}>
            {directory()}
          </text>
        </box>
        <box flexGrow={1} minHeight={0} />
        <box width="100%" maxWidth={promptMaxWidth()} zIndex={1000} flexShrink={0}>
          <pluginRuntime.Slot name="home_prompt" mode="replace" ref={bind}>
            <Prompt ref={bind} right={<pluginRuntime.Slot name="home_prompt_right" />} placeholders={placeholder} />
          </pluginRuntime.Slot>
        </box>
        {/*
         * Breathing room between the input and whatever sits under it (hints,
         * tips). Without it the first line below the bottom rule reads as part of
         * the field. `minHeight={0}` so it is the first thing given up when the
         * terminal is short -- spacing is worth less than content.
         */}
        <box height={1} minHeight={0} flexShrink={1} />
        <pluginRuntime.Slot name="home_bottom" />
        <Toast />
      </box>
      <box width="100%" flexShrink={0}>
        <pluginRuntime.Slot name="home_footer" mode="single_winner" />
      </box>
    </HomeSessionDestinationProvider>
  )
}
