"use client"

import { useState, useCallback } from "react"
import type { ConsoleLog } from "@/lib/types"

export function useConsole() {
  const [logs, setLogs] = useState<ConsoleLog[]>([
    {
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "DB Migrator initialized successfully",
    },
    {
      timestamp: new Date(Date.now() - 5000).toISOString(),
      level: "INFO",
      message: "Connected to database: main-database",
    },
  ])

  const addLog = useCallback((level: "INFO" | "WARN" | "ERROR", message: string) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        timestamp: new Date().toISOString(),
        level,
        message,
      },
    ])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const runMigration = useCallback(() => {
    addLog("INFO", "Starting migration process...")

    // Simulate migration process
    setTimeout(() => {
      addLog("INFO", "Validating migration scripts...")
    }, 500)

    setTimeout(() => {
      addLog("INFO", "Applying migration v2.0.0...")
    }, 1000)

    setTimeout(() => {
      addLog("INFO", "Created table user_preferences")
    }, 1500)

    setTimeout(() => {
      addLog("INFO", "Created table settings")
    }, 2000)

    setTimeout(() => {
      addLog("INFO", "Migration completed successfully")
    }, 2500)
  }, [addLog])

  const rollback = useCallback(() => {
    addLog("INFO", "Starting rollback process...")

    // Simulate rollback process
    setTimeout(() => {
      addLog("INFO", "Validating rollback scripts...")
    }, 500)

    setTimeout(() => {
      addLog("INFO", "Rolling back migration v1.3.0...")
    }, 1000)

    setTimeout(() => {
      addLog("INFO", "Dropped table order_items")
    }, 1500)

    setTimeout(() => {
      addLog("INFO", "Rollback completed successfully")
    }, 2000)
  }, [addLog])

  const dryRun = useCallback(() => {
    addLog("INFO", "Starting dry run for pending migrations...")

    // Simulate dry run process
    setTimeout(() => {
      addLog("INFO", "Validating migration scripts...")
    }, 500)

    setTimeout(() => {
      addLog("INFO", "Simulating migration v2.0.0...")
    }, 1000)

    setTimeout(() => {
      addLog("INFO", "Would create table user_preferences")
    }, 1500)

    setTimeout(() => {
      addLog("INFO", "Would create table settings")
    }, 2000)

    setTimeout(() => {
      addLog("WARN", "Foreign key constraint would reference users table")
    }, 2500)

    setTimeout(() => {
      addLog("INFO", "Dry run completed successfully")
    }, 3000)
  }, [addLog])

  const showSql = useCallback(() => {
    addLog("INFO", "Generating SQL for pending migrations...")

    // Simulate SQL generation
    setTimeout(() => {
      addLog("INFO", "SQL for migration v2.0.0:")
    }, 500)

    setTimeout(() => {
      addLog("INFO", "CREATE TABLE user_preferences (")
      addLog("INFO", "  user_id INTEGER PRIMARY KEY REFERENCES users(id),")
      addLog("INFO", "  theme VARCHAR(20) DEFAULT 'light',")
      addLog("INFO", "  notifications_enabled BOOLEAN DEFAULT TRUE")
      addLog("INFO", ");")
    }, 1000)

    setTimeout(() => {
      addLog("INFO", "CREATE TABLE settings (")
      addLog("INFO", "  key VARCHAR(50) PRIMARY KEY,")
      addLog("INFO", "  value TEXT NOT NULL,")
      addLog("INFO", "  description TEXT")
      addLog("INFO", ");")
    }, 2000)
  }, [addLog])

  return {
    logs,
    addLog,
    clearLogs,
    runMigration,
    rollback,
    dryRun,
    showSql,
  }
}
