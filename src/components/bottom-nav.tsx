'use client';
import Link from 'next/link';
import { Upload, ChevronRight } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-background border-t p-2 flex justify-around sm:hidden">
      <Link href="/documents" className="flex flex-col items-center text-sm">
        <Upload className="h-5 w-5" />
        Upload Doc
      </Link>
      <Link href="/application" className="flex flex-col items-center text-sm">
        <ChevronRight className="h-5 w-5" />
        Next Step
      </Link>
    </nav>
  );
}
