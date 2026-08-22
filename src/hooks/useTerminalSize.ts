import { useStdout } from "ink"
import { useEffect, useState } from "react"
import type { LayoutMode } from "../types/ui.js"

export function useTerminalSize() {
  const { stdout } = useStdout()
  const [size, setSize] = useState({
    columns: stdout?.columns ?? 80,
    rows: stdout?.rows ?? 24,
  })

  useEffect(() => {
    if (!stdout) return

    const onResize = () => {
      setSize({
        columns: stdout.columns ?? 80,
        rows: stdout.rows ?? 24,
      })
    }

    stdout.on("resize", onResize)
    return () => {
      stdout.off("resize", onResize)
    }
  }, [stdout])

  const layoutMode: LayoutMode =
    size.columns >= 100 ? "wide" : size.columns >= 70 ? "compact" : "single"

  return {
    ...size,
    layoutMode,
  }
}
