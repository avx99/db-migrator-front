"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "@/hooks/use-settings"
import { useSettingsModal } from "@/hooks/use-settings-modal"
import CustomModal from "./custom-modal"

// Import tab components
import GeneralSettings from "./settings/general-settings"
import ConsoleSettings from "./settings/console-settings"
import ExecutionSettings from "./settings/execution-settings"
import AdvancedSettings from "./settings/advanced-settings"
import ThemeSettings from "./settings/theme-settings"

export default function NewSettingsModal() {
  const { isOpen, openModal, closeModal } = useSettingsModal()
  const [activeTab, setActiveTab] = useState("general")
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const { settings, hasUnsavedChanges, setHasUnsavedChanges, saveSettings, resetSettings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update local settings when the actual settings change
  useEffect(() => {
    if (mounted) {
      setLocalSettings(settings)
    }
  }, [settings, mounted])

  const handleCloseModal = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true)
    } else {
      closeModal()
    }
  }

  const handleSaveAndClose = () => {
    saveSettings()
    closeModal()
    setShowUnsavedWarning(false)
  }

  const handleDiscardChanges = () => {
    setHasUnsavedChanges(false)
    setShowUnsavedWarning(false)
    closeModal()
  }

  const handleCancelWarning = () => {
    setShowUnsavedWarning(false)
  }

  const modalFooter = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => resetSettings()}>
        Reset to Default
      </Button>
      <Button variant="outline" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSaveAndClose}
        disabled={!hasUnsavedChanges}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Save & Close
      </Button>
    </div>
  )

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Main Settings Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Settings"
        description="Configure your DB Migrator preferences. Changes will be saved to your browser."
        footer={modalFooter}
      >
        <div className="flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="mb-4 w-full justify-start border-b pb-0 overflow-x-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="execution">Execution</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
            </TabsList>

            <div className="mt-4">
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
            </div>
          </Tabs>

          {hasUnsavedChanges && (
            <Alert className="mt-4 border-amber-500">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription>You have unsaved changes.</AlertDescription>
            </Alert>
          )}
        </div>
      </CustomModal>

      {/* Unsaved changes warning modal */}
      <CustomModal
        isOpen={showUnsavedWarning}
        onClose={handleCancelWarning}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to close without saving?"
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancelWarning}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDiscardChanges}>
              Discard Changes
            </Button>
            <Button onClick={handleSaveAndClose} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save & Close
            </Button>
          </div>
        }
      >
        <p>Your changes will be lost if you don't save them.</p>
      </CustomModal>
    </>
  )
}
