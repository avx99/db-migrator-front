"use client"

import React, { createContext, useContext, useState } from "react"

interface HelpModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const HelpModalContext = createContext<HelpModalContextType | undefined>(undefined)

export function HelpModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return React.createElement(
    HelpModalContext.Provider,
    { value: { isOpen, openModal, closeModal } },
    children
  )
}

export function useHelpModal() {
  const context = useContext(HelpModalContext)
  if (context === undefined) {
    throw new Error("useHelpModal must be used within a HelpModalProvider")
  }
  return context
}
