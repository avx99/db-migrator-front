"use client"

import React, { createContext, useContext, useState } from "react"

interface SettingsModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const SettingsModalContext = createContext<SettingsModalContextType | undefined>(undefined)

export function SettingsModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return React.createElement(
    SettingsModalContext.Provider,
    { value: { isOpen, openModal, closeModal } },
    children
  )
}

export function useSettingsModal() {
  const context = useContext(SettingsModalContext)
  if (context === undefined) {
    throw new Error("useSettingsModal must be used within a SettingsModalProvider")
  }
  return context
}
