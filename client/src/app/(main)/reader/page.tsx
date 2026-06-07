'use client';

import { apiFetch } from '@/src/lib/api';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface NoteMetadata {
  filename: string;
  source: 'GITHUB' | 'S3';
  url?: string;
  lastModified?: string;
}

export default function NoteReader() {
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNote, setActiveNote] = useState<NoteMetadata | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiFetch('/api/notes?email=web-user@example.com');
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || []);
        }
      } catch (error) {
        console.error('Failed to load notes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const loadNoteContent = async (note: NoteMetadata) => {
    setActiveNote(note);
    setLoadingContent(true);
    setNoteContent('');
    try {
      const response = await apiFetch(`/api/notes/content?email=web-user@example.com&filename=${encodeURIComponent(note.filename)}&source=${note.source}`);
      if (response.ok) {
        const data = await response.json();
        setNoteContent(data.content || '');
      } else {
        setNoteContent('Failed to load note content.');
      }
    } catch (error) {
      console.error('Failed to load note content', error);
      setNoteContent('An error occurred while loading the note.');
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col lg:flex-row md:ml-64 min-h-screen relative bg-background">
      {/* Left Panel: List of Notes */}
      <section className={`w-full ${activeNote ? 'lg:w-[35%] xl:w-[30%] hidden lg:flex' : 'lg:w-full'} flex-col p-md border-r border-outline-variant bg-surface-container-lowest h-screen overflow-y-auto transition-all`}>
        <header className="mb-lg">
          <h1 className="font-display text-headline-md text-on-background mb-xs">Your Notes</h1>
          <p className="font-body-sm text-on-surface-variant">
            {notes.length} notes found across your storage.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-on-surface-variant py-xl font-body-md">Loading...</div>
        ) : (
          <div className={`grid grid-cols-1 ${!activeNote ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} gap-sm`}>
            {notes.map((note, index) => (
              <div 
                key={index} 
                onClick={() => loadNoteContent(note)}
                className={`relative overflow-hidden border rounded-2xl p-lg cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between min-h-[140px] group
                  ${activeNote?.filename === note.filename && activeNote?.source === note.source 
                    ? 'bg-primary border-primary text-on-primary shadow-md ring-2 ring-primary/20 scale-[0.98]' 
                    : 'bg-surface hover:bg-surface-container-high border-outline-variant hover:border-primary/50 text-on-surface hover:-translate-y-1 hover:shadow-lg'}`}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-md">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeNote?.filename === note.filename && activeNote?.source === note.source ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-secondary group-hover:bg-primary/10 group-hover:text-primary'}`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {note.source === 'GITHUB' ? 'folder_data' : 'cloud'}
                      </span>
                    </div>
                    <span className={`font-label-sm text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors ${activeNote?.filename === note.filename && activeNote?.source === note.source ? 'border-on-primary/30 text-on-primary' : 'border-outline-variant text-on-surface-variant group-hover:border-primary/30 group-hover:text-primary'}`}>
                      {note.source}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-body-lg font-semibold leading-snug line-clamp-3" title={note.filename}>
                    {note.filename.replace(/\.md$/, '')}
                  </h3>
                </div>
              </div>
            ))}
            
            {notes.length === 0 && (
              <div className="col-span-full text-center py-xl border border-dashed border-outline-variant rounded-xl mt-md">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-sm">note_stack</span>
                <p className="text-on-surface-variant font-body-sm px-md">
                  No notes found. Configure storage and ingest a video.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Right Panel: Note Content */}
      {activeNote && (
        <section className="flex-1 bg-background h-screen overflow-y-auto flex flex-col relative">
          <div className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-outline-variant p-md flex items-center justify-between z-10">
            <div className="flex items-center gap-sm lg:hidden">
               <button onClick={() => setActiveNote(null)} className="p-sm rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center">
                 <span className="material-symbols-outlined text-on-surface">arrow_back</span>
               </button>
            </div>
            <h2 className="font-headline-md text-headline-sm text-on-surface truncate flex-1">
              {activeNote.filename}
            </h2>
            {activeNote.url && (
               <a href={activeNote.url} target="_blank" rel="noopener noreferrer" className="ml-md text-primary hover:bg-primary-container p-xs px-sm rounded font-label-md transition-colors flex items-center gap-xs">
                 View Original <span className="material-symbols-outlined text-[16px]">open_in_new</span>
               </a>
            )}
          </div>
          <div className="p-md lg:p-xl max-w-4xl w-full mx-auto pb-32">
            {loadingContent ? (
              <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant gap-md">
                 <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                 <p className="font-body-lg">Loading markdown content...</p>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-primary">
                <ReactMarkdown>{noteContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
