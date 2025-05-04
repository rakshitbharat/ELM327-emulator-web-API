"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">404 - Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
      <Button asChild>
        <Link href="/">Go Back</Link>
      </Button>
    </div>
  )
}
