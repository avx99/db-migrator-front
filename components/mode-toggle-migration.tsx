"use client"

import { useMigrationMode } from "@/hooks/use-migration-mode"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, FileCode } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function MigrationModeToggle() {
  const { mode, setMode } = useMigrationMode()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Tabs value={mode} onValueChange={(value) => setMode(value as "JAVA" | "SQL")} className="mr-2">
            <TabsList className="h-9">
              <TabsTrigger value="JAVA" className="flex items-center gap-1 px-3">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Java Classes</span>
              </TabsTrigger>
              <TabsTrigger value="SQL" className="flex items-center gap-1 px-3">
                <FileCode className="h-4 w-4" />
                <span className="hidden sm:inline">SQL Files</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle between Java class-based and SQL file-based migrations</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
