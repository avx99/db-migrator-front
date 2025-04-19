"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettings } from "@/hooks/use-settings"

export default function AdvancedSettings() {
  const { settings, updateSettings, resetSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="enableMockData">Enable mock data</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Use mock data instead of connecting to a real backend (for development purposes).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="enableMockData"
            checked={settings.advanced.enableMockData}
            onCheckedChange={(checked) => updateSettings({ advanced: { enableMockData: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the application will use mock data instead of connecting to a real backend.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="baseApiUrl">Base API URL</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The base URL for the backend API.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="baseApiUrl"
          value={settings.advanced.baseApiUrl}
          onChange={(e) => updateSettings({ advanced: { baseApiUrl: e.target.value } })}
          placeholder="http://localhost:8080/api"
        />
        <p className="text-sm text-muted-foreground">
          Enter the base URL for the backend API. This is used when mock data is disabled.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="authToken">Auth Token</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Authentication token for API requests.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="authToken"
          type="password"
          value={settings.advanced.authToken}
          onChange={(e) => updateSettings({ advanced: { authToken: e.target.value } })}
          placeholder="Enter your auth token"
        />
        <p className="text-sm text-muted-foreground">
          Enter the authentication token to use for API requests. Leave empty if not required.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="verboseLogs">Verbose logs</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enable detailed logging for debugging purposes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="verboseLogs"
            checked={settings.advanced.verboseLogs}
            onCheckedChange={(checked) => updateSettings({ advanced: { verboseLogs: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, additional debug information will be logged to the console.
        </p>
      </div>

      <div className="pt-4 border-t">
        <Button variant="destructive" onClick={resetSettings}>
          Reset All Settings to Default
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will reset all settings to their default values. This action cannot be undone.
        </p>
      </div>
    </div>
  )
}
