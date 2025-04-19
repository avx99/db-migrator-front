export type MigrationStatus = "MIGRATED" | "PENDING" | "FAILED" | "PARTIAL"
export type MigrationType = "JAVA" | "SQL"
export type SqlFileStatus = "RUN" | "PENDING" | "FAILED"

export interface Migration {
  id: string
  version: string
  description: string
  author: string
  timestamp: string
  status: MigrationStatus
  type: MigrationType
  sqlUp?: string
  sqlDown?: string
  affectedTables?: string[]
  changelog?: Array<{ date: string; message: string }>
  dependencies?: string[]
  metadata?: Record<string, unknown>
  // SQL-specific fields
  runFiles?: SqlFile[]
  rollbackFiles?: SqlFile[]
  fileCount?: number
}

export interface SqlFile {
  name: string
  fullPath: string
  status: SqlFileStatus
  executedAt?: string
  hash: string
  size: number
  gitAuthor?: string
  lastModified?: string
  content?: string
}

export interface ConsoleLog {
  timestamp: string
  level: "INFO" | "WARN" | "ERROR"
  message: string
}
