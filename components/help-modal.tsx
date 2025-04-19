"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHelpModal } from "@/hooks/use-help-modal"
import CustomModal from "./custom-modal"
import { ExternalLink, Github, Mail } from "lucide-react"

// Import help content components
import Documentation from "./help/documentation"
import FAQ from "./help/faq"

export default function HelpModal() {
  const { isOpen, closeModal } = useHelpModal()
  const [activeTab, setActiveTab] = useState("documentation")
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const modalFooter = (
    <div className="flex justify-end">
      <Button onClick={closeModal} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Close
      </Button>
    </div>
  )

  if (!mounted) {
    return null
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Help & Documentation"
      description="Learn how to use DB Migrator and get answers to common questions."
      footer={modalFooter}
    >
      <div className="flex flex-col h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="mb-4 w-full justify-start border-b pb-0 overflow-x-auto">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="documentation" className="mt-0">
              <Documentation />
            </TabsContent>

            <TabsContent value="faq" className="mt-0">
              <FAQ />
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <p className="text-muted-foreground">
                  Have questions, feedback, or need assistance? Reach out to us through any of the following channels:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <ExternalLink className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <p className="text-sm text-muted-foreground mb-2">Visit our official website</p>
                      <a
                        href="https://yourwebsite.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        yourwebsite.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <Github className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">GitHub</h3>
                      <p className="text-sm text-muted-foreground mb-2">Check out our source code</p>
                      <a
                        href="https://github.com/yourusername/db-migrator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        github.com/yourusername/db-migrator
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground mb-2">Send us an email</p>
                      <a href="mailto:support@dbmigrator.com" className="text-primary hover:underline">
                        support@dbmigrator.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold mt-0.5">
                      X
                    </div>
                    <div>
                      <h3 className="font-medium">Twitter/X</h3>
                      <p className="text-sm text-muted-foreground mb-2">Follow us for updates</p>
                      <a
                        href="https://twitter.com/dbmigrator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @dbmigrator
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Our support team is available Monday through Friday, 9:00 AM to 5:00 PM (UTC). We typically respond
                    to inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </CustomModal>
  )
}
