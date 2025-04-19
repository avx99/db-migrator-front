"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"

// Define the settings interface
export interface Settings {
  general: {
    defaultEnvironment: "DEV" | "QA" | "STAGING" | "PROD"
    defaultProject: string
    autoSelectLatestMigration: boolean
    autoOpenConsole: boolean
  }
  console: {
    autoScrollLogs: boolean
    showTimestamps: boolean
    logLevelColors: {
      info: string
      warn: string
      error: string
    }
    maxLogLines: number
  }
  execution: {
    askConfirmationBeforeExecution: boolean
    enableDryRunByDefault: boolean
    defaultActionOnSelectingVersion: "showDetails" | "migrate" | "rollback"
    operationTimeout: number
  }
  advanced: {
    enableMockData: boolean
    baseApiUrl: string
    authToken: string
    verboseLogs: boolean
  }
  theme: {
    useSystemTheme: boolean
    theme: "light" | "dark" | "system"
    primaryColor: string
    fontSize: "small" | "medium" | "large"
  }
}

// Default settings
export const defaultSettings: Settings = {
  general: {
    defaultEnvironment: "DEV",
    defaultProject: "main-database",
    autoSelectLatestMigration: true,
    autoOpenConsole: false,
  },
  console: {
    autoScrollLogs: true,
    showTimestamps: true,
    logLevelColors: {
      info: "#3b82f6", // blue-500
      warn: "#f59e0b", // amber-500
      error: "#ef4444", // red-500
    },
    maxLogLines: 1000,
  },
  execution: {
    askConfirmationBeforeExecution: true,
    enableDryRunByDefault: false,
    defaultActionOnSelectingVersion: "showDetails",
    operationTimeout: 30,
  },
  advanced: {
    enableMockData: true,
    baseApiUrl: "http://localhost:8080/api",
    authToken: "",
    verboseLogs: false,
  },
  theme: {
    useSystemTheme: true,
    theme: "system",
    primaryColor: "#3b82f6", // Changed to blue-500 hex value
    fontSize: "medium",
  },
}

