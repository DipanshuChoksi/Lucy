'use client';

import React, { useState, useEffect } from 'react';
import { FolderGit2, Save, Loader2, CheckCircle2 } from 'lucide-react';

export const SettingsForm: React.FC = () => {
  const [obsidianRepo, setObsidianRepo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings?email=web-user@example.com');
        if (response.ok) {
          const data = await response.json();
          if (data && data.obsidianRepo) {
            setObsidianRepo(data.obsidianRepo);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');
    setSuccessMessage('');
    console.log("hello world");

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'web-user@example.com',
          obsidianRepo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setIsSaving(false);
      setSaveSuccess(true);
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => {
        setSaveSuccess(false);
        setSuccessMessage('');
      }, 5000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setErrorMessage(error.message || 'Error saving settings');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">


      <div className="flex flex-col gap-2">
        <label htmlFor="obsidian-repo" className="font-medium text-sm text-on-surface flex items-center gap-2">
          <FolderGit2 size={16} className="text-secondary" aria-hidden="true" />
          Obsidian GitHub Repository
        </label>
        <input
          id="obsidian-repo"
          type="text"
          value={obsidianRepo}
          onChange={(e) => setObsidianRepo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave(e as any);
          }}
          className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder="username/my-obsidian-vault"
        />
        {errorMessage && (
          <p className="text-sm text-red-500 mt-1" role="alert">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-sm text-green-500 mt-1" role="status">{successMessage}</p>
        )}
      </div>

      <button
        type="button"
        disabled={isSaving}
        onClick={handleSave as any}
        className={`mt-6 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-md cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed ${saveSuccess ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-primary text-on-primary hover:bg-surface-tint disabled:opacity-80'
          }`}
      >
        {isSaving ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : saveSuccess ? (
          <CheckCircle2 size={18} aria-hidden="true" />
        ) : (
          <Save size={18} aria-hidden="true" />
        )}
        {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
};
