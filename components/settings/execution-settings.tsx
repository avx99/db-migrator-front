"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettings } from "@/hooks/use-settings"

export default function ExecutionSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="askConfirmation">Ask confirmation before execution</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show a confirmation dialog before executing migrations or rollbacks.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="askConfirmation"
            checked={settings.execution.askConfirmationBeforeExecution}
            onCheckedChange={(checked) => updateSettings({ execution: { askConfirmationBeforeExecution: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, a confirmation dialog will be shown before executing migrations or rollbacks.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="enableDryRun">Enable dry-run by default</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Run migrations in dry-run mode by default, which simulates the execution without making changes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="enableDryRun"
            checked={settings.execution.enableDryRunByDefault}
            onCheckedChange={(checked) => updateSettings({ execution: { enableDryRunByDefault: checked } })}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          When enabled, migrations will be executed in dry-run mode by default.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="defaultAction">Default action on selecting a version</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The default action to perform when selecting a migration version.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={settings.execution.defaultActionOnSelectingVersion}
            onValueChange={(value: "showDetails" | "migrate" | "rollback") =>
              updateSettings({ execution: { defaultActionOnSelectingVersion: value } })
            }
          >
            <SelectTrigger id="defaultAction" className="w-[180px]">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="showDetails">Show Details</SelectItem>
              <SelectItem value="migrate">Migrate</SelectItem>
              <SelectItem value="rollback">Rollback</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Select the default action to perform when clicking on a migration version.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="operationTimeout">Operation timeout (seconds)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maximum time in seconds to wait for a migration operation to complete.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="operationTimeout"
            type="number"
            min={5}
            max={300}
            value={settings.execution.operationTimeout}
            onChange={(e) => updateSettings({ execution: { operationTimeout: Number.parseInt(e.target.value) || 30 } })}
            className="w-[100px]"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Set the maximum time in seconds to wait for a migration operation to complete before timing out.
        </p>
      </div>
    </div>
  )
}
