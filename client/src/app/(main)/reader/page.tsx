'use client';

import { apiFetch } from '@/src/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoteMetadata {
  id: number;
  filename: string;
  storageType: 'GITHUB' | 'S3';
  createdAt?: string;
}

export default function NoteReader() {
  const [notes, setNotes] = useState<NoteMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const url = `/api/notes${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`;
        const response = await apiFetch(url);
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
    
    const timeoutId = setTimeout(() => {
      fetchNotes();
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setLoading(true);
    try {
      const response = await apiFetch(`/api/notes/${id}`, { 
        method: 'DELETE' 
      });
      if (response.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (e: React.MouseEvent, id: number, currentFilename: string) => {
    e.preventDefault();
    e.stopPropagation();
    const currentName = currentFilename.replace(/\.md$/, '');
    const newName = window.prompt('Enter new note name:', currentName);
    
    if (!newName || newName === currentName) return;
    
    setLoading(true);
    try {
      const response = await apiFetch(`/api/notes/${id}/rename`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newFilename: newName })
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(prev => prev.map(n => n.id === id ? { ...n, filename: data.file.filename } : n));
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to rename note');
      }
    } catch (error) {
      console.error('Error renaming note:', error);
      alert('Error renaming note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col md:ml-64 min-h-screen bg-background">
      <section className="w-full flex-col p-md bg-surface-container-lowest h-screen overflow-y-auto">
        <header className="mb-lg flex flex-col gap-4">
          <div>
            <h1 className="font-display text-headline-md text-on-background mb-xs">Your Notes</h1>
            <p className="font-body-sm text-on-surface-variant">
              {notes.length} notes found across your storage.
            </p>
          </div>
          <div className="relative w-full max-w-md min-w-[300px] sm:min-w-[400px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">search</span>
            <input 
              type="text"
              placeholder="Search notes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[48px] pl-10 pr-4 py-2 rounded-xl border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
            />
          </div>
        </header>

        {loading && !notes.length ? (
          <div className="text-center text-on-surface-variant py-xl font-body-md">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-sm">
            {notes.map((note) => (
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
                      <button
                        onClick={(e) => handleRename(e, note.id, note.filename)}
                        className="text-primary/70 hover:text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                        title="Rename note"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, note.id)}
                        className="text-error/70 hover:text-error hover:bg-error/10 p-1.5 rounded-full transition-colors"
                        title="Delete note"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-headline-sm text-body-lg font-semibold leading-snug line-clamp-3" title={note.filename}>
                    {note.filename.replace(/\.md$/, '')}
                  </h3>
                </div>
              </Link>
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
    </main>
  );
}
