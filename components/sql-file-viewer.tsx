"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import type { SqlFile } from "@/lib/types"

interface SqlFileViewerProps {
  file: SqlFile
}

export default function SqlFileViewer({ file }: SqlFileViewerProps) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the file content from an API
    // For now, we'll simulate loading the content
    setLoading(true)

    // Simulate API call with a timeout
    const timeout = setTimeout(() => {
      // Mock content based on the file name
      const mockContent = file.content || generateMockSqlContent(file.name)
      setContent(mockContent)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [file])

  // Helper function to generate mock SQL content
  const generateMockSqlContent = (fileName: string) => {
    if (fileName.includes("init")) {
      return `-- Initialize database schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);`
    }

    if (fileName.includes("add_table")) {
      return `-- Add products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);`
    }

    if (fileName.includes("drop")) {
      return `-- Drop tables in reverse order of creation
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;`
    }

    return `-- SQL content for ${fileName}
SELECT * FROM migrations WHERE version = '${file.name.split(".")[0]}';`
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap bg-muted p-4 rounded-md overflow-x-auto">
          <code>{content}</code>
        </pre>
      </div>
    </ScrollArea>
  )
}
