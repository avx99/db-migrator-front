"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettings } from "@/hooks/use-settings"

export default function ConsoleSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="autoScrollLogs">Auto-scroll logs</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically scroll to the latest log entry when new logs are added.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="autoScrollLogs"
            checked={settings.console.autoScrollLogs}
            onCheckedChange={(checked) => updateSettings({ console: { autoScrollLogs: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the console will automatically scroll to show the latest logs.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="showTimestamps">Show timestamps</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Display timestamps for each log entry.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="showTimestamps"
            checked={settings.console.showTimestamps}
            onCheckedChange={(checked) => updateSettings({ console: { showTimestamps: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">When enabled, timestamps will be displayed for each log entry.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Log level colors</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Customize the colors used for different log levels.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Customize the colors used for different log levels in the console.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="infoColor" className="flex items-center gap-2">
              INFO
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: settings.console.logLevelColors.info }}
              ></div>
            </Label>
            <Input
              id="infoColor"
              type="color"
              value={settings.console.logLevelColors.info}
              onChange={(e) =>
                updateSettings({
                  console: { logLevelColors: { ...settings.console.logLevelColors, info: e.target.value } },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warnColor" className="flex items-center gap-2">
              WARN
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: settings.console.logLevelColors.warn }}
              ></div>
            </Label>
            <Input
              id="warnColor"
              type="color"
              value={settings.console.logLevelColors.warn}
              onChange={(e) =>
                updateSettings({
                  console: { logLevelColors: { ...settings.console.logLevelColors, warn: e.target.value } },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorColor" className="flex items-center gap-2">
              ERROR
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: settings.console.logLevelColors.error }}
              ></div>
            </Label>
            <Input
              id="errorColor"
              type="color"
              value={settings.console.logLevelColors.error}
              onChange={(e) =>
                updateSettings({
                  console: { logLevelColors: { ...settings.console.logLevelColors, error: e.target.value } },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="maxLogLines">Max log lines before trimming</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maximum number of log lines to keep in memory. Older logs will be removed.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              id="maxLogLines"
              min={100}
              max={5000}
              step={100}
              value={[settings.console.maxLogLines]}
              onValueChange={(value) => updateSettings({ console: { maxLogLines: value[0] } })}
              className="w-[180px]"
            />
            <span className="w-16 text-right">{settings.console.maxLogLines}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Set the maximum number of log lines to keep in memory before trimming older entries.
        </p>
      </div>
    </div>
  )
}
