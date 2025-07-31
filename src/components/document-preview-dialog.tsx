"use client";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import type { UploadedFile } from "@/context/application-context";
import { useLocale } from "@/context/locale-context";

export function DocumentPreviewDialog({ file }: { file: UploadedFile }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLocale();
  const handleCopy = () => {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPDF = file.fileName.toLowerCase().endsWith(".pdf");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {t('preview')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm truncate mr-2">{file.fileName}</h3>
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            <Copy className="h-3 w-3 mr-1" />{copied ? t('copied') : t('copyLink')}
          </Button>
        </div>
        {isPDF ? (
          <iframe src={file.url} className="w-full h-[60vh] border" />
        ) : (
          <img src={file.url} alt={file.fileName} className="max-h-[60vh] mx-auto" />
        )}
      </DialogContent>
    </Dialog>
  );
}
