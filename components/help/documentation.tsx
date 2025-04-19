"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Documentation() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Welcome to DB Migrator</h2>
        <p className="text-muted-foreground">
          DB Migrator is a powerful tool designed to help you manage database migrations across different environments.
          This documentation will guide you through the main features and how to use them effectively.
        </p>
      </section>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Always make a backup of your database before running migrations in production environments.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="getting-started">
          <AccordionTrigger>Getting Started</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>
                DB Migrator provides a visual interface for managing database migrations. Here&apos;s how to get
                started:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Select an environment</strong> - Choose the environment (DEV, QA, STAGING, PROD) from the
                  sidebar.
                </li>
                <li>
                  <strong>Select a project</strong> - Choose the database project you want to work with.
                </li>
                <li>
                  <strong>View migrations</strong> - The migration timeline shows all migrations for the selected
                  project.
                </li>
                <li>
                  <strong>Run migrations</strong> - Click on a migration to view details and run it if needed.
                </li>
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="migration-timeline">
          <AccordionTrigger>Migration Timeline</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>The migration timeline displays all migrations in chronological order. Each migration card shows:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Version</strong> - The version number of the migration.
                </li>
                <li>
                  <strong>Status</strong> - Current status (MIGRATED, PENDING, FAILED).
                </li>
                <li>
                  <strong>Description</strong> - A brief description of what the migration does.
                </li>
                <li>
                  <strong>Author</strong> - Who created the migration.
                </li>
                <li>
                  <strong>Date</strong> - When the migration was created.
                </li>
              </ul>
              <p>
                You can zoom in/out and switch between horizontal and vertical layouts using the controls above the
                timeline.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="version-panel">
          <AccordionTrigger>Version Panel</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>When you click on a migration in the timeline, the version panel opens with detailed information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Details</strong> - Metadata, changelog, and dependencies.
                </li>
                <li>
                  <strong>SQL</strong> - The SQL statements for up and down migrations.
                </li>
                <li>
                  <strong>Tables</strong> - The database tables affected by this migration.
                </li>
              </ul>
              <p>From this panel, you can run the migration or roll it back using the buttons at the bottom.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="console-panel">
          <AccordionTrigger>Console Panel</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>The console panel at the bottom of the screen shows logs and provides actions:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Console tab</strong> - Shows logs from migration operations.
                </li>
                <li>
                  <strong>Actions tab</strong> - Provides buttons for common actions:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Run Migration - Executes the selected migration.</li>
                    <li>Rollback - Reverts the selected migration.</li>
                    <li>Dry Run - Simulates the migration without making changes.</li>
                    <li>Show SQL - Displays the SQL that would be executed.</li>
                  </ul>
                </li>
              </ul>
              <p>
                You can resize the console panel by dragging the handle at the top, or maximize it using the expand
                button.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="settings">
          <AccordionTrigger>Settings</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>The settings modal allows you to customize DB Migrator to your preferences:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>General</strong> - Default environment, project, and startup behavior.
                </li>
                <li>
                  <strong>Console</strong> - Log display preferences and colors.
                </li>
                <li>
                  <strong>Execution</strong> - Migration execution preferences.
                </li>
                <li>
                  <strong>Advanced</strong> - API configuration and mock data settings.
                </li>
                <li>
                  <strong>Theme</strong> - Appearance settings including light/dark mode and font size.
                </li>
              </ul>
              <p>Your settings are saved to your browser&apos;s local storage and will persist between sessions.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="creating-migrations">
          <AccordionTrigger>Creating New Migrations</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>To create a new migration:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click the &quot;New Migration&quot; button in the sidebar.</li>
                <li>Enter a version number and description.</li>
                <li>Write the SQL for the up and down migrations.</li>
                <li>Specify any dependencies on other migrations.</li>
                <li>Save the migration.</li>
              </ol>
              <p>Best practices for migrations:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep migrations small and focused on a single change.</li>
                <li>Always provide a down migration to allow rollbacks.</li>
                <li>Use descriptive version numbers and names.</li>
                <li>Test migrations in development before applying to production.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="keyboard-shortcuts">
          <AccordionTrigger>Keyboard Shortcuts</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p>DB Migrator supports the following keyboard shortcuts:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-mono bg-muted p-1 rounded">Ctrl+S</div>
                <div>Save current migration</div>

                <div className="font-mono bg-muted p-1 rounded">Ctrl+R</div>
                <div>Run selected migration</div>

                <div className="font-mono bg-muted p-1 rounded">Ctrl+Z</div>
                <div>Rollback selected migration</div>

                <div className="font-mono bg-muted p-1 rounded">Ctrl+D</div>
                <div>Dry run selected migration</div>

                <div className="font-mono bg-muted p-1 rounded">Ctrl+,</div>
                <div>Open settings</div>

                <div className="font-mono bg-muted p-1 rounded">Ctrl+H</div>
                <div>Open help</div>

                <div className="font-mono bg-muted p-1 rounded">Esc</div>
                <div>Close current panel</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
