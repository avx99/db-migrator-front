"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { useRef } from "react"
import { useSettings } from "@/hooks/use-settings"

export default function ThemeSettings() {
  const { settings, updateSettings } = useSettings()
  const { theme, resolvedTheme } = useTheme()
  const initialRenderRef = useRef(true)
  const lastThemeChangeRef = useRef<{ useSystemTheme?: boolean; theme?: string }>({})

  // Only update theme settings in the context, don't apply them directly
  const handleThemeChange = (value: "light" | "dark" | "system") => {
    lastThemeChangeRef.current.theme = value
    updateSettings({ theme: { theme: value } })
  }

  const handleSystemThemeChange = (checked: boolean) => {
    lastThemeChangeRef.current.useSystemTheme = checked
    updateSettings({ theme: { useSystemTheme: checked } })
  }

  // Get the current theme for display
  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="useSystemTheme">Use system theme</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Use the system's theme preference (light or dark).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="useSystemTheme"
            checked={settings.theme.useSystemTheme}
            onCheckedChange={handleSystemThemeChange}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, the application will use your system's theme preference.
        </p>
      </div>

      {!settings.theme.useSystemTheme && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Theme</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the application theme.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup value={settings.theme.theme} onValueChange={handleThemeChange} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">Select the theme to use for the application.</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="primaryColor">Primary color</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Customize the primary color used throughout the application.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <Input
            id="primaryColor"
            type="color"
            value={settings.theme.primaryColor}
            onChange={(e) => updateSettings({ theme: { primaryColor: e.target.value } })}
            className="w-[100px] h-[40px]"
            defaultValue="#3b82f6" // Default to blue-500
          />
          <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: settings.theme.primaryColor }}></div>
        </div>
        <p className="text-sm text-muted-foreground">Select the primary color to use throughout the application.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Font size</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust the font size used throughout the application.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup
          value={settings.theme.fontSize}
          onValueChange={(value: "small" | "medium" | "large") => updateSettings({ theme: { fontSize: value } })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small" className="text-sm">
              Small
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-base">
              Medium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="large" />
            <Label htmlFor="large" className="text-lg">
              Large
            </Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-muted-foreground">Select the font size to use throughout the application.</p>
      </div>
    </div>
  )
}
