'use client';

import { apiFetch } from '@/src/lib/api';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, useRouter } from 'next/navigation';

export default function NoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [noteContent, setNoteContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    const fetchContent = async () => {
      try {
        const response = await apiFetch(`/api/notes/content/${id}?email=web-user@example.com`);
        if (response.ok) {
          const data = await response.json();
          let parsed = data.content;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch (e) { }
          }
          setNoteContent(parsed);
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
    <main className="flex-1 flex flex-col md:ml-64 min-h-screen relative bg-background ">
      <section className="flex-1 bg-background flex flex-col relative">
        <div className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-outline-variant p-sm md:p-md flex items-center z-10">
          <button onClick={() => router.push('/reader')} className="p-1 md:p-sm rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px] text-on-surface">arrow_back</span>
          </button>
          <div className="flex-1 flex justify-center overflow-hidden px-2 md:px-4">
            <h1 className="text-lg md:text-2xl font-bold text-on-surface truncate">
              {noteContent?.title || 'Document Reader'}
            </h1>
          </div>
          <div className="w-8 md:w-10 shrink-0"></div>
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
            <div className="space-y-12">
              {noteContent && typeof noteContent === 'object' ? (
                ['executive-summary', 'detailed-notes', 'key-engineering-insights', 'actionable-takeaways'].map((key) => {
                  const section = noteContent[key];
                  if (!section) return null;
                  return (
                    <div key={key} className="prose prose-sm md:prose-lg prose-p:leading-snug prose-li:leading-snug md:prose-p:leading-relaxed md:prose-li:leading-relaxed dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary border border-outline-variant p-6 rounded-2xl bg-surface">
                      <h2 className="mb-6 pb-2 border-b border-outline-variant text-on-surface">{section.title}</h2>
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  );
                })
              ) : (
                <div className="prose prose-sm md:prose-lg prose-p:leading-snug prose-li:leading-snug md:prose-p:leading-relaxed md:prose-li:leading-relaxed dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary">
                  <ReactMarkdown>{typeof noteContent === 'string' ? noteContent : 'Invalid content format'}</ReactMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
