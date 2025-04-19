"use client"

import { useState, useRef } from "react"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  FileCode,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import type { Migration, MigrationStatus, MigrationType } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MigrationTimelineProps {
  migrations: Migration[]
  onVersionClick: (migration: Migration) => void
  loading: boolean
  error: string | null
  mode: MigrationType
}

export default function MigrationTimeline({
  migrations,
  onVersionClick,
  loading,
  error,
  mode,
}: MigrationTimelineProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const timelineRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5))
  }

  const toggleOrientation = () => {
    setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")
  }

  const getStatusIcon = (status: MigrationStatus) => {
    switch (status) {
      case "MIGRATED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "PENDING":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "PARTIAL":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: MigrationStatus) => {
    switch (status) {
      case "MIGRATED":
        return "bg-green-500"
      case "PENDING":
        return "bg-amber-500"
      case "FAILED":
        return "bg-red-500"
      case "PARTIAL":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-4 bg-background py-2">
          <h2 className="text-xl font-semibold">Migration Timeline</h2>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
        <div className="flex gap-6 overflow-auto pb-6">
          <Skeleton className="h-32 w-64 rounded-lg" />
          <Skeleton className="h-32 w-64 rounded-lg" />
          <Skeleton className="h-32 w-64 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-medium">Failed to load migrations</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 flex justify-between items-center mb-4 bg-background py-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {mode === "JAVA" ? (
            <>
              <Database className="h-5 w-5 text-primary" />
              <span>Java Class Migrations</span>
            </>
          ) : (
            <>
              <FileCode className="h-5 w-5 text-primary" />
              <span>SQL File Migrations</span>
            </>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom in</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleOrientation}>
                  {orientation === "horizontal" ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {orientation === "horizontal" ? "Switch to vertical layout" : "Switch to horizontal layout"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="relative overflow-auto">
        <div className={orientation === "horizontal" ? "pb-12" : "pb-6"}>
          <div
            ref={timelineRef}
            className={
              orientation === "vertical" ? "flex flex-col items-center gap-16" : "flex flex-row items-start gap-16"
            }
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top left",
              width: orientation === "horizontal" ? `${migrations.length * 300}px` : "auto",
              minHeight: orientation === "vertical" ? `${migrations.length * 150}px` : "auto",
            }}
          >
            {migrations.map((migration, index) => (
              <div key={migration.id} className={orientation === "horizontal" ? "relative flex-shrink-0" : "relative"}>
                {index > 0 && (
                  <div
                    className={`absolute z-0 ${
                      orientation === "horizontal"
                        ? "top-1/2 -left-16 w-16 h-1"
                        : "-top-16 left-1/2 -translate-x-1/2 h-16 w-1"
                    } ${getStatusColor(migration.status)}`}
                  />
                )}
                <div className="relative z-10">
                  <Card
                    className={`w-64 cursor-pointer hover:shadow-md transition-shadow ${
                      migration.status === "FAILED"
                        ? "border-red-500"
                        : migration.status === "PENDING"
                          ? "border-amber-500"
                          : migration.status === "MIGRATED"
                            ? "border-green-500"
                            : migration.status === "PARTIAL"
                              ? "border-orange-500"
                              : ""
                    }`}
                    onClick={() => onVersionClick(migration)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{migration.version}</div>
                        {getStatusIcon(migration.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{migration.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{new Date(migration.timestamp).toLocaleDateString()}</span>
                        <span>{migration.author}</span>
                      </div>
                      {mode === "SQL" && migration.status === "PARTIAL" && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-300">
                            Partially Migrated
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
