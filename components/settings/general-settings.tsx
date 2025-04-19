"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettings } from "@/hooks/use-settings"

export default function GeneralSettings() {
  const { settings, updateSettings } = useSettings()
  const projects = ["main-database", "auth-service", "user-service", "payment-service"] // Mock data

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="defaultEnvironment">Default Environment</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The environment that will be selected when the application starts.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={settings.general.defaultEnvironment}
            onValueChange={(value: "DEV" | "QA" | "STAGING" | "PROD") =>
              updateSettings({ general: { defaultEnvironment: value } })
            }
          >
            <SelectTrigger id="defaultEnvironment" className="w-[180px]">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEV">DEV</SelectItem>
              <SelectItem value="QA">QA</SelectItem>
              <SelectItem value="STAGING">STAGING</SelectItem>
              <SelectItem value="PROD">PROD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">Select which environment should be active by default.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="defaultProject">Default Project</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The project that will be selected when the application starts.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={settings.general.defaultProject}
            onValueChange={(value) => updateSettings({ general: { defaultProject: value } })}
          >
            <SelectTrigger id="defaultProject" className="w-[180px]">
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
        <p className="text-sm text-muted-foreground">Select which project should be active by default.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="autoSelectLatestMigration">Auto-select latest migration</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically select the most recent migration when the application starts.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="autoSelectLatestMigration"
            checked={settings.general.autoSelectLatestMigration}
            onCheckedChange={(checked) => updateSettings({ general: { autoSelectLatestMigration: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the most recent migration will be automatically selected on startup.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="autoOpenConsole">Auto-open console on startup</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically expand the console panel when the application starts.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="autoOpenConsole"
            checked={settings.general.autoOpenConsole}
            onCheckedChange={(checked) => updateSettings({ general: { autoOpenConsole: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the console panel will be expanded when the application starts.
        </p>
      </div>
    </div>
  )
}
