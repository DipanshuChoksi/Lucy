'use client';

import { apiFetch } from '@/src/lib/api';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, useRouter } from 'next/navigation';

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [noteContent, setNoteContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      try {
        const response = await apiFetch(`/api/notes/content/${id}?email=web-user@example.com`);
        if (response.ok) {
          const data = await response.json();
          setNoteContent(data.content || '');
        } else {
          setError('Failed to load note content.');
        }
      } catch (err) {
        console.error('Failed to load note content', err);
        setError('An error occurred while loading the note.');
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, [id]);

  return (
    <main className="flex-1 flex flex-col md:ml-64 min-h-screen relative bg-background">
      <section className="flex-1 bg-background h-screen overflow-y-auto flex flex-col relative">
        <div className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-outline-variant p-md flex items-center justify-between z-10">
          <div className="flex items-center gap-sm">
            <button onClick={() => router.push('/reader')} className="p-sm rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <h2 className="font-headline-md text-headline-sm text-on-surface truncate flex-1 ml-2">
              Document Reader
            </h2>
          </div>
        </div>
        <div className="p-md lg:p-xl max-w-4xl w-full mx-auto pb-32">
          {loadingContent ? (
            <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-md">
              <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
              <p className="font-body-lg">Loading markdown content...</p>
            </div>
          ) : error ? (
            <div className="text-center text-error mt-xl">{error}</div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary">
              <ReactMarkdown>{noteContent}</ReactMarkdown>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
