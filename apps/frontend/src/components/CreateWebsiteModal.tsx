"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface CreateWebSiteModalProps {
  isOpen: boolean
  onClose: (url: string | null) => void
}

export function CreateWebSiteModal({ isOpen, onClose }: CreateWebSiteModalProps) {
  const [url, setUrl] = useState<string>("")

  const handleSubmit = () => {
    if (url.trim() === "") {
      onClose(null) // Close modal without submitting
    } else {
      onClose(url) // Pass URL back to parent
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter The URL</DialogTitle>  
          <DialogDescription>of Your Website</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Add a Website</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
