'use client';

import React, { useState } from 'react';
import { Video, Loader2, CheckCircle2, PlaySquare } from 'lucide-react';

export const YoutubeForm: React.FC = () => {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessSuccess(false);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/youtube/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtubeLink,
          email: 'web-user@example.com',
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="youtube-link" className="font-medium text-sm text-text-main flex items-center gap-2">
          <Video size={16} className="text-text-muted" aria-hidden="true" />
          YouTube Video Link
        </label>
        <input 
          id="youtube-link"
          type="url" 
          required
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(e as any);
          }}
          aria-describedby="youtube-hint"
          className="min-h-[44px] border border-border-main rounded-md px-3 py-2 bg-bg-surface text-text-main outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {errorMessage && (
          <p className="text-sm text-red-500 mt-1" role="alert">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-500 mt-1" role="status">{successMessage}</p>
        )}
        <p id="youtube-hint" className="text-xs text-text-muted mt-1">Paste the full URL to extract transcript and summarize.</p>
      </div>

      <button 
        type="button" 
        onClick={handleSubmit as any}
        className={`mt-4 flex items-center justify-center gap-2 text-bg-surface font-bold py-3 px-4 rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed ${
          processSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-secondary disabled:opacity-70'
        }`}
      >
        {isProcessing ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : processSuccess ? (
          <CheckCircle2 size={18} aria-hidden="true" />
        ) : (
          <PlaySquare size={18} aria-hidden="true" />
        )}
        {isProcessing ? 'Processing...' : processSuccess ? 'Processed!' : 'Process Video'}
      </button>
    </div>
  );
};
