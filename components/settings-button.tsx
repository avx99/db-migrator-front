"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSettingsModal } from "@/hooks/use-settings-modal"

interface SettingsButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export default function SettingsButton({
  variant = "outline",
  size = "icon",
  showText = false,
  className,
}: SettingsButtonProps) {
  const { openModal } = useSettingsModal()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} onClick={openModal} className={className}>
            <Settings className="h-4 w-4" />
            {showText && <span className="ml-2">Settings</span>}
            {!showText && <span className="sr-only">Settings</span>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
