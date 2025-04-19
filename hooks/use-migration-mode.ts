"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { MigrationType } from "@/lib/types"

interface MigrationModeContextType {
  mode: MigrationType
  setMode: (mode: MigrationType) => void
}

const MigrationModeContext = createContext<MigrationModeContextType | undefined>(undefined)

export function MigrationModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<MigrationType>("JAVA")

  // Load saved mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("dbMigratorMode")
    if (savedMode && (savedMode === "JAVA" || savedMode === "SQL")) {
      setMode(savedMode as MigrationType)
    }
  }, [])

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dbMigratorMode", mode)
  }, [mode])

  return React.createElement(
    MigrationModeContext.Provider,
    { value: { mode, setMode } },
    children
  )
}

export function useMigrationMode() {
  const context = useContext(MigrationModeContext)
  if (context === undefined) {
    throw new Error("useMigrationMode must be used within a MigrationModeProvider")
  }
  return context
}
