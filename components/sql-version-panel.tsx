"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Rewind, Play, FileCode, GitBranch, Clock, CheckCircle, XCircle, Clock3, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Migration, SqlFile } from "@/lib/types"
import { cn } from "@/lib/utils"
import SqlFileViewer from "./sql-file-viewer"

interface SqlVersionPanelProps {
  migration: Migration
  onClose: () => void
}

export default function SqlVersionPanel({ migration, onClose }: SqlVersionPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFile, setSelectedFile] = useState<SqlFile | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MIGRATED":
        return "bg-green-500 hover:bg-green-600"
      case "PENDING":
        return "bg-amber-500 hover:bg-amber-600"
      case "FAILED":
        return "bg-red-500 hover:bg-red-600"
      case "PARTIAL":
        return "bg-orange-500 hover:bg-orange-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getFileStatusIcon = (status: string) => {
    switch (status) {
      case "RUN":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
        return <Clock3 className="h-4 w-4 text-amber-500" />
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileClick = (file: SqlFile) => {
    setSelectedFile(file)
    setActiveTab("fileViewer")
  }

  const handleBackToFiles = () => {
    setSelectedFile(null)
    setActiveTab("files")
  }

  const totalFiles = (migration.runFiles?.length || 0) + (migration.rollbackFiles?.length || 0)

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed top-0 right-0 h-full w-[600px] bg-background border-l shadow-lg z-50"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" />
            SQL Migration Details
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{migration.version}</h2>
            <Badge className={cn("text-white", getStatusColor(migration.status))}>{migration.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{migration.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Last Modified:</span>
            </div>
            <div>{new Date(migration.timestamp).toLocaleString()}</div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <GitBranch className="h-3.5 w-3.5" />
              <span>Author:</span>
            </div>
            <div>{migration.author}</div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <FileCode className="h-3.5 w-3.5" />
              <span>Files:</span>
            </div>
            <div>{totalFiles} files</div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">SQL Files</TabsTrigger>
            {selectedFile && <TabsTrigger value="fileViewer">File Viewer</TabsTrigger>}
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Migration Summary</h3>
                  <Card>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-white", getStatusColor(migration.status))}>
                            {migration.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Files</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{migration.runFiles?.length || 0}</span> run files,
                          <span className="font-medium">{migration.rollbackFiles?.length || 0}</span> rollback files
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
                        <div>{new Date(migration.timestamp).toLocaleString()}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Author</h4>
                        <div>{migration.author}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">File Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Run Files</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {migration.runFiles && migration.runFiles.length > 0 ? (
                          <ul className="space-y-2">
                            {migration.runFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between text-sm">
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                {getFileStatusIcon(file.status)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic">No run files available</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Rollback Files</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {migration.rollbackFiles && migration.rollbackFiles.length > 0 ? (
                          <ul className="space-y-2">
                            {migration.rollbackFiles.map((file, index) => (
                              <li key={index} className="flex items-center justify-between text-sm">
                                <span className="truncate max-w-[150px]">{file.name}</span>
                                {getFileStatusIcon(file.status)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic">No rollback files available</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {migration.status === "PARTIAL" && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-md p-4">
                    <h4 className="text-orange-800 dark:text-orange-400 font-medium mb-2">Partial Migration</h4>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      This migration has been partially applied. Some files may have failed or are still pending. Check
                      the SQL Files tab for details on individual file status.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="files" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Run Files</h3>
                  <Card>
                    <CardContent className="p-4">
                      {migration.runFiles && migration.runFiles.length > 0 ? (
                        <div className="divide-y">
                          {migration.runFiles.map((file, index) => (
                            <div
                              key={index}
                              className="py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 rounded-md"
                              onClick={() => handleFileClick(file)}
                            >
                              <div className="flex items-center gap-2">
                                <FileCode className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium">{file.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)} • Last modified:{" "}
                                    {new Date(file.lastModified || "").toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.gitAuthor && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.gitAuthor}
                                  </Badge>
                                )}
                                {getFileStatusIcon(file.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">No run files available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Rollback Files</h3>
                  <Card>
                    <CardContent className="p-4">
                      {migration.rollbackFiles && migration.rollbackFiles.length > 0 ? (
                        <div className="divide-y">
                          {migration.rollbackFiles.map((file, index) => (
                            <div
                              key={index}
                              className="py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 rounded-md"
                              onClick={() => handleFileClick(file)}
                            >
                              <div className="flex items-center gap-2">
                                <FileCode className="h-4 w-4 text-primary" />
                                <div>
                                  <div className="font-medium">{file.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)} • Last modified:{" "}
                                    {new Date(file.lastModified || "").toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.gitAuthor && (
                                  <Badge variant="outline" className="text-xs">
                                    {file.gitAuthor}
                                  </Badge>
                                )}
                                {getFileStatusIcon(file.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">No rollback files available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="fileViewer" className="flex-1 p-0 m-0">
            {selectedFile ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleBackToFiles}>
                      <X className="h-4 w-4 mr-1" />
                      Back to Files
                    </Button>
                    <h3 className="font-medium">{selectedFile.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download file</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SqlFileViewer file={selectedFile} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a file to view its contents</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="metadata" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full p-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="metadata">
                  <AccordionTrigger>Metadata</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {Object.entries(migration.metadata || {}).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-medium">{key}</div>
                          <div className="text-muted-foreground">{value as string}</div>
                        </div>
                      ))}
                      {(!migration.metadata || Object.keys(migration.metadata).length === 0) && (
                        <p className="text-muted-foreground italic">No metadata available</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="changelog">
                  <AccordionTrigger>Changelog</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      {migration.changelog?.map((entry, index) => (
                        <div key={index} className="pb-2 border-b last:border-0">
                          <div className="font-medium">{entry.date}</div>
                          <div className="text-muted-foreground">{entry.message}</div>
                        </div>
                      ))}
                      {(!migration.changelog || migration.changelog.length === 0) && (
                        <p className="text-muted-foreground italic">No changelog available</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dependencies">
                  <AccordionTrigger>Dependencies</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      {migration.dependencies?.length ? (
                        migration.dependencies.map((dep, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline">{dep}</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground italic">No dependencies</div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Button
              className="flex-1 flex items-center gap-2"
              variant={migration.status === "MIGRATED" ? "outline" : "default"}
              disabled={migration.status === "MIGRATED"}
            >
              <Play className="h-4 w-4" />
              {migration.status === "MIGRATED" ? "Already Migrated" : "Run Migration"}
            </Button>
            <Button
              className="flex-1 flex items-center gap-2"
              variant="outline"
              disabled={migration.status !== "MIGRATED" && migration.status !== "PARTIAL"}
            >
              <Rewind className="h-4 w-4" />
              Rollback
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
