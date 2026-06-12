'use client';

import { apiFetch } from '@/src/lib/api';
import React, { useState } from 'react';

export default function NewNote() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    if (!youtubeLink) return;
    setIsProcessing(true);
    setProcessSuccess(false);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await apiFetch('/api/youtube/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeLink,

        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video.');
      }

      setIsProcessing(false);
      setProcessSuccess(true);
      setSuccessMessage(data.message || 'Successfully processed video!');
      setYoutubeLink('');

      // Clear success feedback after 5 seconds
      setTimeout(() => {
        setProcessSuccess(false);
        setSuccessMessage('');
      }, 5000);
    } catch (error: any) {
      console.error('Error processing video:', error);
      setErrorMessage(error.message || 'Error processing YouTube video.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex-1 md:ml-64 w-full flex flex-col items-center justify-center px-gutter py-xl">
      <div className="w-full max-w-2xl text-center space-y-xl">
        <div className="space-y-sm">
          <h1 className="font-display text-display text-on-background">Productive Calm</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Transform high-density video content into actionable knowledge.</p>
        </div>
        {/* URL Input Area */}
        <div className="relative w-full max-w-[36rem] mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">link</span>
          </div>
          <input
            className="w-full pl-xl pr-xl py-md bg-surface-container-lowest border border-outline-variant rounded-full font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-[0_10px_30px_rgba(0,0,0,0.04)] placeholder:text-outline disabled:opacity-50"
            placeholder="Paste YouTube URL here..."
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            disabled={isProcessing}
          />
          <button
            className="absolute inset-y-0 right-0 pr-sm flex items-center text-primary hover:text-surface-tint transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isProcessing || !youtubeLink}
          >
            {isProcessing ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : processSuccess ? (
              <span className="material-symbols-outlined text-green-500">check_circle</span>
            ) : (
              <span className="material-symbols-outlined">arrow_forward</span>
            )}
          </button>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-500 mt-2" role="alert">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-500 mt-2" role="status">{successMessage}</p>
        )}
        {/* How it works */}
        <div className="pt-xl grid grid-cols-1 md:grid-cols-3 gap-lg text-left">
          <div className="space-y-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">download</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Extract</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Automatically pulls transcript and metadata directly from the source video seamlessly.</p>
          </div>
          <div className="space-y-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Process</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Synthesizes key concepts, generates summaries, and creates timestamped notes instantly.</p>
          </div>
          <div className="space-y-sm p-md rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">database</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Store</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">Organizes your new knowledge into a searchable, distraction-free personal library.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
