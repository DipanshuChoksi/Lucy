'use client';
import { apiFetch } from '@/src/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { YoutubeForm } from '@/src/features/youtube/YoutubeForm';

interface NoteMetadata {
  id: number;
  filename: string;
  storageType: 'GITHUB' | 'S3';
  createdAt?: string;
}

export default function Dashboard() {
  const [recentNotes, setRecentNotes] = useState<NoteMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const response = await apiFetch(`/api/notes`);
        if (response.ok) {
          const data = await response.json();
          // Take the top 3 most recent notes
          setRecentNotes((data.notes || []).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load recent notes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNotes();
  }, []);
  return (
    <main className="flex-1 md:ml-64 w-full">
      {/* Dashboard Header Area */}
      <div className="max-w-container-max mx-auto px-md md:px-lg py-xl">
        {/* Quick Ingest Section */}
        <div className="mb-xl">
          <YoutubeForm />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg hidden md:block">Recent Notes</h2>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:hidden">Recent Notes</h2>
            <p className="font-body-md text-body-md text-secondary mt-2">Your latest processed knowledge</p>
          </div>
          <Link href="/reader" className="text-primary hover:underline font-label-md flex items-center gap-1">
            View All</Link>
        </div>

        {/* Recent Notes Grid */}
        {loading ? (
          <div className="text-center text-on-surface-variant py-xl font-body-md">Loading...</div>
        ) : recentNotes.length === 0 ? (
          <div className="text-center py-xl border border-dashed border-outline-variant rounded-xl mt-md">
            <span className="material-symbols-outlined text-[32px] text-secondary mb-sm">note_stack</span>
            <p className="text-on-surface-variant font-body-sm px-md">
              No recent notes. Paste a YouTube link above to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/reader/${note.id}`}
                className="relative overflow-hidden border rounded-2xl p-lg cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between min-h-[140px] group bg-surface hover:bg-surface-container-high border-outline-variant hover:border-primary/50 text-on-surface hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-md">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-surface-container-high text-secondary group-hover:bg-primary/10 group-hover:text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        {note.storageType === 'GITHUB' ? 'folder_data' : 'cloud'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors border-outline-variant text-on-surface-variant group-hover:border-primary/30 group-hover:text-primary">
                        {note.storageType}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-body-lg font-semibold leading-snug line-clamp-3" title={note.filename}>
                    {note.filename.replace(/\.md$/, '')}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant dark:border-outline py-xl bg-background dark:bg-background">
        <div className="max-w-container-max mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-display text-label-md font-bold text-on-surface">Lucy</span>
          <p className="font-label-sm text-label-sm text-secondary dark:text-secondary-fixed-dim">© 2024 Lucy AI. Designed for productive calm.</p>
          <div className="flex gap-md">
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Privacy</a>
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Terms</a>
            <a className="font-label-sm text-label-sm text-on-secondary-container dark:text-secondary-fixed-dim hover:text-primary hover:underline transition-all opacity-100 hover:opacity-80" href="#">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}