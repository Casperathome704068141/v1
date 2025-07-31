'use client';
import { AppLayout } from '@/components/app-layout';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function HubDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [data, setData] = useState<{ title: string; content: string }>({ title: '', content: '' });

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, 'learningHub', slug));
      if (snap.exists()) {
        const d = snap.data() as any;
        setData({ title: d.title, content: d.content });
      }
    };
    fetchData();
  }, [slug]);

  return (
    <AppLayout>
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
        <article className="prose dark:prose-invert">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </article>
      </main>
    </AppLayout>
  );
}
