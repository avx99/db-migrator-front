"use client"

import { useState, useRef, useEffect } from "react"
import { Database, Search, Plus, Server, FileCode, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSettingsModal } from "@/hooks/use-settings-modal"
import { useHelpModal } from "@/hooks/use-help-modal"

interface SidebarProps {
  selectedEnvironment: string
  onEnvironmentChange: (env: string) => void
  selectedProject: string
  onProjectChange: (project: string) => void
}

export default function Sidebar({
  selectedEnvironment,
  onEnvironmentChange,
  selectedProject,
  onProjectChange,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { openModal: openSettingsModal } = useSettingsModal()
  const { openModal: openHelpModal } = useHelpModal()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Refs for elements that need focus
  const searchInputRef = useRef<HTMLInputElement>(null)
  const environmentSelectRef = useRef<HTMLButtonElement>(null)
  const projectSelectRef = useRef<HTMLButtonElement>(null)
  const newMigrationRef = useRef<HTMLButtonElement>(null)
  const connectionsRef = useRef<HTMLButtonElement>(null)
  const templatesRef = useRef<HTMLButtonElement>(null)
  const settingsRef = useRef<HTMLButtonElement>(null)
  const helpRef = useRef<HTMLButtonElement>(null)

  const environments = ["DEV", "QA", "STAGING", "PROD"]
  const projects = ["main-database", "auth-service", "user-service", "payment-service"]

  const toggleSidebar = () => {
    // Cancel any pending transitions
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    setIsCollapsed(!isCollapsed)
    setActiveElement(null) // Reset active element when manually toggling
    setOpenDropdown(null) // Reset open dropdown when manually toggling
  }

  // Handle click on icon in collapsed mode
  const handleIconClick = (elementId: string, elementType: "input" | "dropdown" | "action", callback?: () => void) => {
    if (isCollapsed) {
      // Only expand for inputs and dropdowns
      if (elementType === "input" || elementType === "dropdown") {
        setIsCollapsed(false)
        setActiveElement(elementId)
        if (elementType === "dropdown") {
          // Delay setting openDropdown until after transition
          transitionTimeoutRef.current = setTimeout(() => {
            setOpenDropdown(elementId)
          }, 300)
        }
      } else if (callback) {
        // For actions, just execute the callback without expanding
        callback()
      }
    } else if (callback) {
      // When sidebar is already expanded, just execute the callback
      callback()
    }
  }

  // Focus or activate the appropriate element after sidebar expands
  useEffect(() => {
    if (!isCollapsed && activeElement) {
      transitionTimeoutRef.current = setTimeout(() => {
        switch (activeElement) {
          case "search":
            searchInputRef.current?.focus()
            break
          case "environment":
            environmentSelectRef.current?.click()
            break
          case "project":
            projectSelectRef.current?.click()
            break
          default:
            break
        }
        setActiveElement(null)
      }, 300) // Wait for transition to complete
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [isCollapsed, activeElement])

  // Mock functions for button actions
  const handleNewMigration = () => {
    console.log("Creating new migration")
  }

  const handleConnections = () => {
    console.log("Opening connections")
  }

  const handleTemplates = () => {
    console.log("Opening templates")
  }

  // Don't render anything until client-side
  if (!mounted) {
    return null
  }

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-background border-r transition-all duration-300",
        isCollapsed && "w-16"
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <Database className="h-5 w-5 text-primary" />
          {!isCollapsed && <h2 className="font-semibold">DB Migrator</h2>}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed ? (
        // Expanded sidebar content
        <>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search migrations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 border-b">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Environment</label>
                <Select
                  value={selectedEnvironment}
                  onValueChange={(value) => {
                    onEnvironmentChange(value)
                    setOpenDropdown(null)
                  }}
                  open={openDropdown === "environment"}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenDropdown("environment")
                    } else {
                      setOpenDropdown(null)
                    }
                  }}
                >
                  <SelectTrigger ref={environmentSelectRef}>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env} value={env}>
                        {env}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select
                  value={selectedProject}
                  onValueChange={(value) => {
                    onProjectChange(value)
                    setOpenDropdown(null)
                  }}
                  open={openDropdown === "project"}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenDropdown("project")
                    } else {
                      setOpenDropdown(null)
                    }
                  }}
                >
                  <SelectTrigger ref={projectSelectRef}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-1">
              <Button
                ref={newMigrationRef}
                variant="ghost"
                className="w-full justify-start"
                onClick={handleNewMigration}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Migration
              </Button>
              <Button ref={connectionsRef} variant="ghost" className="w-full justify-start" onClick={handleConnections}>
                <Server className="mr-2 h-4 w-4" />
                Connections
              </Button>
              <Button ref={templatesRef} variant="ghost" className="w-full justify-start" onClick={handleTemplates}>
                <FileCode className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="space-y-1">
              {/* Use Button directly with openSettingsModal */}
              <Button ref={settingsRef} variant="ghost" className="w-full justify-start" onClick={openSettingsModal}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button ref={helpRef} variant="ghost" className="w-full justify-start" onClick={openHelpModal}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Collapsed sidebar content
        <>
          <div className="flex flex-col items-center py-4 gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleIconClick("search", "input")}>
                    <Search className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Search migrations</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => handleIconClick("environment", "dropdown")}
                  >
                    <Server className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Environment: {selectedEnvironment}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => handleIconClick("project", "dropdown")}
                  >
                    <Database className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Project: {selectedProject}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1"></div>

          <div className="flex flex-col items-center py-4 gap-4 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleIconClick("newMigration", "action", handleNewMigration)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">New Migration</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleIconClick("templates", "action", handleTemplates)}
                  >
                    <FileCode className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Templates</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Use the openSettingsModal function directly */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleIconClick("settings", "action", openSettingsModal)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleIconClick("help", "action", openHelpModal)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Help</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
    </div>
  )
}
