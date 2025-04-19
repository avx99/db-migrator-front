"use client"

import { useState, useEffect } from "react"
import type { Migration } from "@/lib/types"

// Mock data for demonstration
const mockMigrations: Migration[] = [
  {
    id: "1",
    version: "v1.0.0",
    description: "Initial schema setup with users and roles tables",
    author: "john.doe",
    timestamp: "2023-01-15T10:30:00Z",
    status: "MIGRATED",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL,\n  email VARCHAR(100) NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE roles (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(50) NOT NULL\n);",
    sqlDown: "DROP TABLE roles;\nDROP TABLE users;",
    affectedTables: ["users", "roles"],
    changelog: [{ date: "2023-01-15", message: "Initial creation" }],
    metadata: {
      "jira-ticket": "DB-100",
      "reviewed-by": "jane.smith",
    },
  },
  {
    id: "2",
    version: "v1.1.0",
    description: "Add user_roles junction table for many-to-many relationship",
    author: "jane.smith",
    timestamp: "2023-02-05T14:45:00Z",
    status: "MIGRATED",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE user_roles (\n  user_id INTEGER REFERENCES users(id),\n  role_id INTEGER REFERENCES roles(id),\n  PRIMARY KEY (user_id, role_id)\n);",
    sqlDown: "DROP TABLE user_roles;",
    affectedTables: ["user_roles"],
    changelog: [
      { date: "2023-02-01", message: "Initial draft" },
      { date: "2023-02-05", message: "Finalized and applied" },
    ],
    dependencies: ["v1.0.0"],
  },
  {
    id: "3",
    version: "v1.2.0",
    description: "Add products and orders tables for e-commerce functionality",
    author: "alex.johnson",
    timestamp: "2023-03-10T09:15:00Z",
    status: "MIGRATED",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE products (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  price DECIMAL(10, 2) NOT NULL,\n  description TEXT\n);\n\nCREATE TABLE orders (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  created_at TIMESTAMP DEFAULT NOW()\n);",
    sqlDown: "DROP TABLE orders;\nDROP TABLE products;",
    affectedTables: ["products", "orders"],
    changelog: [
      { date: "2023-03-08", message: "Initial creation" },
      { date: "2023-03-10", message: "Applied to production" },
    ],
    dependencies: ["v1.0.0"],
  },
  {
    id: "4",
    version: "v1.3.0",
    description: "Add order_items table to link orders and products",
    author: "jane.smith",
    timestamp: "2023-04-20T11:30:00Z",
    status: "MIGRATED",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE order_items (\n  id SERIAL PRIMARY KEY,\n  order_id INTEGER REFERENCES orders(id),\n  product_id INTEGER REFERENCES products(id),\n  quantity INTEGER NOT NULL,\n  price DECIMAL(10, 2) NOT NULL\n);",
    sqlDown: "DROP TABLE order_items;",
    affectedTables: ["order_items"],
    changelog: [
      { date: "2023-04-18", message: "Initial draft" },
      { date: "2023-04-20", message: "Applied to production" },
    ],
    dependencies: ["v1.2.0"],
  },
  {
    id: "5",
    version: "v2.0.0",
    description: "Add user preferences and settings tables",
    author: "alex.johnson",
    timestamp: "2023-05-15T13:45:00Z",
    status: "PENDING",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE user_preferences (\n  user_id INTEGER PRIMARY KEY REFERENCES users(id),\n  theme VARCHAR(20) DEFAULT 'light',\n  notifications_enabled BOOLEAN DEFAULT TRUE\n);\n\nCREATE TABLE settings (\n  key VARCHAR(50) PRIMARY KEY,\n  value TEXT NOT NULL,\n  description TEXT\n);",
    sqlDown: "DROP TABLE settings;\nDROP TABLE user_preferences;",
    affectedTables: ["user_preferences", "settings"],
    changelog: [
      { date: "2023-05-10", message: "Initial draft" },
      { date: "2023-05-15", message: "Ready for review" },
    ],
    dependencies: ["v1.0.0"],
  },
  {
    id: "6",
    version: "v2.1.0",
    description: "Add payment processing tables",
    author: "john.doe",
    timestamp: "2023-06-05T10:00:00Z",
    status: "FAILED",
    type: "JAVA",
    sqlUp:
      "CREATE TABLE payments (\n  id SERIAL PRIMARY KEY,\n  order_id INTEGER REFERENCES orders(id),\n  amount DECIMAL(10, 2) NOT NULL,\n  payment_method VARCHAR(50) NOT NULL,\n  status VARCHAR(20) NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE payment_methods (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER REFERENCES users(id),\n  type VARCHAR(50) NOT NULL,\n  details JSONB NOT NULL\n);",
    sqlDown: "DROP TABLE payment_methods;\nDROP TABLE payments;",
    affectedTables: ["payments", "payment_methods"],
    changelog: [
      { date: "2023-06-01", message: "Initial draft" },
      { date: "2023-06-05", message: "Failed due to constraint issues" },
    ],
    dependencies: ["v1.2.0", "v1.3.0"],
  },
  // SQL file-based migrations
  {
    id: "7",
    version: "v3.0.0",
    description: "Add customer management tables",
    author: "sarah.dev",
    timestamp: "2023-07-10T09:00:00Z",
    status: "MIGRATED",
    type: "SQL",
    fileCount: 3,
    runFiles: [
      {
        name: "001_customers.sql",
        fullPath: "/migrations/v3.0.0/run/001_customers.sql",
        status: "RUN",
        executedAt: "2023-07-10T09:05:00Z",
        hash: "a1b2c3d4e5f6",
        size: 1240,
        gitAuthor: "sarah.dev",
        lastModified: "2023-07-09T15:30:00Z",
      },
      {
        name: "002_customer_addresses.sql",
        fullPath: "/migrations/v3.0.0/run/002_customer_addresses.sql",
        status: "RUN",
        executedAt: "2023-07-10T09:05:10Z",
        hash: "f6e5d4c3b2a1",
        size: 980,
        gitAuthor: "sarah.dev",
        lastModified: "2023-07-09T16:15:00Z",
      },
    ],
    rollbackFiles: [
      {
        name: "001_drop_tables.sql",
        fullPath: "/migrations/v3.0.0/rollback/001_drop_tables.sql",
        status: "PENDING",
        hash: "1a2b3c4d5e6f",
        size: 320,
        gitAuthor: "sarah.dev",
        lastModified: "2023-07-09T16:30:00Z",
      },
    ],
    changelog: [
      { date: "2023-07-08", message: "Created migration files" },
      { date: "2023-07-10", message: "Applied to development" },
    ],
    metadata: {
      "jira-ticket": "DB-150",
      "reviewed-by": "john.doe",
    },
  },
  {
    id: "8",
    version: "v3.1.0",
    description: "Add product categories and tags",
    author: "mike.coder",
    timestamp: "2023-07-20T14:20:00Z",
    status: "PARTIAL",
    type: "SQL",
    fileCount: 4,
    runFiles: [
      {
        name: "001_categories.sql",
        fullPath: "/migrations/v3.1.0/run/001_categories.sql",
        status: "RUN",
        executedAt: "2023-07-20T14:25:00Z",
        hash: "abcdef123456",
        size: 850,
        gitAuthor: "mike.coder",
        lastModified: "2023-07-19T11:45:00Z",
      },
      {
        name: "002_tags.sql",
        fullPath: "/migrations/v3.1.0/run/002_tags.sql",
        status: "RUN",
        executedAt: "2023-07-20T14:25:15Z",
        hash: "123456abcdef",
        size: 720,
        gitAuthor: "mike.coder",
        lastModified: "2023-07-19T13:20:00Z",
      },
      {
        name: "003_product_tags.sql",
        fullPath: "/migrations/v3.1.0/run/003_product_tags.sql",
        status: "FAILED",
        executedAt: "2023-07-20T14:25:30Z",
        hash: "fedcba654321",
        size: 560,
        gitAuthor: "mike.coder",
        lastModified: "2023-07-19T14:10:00Z",
      },
    ],
    rollbackFiles: [
      {
        name: "001_drop_product_tags.sql",
        fullPath: "/migrations/v3.1.0/rollback/001_drop_product_tags.sql",
        status: "PENDING",
        hash: "654321fedcba",
        size: 180,
        gitAuthor: "mike.coder",
        lastModified: "2023-07-19T14:30:00Z",
      },
      {
        name: "002_drop_categories_tags.sql",
        fullPath: "/migrations/v3.1.0/rollback/002_drop_categories_tags.sql",
        status: "PENDING",
        hash: "abcdef654321",
        size: 240,
        gitAuthor: "mike.coder",
        lastModified: "2023-07-19T14:35:00Z",
      },
    ],
    changelog: [
      { date: "2023-07-18", message: "Created migration files" },
      { date: "2023-07-20", message: "Partial application - product_tags failed" },
    ],
    metadata: {
      "jira-ticket": "DB-155",
      "reviewed-by": "jane.smith",
    },
  },
  {
    id: "9",
    version: "v3.2.0",
    description: "Add inventory management tables",
    author: "lisa.dev",
    timestamp: "2023-08-05T10:15:00Z",
    status: "PENDING",
    type: "SQL",
    fileCount: 3,
    runFiles: [
      {
        name: "001_inventory.sql",
        fullPath: "/migrations/v3.2.0/run/001_inventory.sql",
        status: "PENDING",
        hash: "123abc456def",
        size: 1120,
        gitAuthor: "lisa.dev",
        lastModified: "2023-08-04T16:20:00Z",
      },
      {
        name: "002_stock_movements.sql",
        fullPath: "/migrations/v3.2.0/run/002_stock_movements.sql",
        status: "PENDING",
        hash: "456def123abc",
        size: 980,
        gitAuthor: "lisa.dev",
        lastModified: "2023-08-04T17:05:00Z",
      },
      {
        name: "003_inventory_audit.sql",
        fullPath: "/migrations/v3.2.0/run/003_inventory_audit.sql",
        status: "PENDING",
        hash: "789ghi012jkl",
        size: 1450,
        gitAuthor: "lisa.dev",
        lastModified: "2023-08-04T18:30:00Z",
      },
    ],
    rollbackFiles: [
      {
        name: "001_drop_inventory_tables.sql",
        fullPath: "/migrations/v3.2.0/rollback/001_drop_inventory_tables.sql",
        status: "PENDING",
        hash: "012jkl789ghi",
        size: 420,
        gitAuthor: "lisa.dev",
        lastModified: "2023-08-04T18:45:00Z",
      },
    ],
    changelog: [
      { date: "2023-08-03", message: "Created migration files" },
      { date: "2023-08-05", message: "Ready for review" },
    ],
    metadata: {
      "jira-ticket": "DB-160",
      "reviewed-by": "alex.johnson",
    },
  },
]

export function useMigrations() {
  const [migrations, setMigrations] = useState<Migration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchMigrations = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/migrations')
        // const data = await response.json()

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setMigrations(mockMigrations)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch migrations. Please try again.")
        setLoading(false)
      }
    }

    fetchMigrations()
  }, [])

  return { migrations, loading, error }
}
