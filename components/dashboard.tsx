"use client"

import { useState, useEffect } from "react"
import { ModeToggle } from "./mode-toggle"
import { MigrationModeToggle } from "./mode-toggle-migration"
import Sidebar from "./sidebar"
import MigrationTimeline from "./migration-timeline"
import ConsolePanel from "./console-panel"
import VersionPanel from "./version-panel"
import SqlVersionPanel from "./sql-version-panel"
import NewSettingsModal from "./new-settings-modal"
import HelpModal from "./help-modal"
import SettingsButton from "./settings-button"
import type { Migration } from "@/lib/types"
import { useMigrations } from "@/hooks/use-migrations"
import { SettingsModalProvider } from "@/hooks/use-settings-modal"
import { HelpModalProvider } from "@/hooks/use-help-modal"
import { MigrationModeProvider, useMigrationMode } from "@/hooks/use-migration-mode"
import { useSettings } from "@/hooks/use-settings"

function DashboardContent() {
  const { migrations, loading, error } = useMigrations()
  const { settings } = useSettings()
  const { mode } = useMigrationMode()
  const [selectedVersion, setSelectedVersion] = useState<Migration | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedEnvironment, setSelectedEnvironment] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize environment and project from settings
  useEffect(() => {
    if (mounted) {
      setSelectedEnvironment(settings.general.defaultEnvironment)
      setSelectedProject(settings.general.defaultProject)

      // Auto-select latest migration if enabled
      if (settings.general.autoSelectLatestMigration && migrations.length > 0) {
        // Find the most recent migration by timestamp
        const latestMigration = [...migrations].sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })[0]

        setSelectedVersion(latestMigration)
        setIsPanelOpen(true)
      }
    }
  }, [mounted, settings.general, migrations])

  const handleVersionClick = (migration: Migration) => {
    setSelectedVersion(migration)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  // Filter migrations based on current mode
  const filteredMigrations = migrations.filter((migration) =>
    mode === "JAVA" ? migration.type !== "SQL" : migration.type === "SQL",
  )

  // Don't render anything until client-side
  if (!mounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">DB Migrator</h1>
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
              {selectedEnvironment}
            </div>
            <div className="px-2 py-1 text-xs font-medium rounded-full bg-secondary border border-secondary/30 text-secondary-foreground">
              {selectedProject}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MigrationModeToggle />
            <SettingsButton />
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto min-h-0">
            <div className="p-6">
              <MigrationTimeline
                migrations={filteredMigrations}
                onVersionClick={handleVersionClick}
                loading={loading}
                error={error}
                mode={mode}
              />
            </div>
          </div>
          <ConsolePanel />
        </main>
        {isPanelOpen &&
          selectedVersion &&
          (mode === "JAVA" ? (
            <VersionPanel migration={selectedVersion} onClose={handleClosePanel} />
          ) : (
            <SqlVersionPanel migration={selectedVersion} onClose={handleClosePanel} />
          ))}
      </div>
      <NewSettingsModal />
      <HelpModal />
    </div>
  )
}

export default function Dashboard() {
  return (
    <SettingsModalProvider>
      <HelpModalProvider>
        <MigrationModeProvider>
          <DashboardContent />
        </MigrationModeProvider>
      </HelpModalProvider>
    </SettingsModalProvider>
  )
}
