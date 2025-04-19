"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Rewind, Play, Table, GitBranch, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { Migration } from "@/lib/types"
import { cn } from "@/lib/utils"

interface VersionPanelProps {
  migration: Migration
  onClose: () => void
}

export default function VersionPanel({ migration, onClose }: VersionPanelProps) {
  const [activeTab, setActiveTab] = useState("details")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MIGRATED":
        return "bg-green-500 hover:bg-green-600"
      case "PENDING":
        return "bg-amber-500 hover:bg-amber-600"
      case "FAILED":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed top-0 right-0 h-full w-96 bg-background border-l shadow-lg z-50"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Migration Details</h3>
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
              <span>Created:</span>
            </div>
            <div>{new Date(migration.timestamp).toLocaleString()}</div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <GitBranch className="h-3.5 w-3.5" />
              <span>Author:</span>
            </div>
            <div>{migration.author}</div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sql">SQL</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="flex-1 p-0 m-0">
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
          <TabsContent value="sql" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Up Migration</h4>
                  <div className="bg-muted rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono">{migration.sqlUp || "No SQL available"}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Down Migration</h4>
                  <div className="bg-muted rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono">{migration.sqlDown || "No SQL available"}</pre>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="tables" className="flex-1 p-0 m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Affected Tables</h4>
                {migration.affectedTables?.length ? (
                  <div className="grid grid-cols-1 gap-2">
                    {migration.affectedTables.map((table, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Table className="h-4 w-4 text-muted-foreground" />
                        <span>{table}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">No affected tables</div>
                )}
              </div>
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
              disabled={migration.status !== "MIGRATED"}
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
