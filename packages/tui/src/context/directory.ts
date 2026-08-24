import { createMemo } from "solid-js"
import { useProject } from "./project"
import { useSync } from "./sync"
import { abbreviateHome, formatDirectory } from "../runtime"
import { useTuiPaths } from "./runtime"

export function useDirectory() {
  const project = useProject()
  const sync = useSync()
  const paths = useTuiPaths()
  return createMemo(() => {
    const directory = project.instance.path().directory || paths.cwd
    return formatDirectory(abbreviateHome(directory, paths.home), sync.data.vcs?.branch)
  })
}
