"use client"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Play,
  Rewind,
  FileText,
  Beaker,
  Maximize2,
  Minimize2,
  Download,
  Trash,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useConsole } from "@/hooks/use-console"
import { useSettings } from "@/hooks/use-settings"

export default function ConsolePanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { logs, clearLogs, runMigration, rollback, dryRun, showSql } = useConsole()
  const { settings } = useSettings()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const consolePanelRef = useRef<HTMLDivElement>(null)

  // Default heights
  const DEFAULT_HEIGHT = "300px"
  const EXPANDED_HEIGHT = "calc(80vh - 64px)"
  const MINIMIZED_HEIGHT = "40px" // Just enough for the header

  // Scroll to bottom when logs change if autoScrollLogs is enabled
  useEffect(() => {
    if (scrollAreaRef.current && settings.console.autoScrollLogs) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [logs, settings.console.autoScrollLogs])

  const toggleExpand = () => {
    if (isMinimized) {
      // If minimized, restore to default first
      setIsMinimized(false)
      if (consolePanelRef.current) {
        consolePanelRef.current.style.height = DEFAULT_HEIGHT
      }
      // Then toggle expanded state
      setIsExpanded(false)
      return
    }

    setIsExpanded(!isExpanded)
    if (consolePanelRef.current) {
      consolePanelRef.current.style.height = isExpanded ? DEFAULT_HEIGHT : EXPANDED_HEIGHT
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (consolePanelRef.current) {
      consolePanelRef.current.style.height = isMinimized ? DEFAULT_HEIGHT : MINIMIZED_HEIGHT
    }
    // If expanding from minimized state and was previously expanded, restore to expanded state
    if (isMinimized && isExpanded) {
      consolePanelRef.current!.style.height = EXPANDED_HEIGHT
    } else if (isMinimized) {
      // If we're restoring from minimized, make sure expanded state is off
      setIsExpanded(false)
    }
  }

  const getLogLevelClass = (level: string) => {
    switch (level) {
      case "INFO":
        return "log-level-info"
      case "WARN":
        return "log-level-warn"
      case "ERROR":
        return "log-level-error"
      default:
        return "text-foreground"
    }
  }

  // Auto-open console on startup if enabled in settings
  useEffect(() => {
    if (settings.general.autoOpenConsole && consolePanelRef.current) {
      consolePanelRef.current.style.height = "calc(50vh - 64px)"
    }
  }, [settings.general.autoOpenConsole])

  return (
    <div
      ref={consolePanelRef}
      className="relative flex flex-col border-t"
      style={{
        height: DEFAULT_HEIGHT,
        transition: "height 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <h3 className="text-sm font-medium">Console</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMinimize} title={isMinimized ? "Restore" : "Minimize"}>
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={clearLogs} title="Clear logs">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}} title="Download logs">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleExpand} title={isExpanded ? "Restore" : "Expand"}>
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <Tabs defaultValue="console" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 justify-start">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="console" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full p-4 font-mono text-sm" ref={scrollAreaRef}>
              <AnimatePresence initial={false}>
                {logs.slice(0, settings.console.maxLogLines).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("mb-1", getLogLevelClass(log.level))}
                  >
                    {settings.console.showTimestamps && (
                      <span className="text-muted-foreground">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    )}{" "}
                    <span className="font-semibold">{log.level}</span>: {log.message}
                  </motion.div>
                ))}
                {logs.length === 0 && (
                  <div className="text-muted-foreground italic">
                    No logs to display. Run a migration to see logs here.
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="actions" className="flex-1 p-4 m-0">
            <div className="grid grid-cols-2 gap-4">
              <Button className="flex items-center gap-2" onClick={runMigration}>
                <Play className="h-4 w-4" />
                Run Migration
              </Button>
              <Button className="flex items-center gap-2" variant="outline" onClick={rollback}>
                <Rewind className="h-4 w-4" />
                Rollback
              </Button>
              <Button className="flex items-center gap-2" variant="outline" onClick={dryRun}>
                <Beaker className="h-4 w-4" />
                Dry Run
              </Button>
              <Button className="flex items-center gap-2" variant="outline" onClick={showSql}>
                <FileText className="h-4 w-4" />
                Show SQL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
