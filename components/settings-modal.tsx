"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SettingsIcon, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/hooks/use-settings"

// Import tab components
import GeneralSettings from "./settings/general-settings"
import ConsoleSettings from "./settings/console-settings"
import ExecutionSettings from "./settings/execution-settings"
import AdvancedSettings from "./settings/advanced-settings"
import ThemeSettings from "./settings/theme-settings"

export default function SettingsModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const { settings, hasUnsavedChanges, setHasUnsavedChanges, saveSettings, resetSettings } = useSettings()
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle dialog close with unsaved changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && hasUnsavedChanges) {
      setShowUnsavedWarning(true)
      return
    }
    setOpen(isOpen)
  }

  // Handle save and close
  const handleSaveAndClose = () => {
    saveSettings()
    setOpen(false)
    setShowUnsavedWarning(false)
  }

  // Handle discard changes
  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false)
    setShowUnsavedWarning(false)
    setOpen(false)
  }

  // Handle cancel unsaved warning
  const handleCancelWarning = () => {
    setShowUnsavedWarning(false)
  }

  // Tab transition variants for framer-motion
  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Main Settings Dialog */}
      {mounted && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
            <DialogHeader className="sticky top-0 z-10 bg-background pt-6 pb-4">
              <DialogTitle className="text-2xl">Settings</DialogTitle>
              <DialogDescription>
                Configure your DB Migrator preferences. Changes will be saved to your browser.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="mb-4 w-full justify-start border-b pb-0 overflow-x-auto">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
                <TabsTrigger value="execution">Execution</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tabVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="general" className="mt-0">
                      <GeneralSettings />
                    </TabsContent>

                    <TabsContent value="console" className="mt-0">
                      <ConsoleSettings />
                    </TabsContent>

                    <TabsContent value="execution" className="mt-0">
                      <ExecutionSettings />
                    </TabsContent>

                    <TabsContent value="advanced" className="mt-0">
                      <AdvancedSettings />
                    </TabsContent>

                    <TabsContent value="theme" className="mt-0">
                      <ThemeSettings />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>

            {hasUnsavedChanges && (
              <Alert className="mt-4 border-amber-500">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription>You have unsaved changes.</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="sticky bottom-0 z-10 bg-background pt-4 pb-2 mt-4">
              <Button variant="outline" onClick={() => resetSettings()}>
                Reset to Default
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAndClose} disabled={!hasUnsavedChanges}>
                Save & Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Unsaved changes warning dialog */}
      {mounted && (
        <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Unsaved Changes</DialogTitle>
              <DialogDescription>
                You have unsaved changes. Are you sure you want to close without saving?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCancelWarning}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDiscardChanges}>
                Discard Changes
              </Button>
              <Button onClick={handleSaveAndClose}>Save & Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
