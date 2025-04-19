"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
      <p className="text-muted-foreground">
        Find answers to common questions about DB Migrator. If you don&apos;t see your question here, please contact us.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-db-migrator">
          <AccordionTrigger>What is DB Migrator?</AccordionTrigger>
          <AccordionContent>
            <p>
              DB Migrator is a visual tool for managing database migrations across different environments. It helps you
              track, execute, and roll back database schema changes in a controlled and organized manner.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="supported-databases">
          <AccordionTrigger>Which databases are supported?</AccordionTrigger>
          <AccordionContent>
            <p>DB Migrator supports the following database systems:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>PostgreSQL</li>
              <li>MySQL / MariaDB</li>
              <li>SQLite</li>
              <li>SQL Server</li>
              <li>Oracle Database</li>
            </ul>
            <p className="mt-2">Support for additional databases can be added through custom adapters.</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="migration-failed">
          <AccordionTrigger>What should I do if a migration fails?</AccordionTrigger>
          <AccordionContent>
            <p>If a migration fails, follow these steps:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Check the console logs for error details.</li>
              <li>Fix the issues in the migration script.</li>
              <li>
                If the database is in an inconsistent state, use the rollback feature to revert to the previous state.
              </li>
              <li>For complex failures, you may need to restore from a backup.</li>
              <li>Once fixed, try running the migration again.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-loss">
          <AccordionTrigger>Can migrations cause data loss?</AccordionTrigger>
          <AccordionContent>
            <p>
              Yes, certain migration operations like dropping tables or columns can cause data loss. To minimize risks:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Always back up your database before running migrations in production.</li>
              <li>Use the &quot;Dry Run&quot; feature to preview changes before executing them.</li>
              <li>Write careful down migrations that preserve data when possible.</li>
              <li>
                For schema changes that might affect data, consider using multiple migrations with intermediate steps.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="version-control">
          <AccordionTrigger>How does DB Migrator work with version control?</AccordionTrigger>
          <AccordionContent>
            <p>DB Migrator works well with version control systems like Git:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Migration scripts can be stored in your repository alongside your application code.</li>
              <li>The migration metadata is stored in a special table in your database.</li>
              <li>This allows team members to track which migrations have been applied to each environment.</li>
              <li>
                We recommend committing migration scripts to version control before applying them to any environment.
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="team-collaboration">
          <AccordionTrigger>How can my team collaborate using DB Migrator?</AccordionTrigger>
          <AccordionContent>
            <p>For team collaboration:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Store migration scripts in version control.</li>
              <li>Use a naming convention that includes author and purpose.</li>
              <li>Coordinate migration versions to avoid conflicts.</li>
              <li>Review migrations before applying them to shared environments.</li>
              <li>Use the &quot;author&quot; field to track who created each migration.</li>
              <li>Consider setting up a CI/CD pipeline to automatically apply migrations during deployments.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="offline-use">
          <AccordionTrigger>Can I use DB Migrator offline?</AccordionTrigger>
          <AccordionContent>
            <p>Yes, DB Migrator can work offline in several ways:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>You can enable mock data mode in Settings → Advanced to work without a database connection.</li>
              <li>Migration scripts can be created and edited offline.</li>
              <li>The application itself can run locally without internet access.</li>
              <li>However, to apply migrations to a database, you&apos;ll need connectivity to that database.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-security">
          <AccordionTrigger>Is my database information secure?</AccordionTrigger>
          <AccordionContent>
            <p>DB Migrator takes security seriously:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Connection credentials are stored securely and never sent to our servers.</li>
              <li>All database operations happen directly between your browser and your database.</li>
              <li>No data is sent to third parties.</li>
              <li>For sensitive environments, we recommend using the self-hosted version.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="large-migrations">
          <AccordionTrigger>How should I handle large migrations?</AccordionTrigger>
          <AccordionContent>
            <p>For large migrations:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Break them down into smaller, focused migrations when possible.</li>
              <li>Use transactions to ensure atomicity (all or nothing).</li>
              <li>Consider running data-intensive migrations during off-peak hours.</li>
              <li>For very large data operations, consider using database-native tools or batch processing.</li>
              <li>Monitor performance and resource usage during migration execution.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="custom-templates">
          <AccordionTrigger>Can I create custom migration templates?</AccordionTrigger>
          <AccordionContent>
            <p>Yes, DB Migrator supports custom templates:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Click on &quot;Templates&quot; in the sidebar to access the template manager.</li>
              <li>You can create templates for common operations like adding indexes, foreign keys, etc.</li>
              <li>Templates can include placeholders that are filled in when creating a new migration.</li>
              <li>Templates can be exported and shared with your team.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