// Create context
type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
  saveSettings: () => void
  applySettings: (settingsToApply: Settings, options?: { skipTheme?: boolean }) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const initialThemeAppliedRef = useRef(false)
  const currentThemeRef = useRef<string | null>(null)

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Store the current theme for reference
  useEffect(() => {
    if (theme) {
      currentThemeRef.current = theme
    }
  }, [theme])

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isMounted) {
      const storedSettings = localStorage.getItem("dbMigratorSettings")
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings)
          setSettings(parsedSettings)

          // Apply settings but skip theme on initial load to prevent overriding user's current theme
          applySettings(parsedSettings, { skipTheme: !initialThemeAppliedRef.current })

          // Mark that we've applied the theme once
          if (!initialThemeAppliedRef.current) {
            initialThemeAppliedRef.current = true
          }
        } catch (error) {
          console.error("Failed to parse stored settings:", error)
          // If parsing fails, apply default settings but skip theme
          applySettings(defaultSettings, { skipTheme: true })
        }
      } else {
        // If no stored settings, apply default settings but skip theme
        applySettings(defaultSettings, { skipTheme: true })
      }
      setIsLoaded(true)
    }
  }, [isMounted])

  // Apply settings function with more granular control
  const applySettings = (settingsToApply: Settings, options: { skipTheme?: boolean } = { skipTheme: false }) => {
    if (!isMounted) return

    // Apply theme settings only if not skipped and if theme settings have changed
    if (!options.skipTheme) {
      if (settingsToApply.theme.useSystemTheme) {
        setTheme("system")
      } else {
        setTheme(settingsToApply.theme.theme)
      }
    }

    // Apply primary color - ensure it's applied correctly
    const primaryHSL = convertHexToHSL(settingsToApply.theme.primaryColor)
    document.documentElement.style.setProperty("--primary", primaryHSL)

    // Also update the CSS variable directly to ensure it takes effect
    const primaryRGB = hexToRGB(settingsToApply.theme.primaryColor)
    document.documentElement.style.setProperty("--primary-rgb", primaryRGB)

    // Apply font size
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg")
    switch (settingsToApply.theme.fontSize) {
      case "small":
        document.documentElement.classList.add("text-sm")
        break
      case "medium":
        document.documentElement.classList.add("text-base")
        break
      case "large":
        document.documentElement.classList.add("text-lg")
        break
    }

    // Apply log colors
    document.documentElement.style.setProperty("--log-info-color", settingsToApply.console.logLevelColors.info)
    document.documentElement.style.setProperty("--log-warn-color", settingsToApply.console.logLevelColors.warn)
    document.documentElement.style.setProperty("--log-error-color", settingsToApply.console.logLevelColors.error)
  }

  // Helper function to convert hex color to HSL
  const convertHexToHSL = (hex: string): string => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255

    // Find the min and max values to compute the lightness
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    // Calculate the lightness
    let l = (max + min) / 2

    // Calculate the saturation
    let s = 0
    if (max !== min) {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
    }

    // Calculate the hue
    let h = 0
    if (max !== min) {
      if (max === r) {
        h = (g - b) / (max - min) + (g < b ? 6 : 0)
      } else if (max === g) {
        h = (b - r) / (max - min) + 2
      } else {
        h = (r - g) / (max - min) + 4
      }
      h /= 6
    }

    // Convert to degrees and format
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return `${h} ${s}% ${l}%`
  }

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string): string => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    return `${r}, ${g}, ${b}`
  }

  // Update settings with more selective application
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      // Deep merge the new settings with the previous settings
      const updated = { ...prev }

      // Track if theme mode (light/dark/system) is being changed
      let isThemeModeChanged = false

      // Update each category if provided
      if (newSettings.general) {
        updated.general = { ...prev.general, ...newSettings.general }
      }
      if (newSettings.console) {
        updated.console = { ...prev.console, ...newSettings.console }
      }
      if (newSettings.execution) {
        updated.execution = { ...prev.execution, ...newSettings.execution }
      }
      if (newSettings.advanced) {
        updated.advanced = { ...prev.advanced, ...newSettings.advanced }
      }
      if (newSettings.theme) {
        // Check if theme mode is being changed
        if (
          (newSettings.theme.useSystemTheme !== undefined &&
            newSettings.theme.useSystemTheme !== prev.theme.useSystemTheme) ||
          (newSettings.theme.theme !== undefined && newSettings.theme.theme !== prev.theme.theme)
        ) {
          isThemeModeChanged = true
        }

        updated.theme = { ...prev.theme, ...newSettings.theme }
      }

      // Apply settings selectively
      if (newSettings.theme) {
        // Apply theme-related settings

        // If primary color changed, apply it
        if (newSettings.theme.primaryColor) {
          const primaryHSL = convertHexToHSL(updated.theme.primaryColor)
          document.documentElement.style.setProperty("--primary", primaryHSL)

          const primaryRGB = hexToRGB(updated.theme.primaryColor)
          document.documentElement.style.setProperty("--primary-rgb", primaryRGB)
        }

        // If font size changed, apply it
        if (newSettings.theme.fontSize) {
          document.documentElement.classList.remove("text-sm", "text-base", "text-lg")
          switch (updated.theme.fontSize) {
            case "small":
              document.documentElement.classList.add("text-sm")
              break
            case "medium":
              document.documentElement.classList.add("text-base")
              break
            case "large":
              document.documentElement.classList.add("text-lg")
              break
          }
        }

        // Only apply theme mode changes if they were explicitly changed
        if (isThemeModeChanged) {
          if (updated.theme.useSystemTheme) {
            setTheme("system")
          } else {
            setTheme(updated.theme.theme)
          }
        }
      }

      // Apply console-related settings
      if (newSettings.console && newSettings.console.logLevelColors) {
        if (newSettings.console.logLevelColors.info) {
          document.documentElement.style.setProperty("--log-info-color", updated.console.logLevelColors.info)
        }
        if (newSettings.console.logLevelColors.warn) {
          document.documentElement.style.setProperty("--log-warn-color", updated.console.logLevelColors.warn)
        }
        if (newSettings.console.logLevelColors.error) {
          document.documentElement.style.setProperty("--log-error-color", updated.console.logLevelColors.error)
        }
      }

      setHasUnsavedChanges(true)
      return updated
    })
  }

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings)
    applySettings(defaultSettings)
    setHasUnsavedChanges(true)
  }

  // Save settings to localStorage
  const saveSettings = () => {
    if (isMounted) {
      localStorage.setItem("dbMigratorSettings", JSON.stringify(settings))
      setHasUnsavedChanges(false)

      // Apply all settings when saved, but be careful with theme
      applySettings(settings)
    }
  }

  // Provide default context value during SSR
  if (!isMounted) {
    return React.createElement(
      SettingsContext.Provider,
      {
        value: {
          settings: defaultSettings,
          updateSettings: () => {},
          resetSettings: () => {},
          hasUnsavedChanges: false,
          setHasUnsavedChanges: () => {},
          saveSettings: () => {},
          applySettings: () => {},
        },
      },
      children
    )
  }

  return React.createElement(
    SettingsContext.Provider,
    {
      value: {
        settings,
        updateSettings,
        resetSettings,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveSettings,
        applySettings,
      },
    },
    children
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
