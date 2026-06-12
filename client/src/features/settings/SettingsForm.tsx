'use client';

import React, { useState, useEffect } from 'react';
import { FolderGit2, Save, Loader2, CheckCircle2, Database, Key, Server } from 'lucide-react';
import { apiFetch } from '@/src/lib/api';

export const SettingsForm: React.FC = () => {
  const [storageProvider, setStorageProvider] = useState('GITHUB');
  const [obsidianRepo, setObsidianRepo] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [s3Bucket, setS3Bucket] = useState('');
  const [s3Region, setS3Region] = useState('');
  const [s3AccessKeyId, setS3AccessKeyId] = useState('');
  const [s3SecretAccessKey, setS3SecretAccessKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiFetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            if (data.storageProvider) setStorageProvider(data.storageProvider);
            if (data.obsidianRepo) setObsidianRepo(data.obsidianRepo);
            if (data.githubToken) setGithubToken(data.githubToken);
            if (data.s3Bucket) setS3Bucket(data.s3Bucket);
            if (data.s3Region) setS3Region(data.s3Region);
            if (data.s3AccessKeyId) setS3AccessKeyId(data.s3AccessKeyId);
            if (data.s3SecretAccessKey) setS3SecretAccessKey(data.s3SecretAccessKey);
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

    try {
      const response = await apiFetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storageProvider,
          obsidianRepo,
          githubToken,
          s3Bucket,
          s3Region,
          s3AccessKeyId,
          s3SecretAccessKey
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
      <div className="flex flex-col gap-3">
        <label className="font-medium text-sm text-on-surface flex items-center gap-2">
          <Database size={16} className="text-secondary" aria-hidden="true" />
          Storage Provider
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="storage-provider"
              value="GITHUB"
              checked={storageProvider === 'GITHUB'}
              onChange={(e) => setStorageProvider(e.target.value)}
              className="text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm text-on-surface">GitHub Repository (Obsidian)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="storage-provider"
              value="S3"
              checked={storageProvider === 'S3'}
              onChange={(e) => setStorageProvider(e.target.value)}
              className="text-primary focus:ring-primary h-4 w-4"
            />
            <span className="text-sm text-on-surface">Amazon S3</span>
          </label>
        </div>
      </div>

      {storageProvider === 'GITHUB' && (
        <div className="flex flex-col gap-4">
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
              suppressHydrationWarning
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="github-token" className="font-medium text-sm text-on-surface flex items-center gap-2">
              <Key size={16} className="text-secondary" aria-hidden="true" />
              GitHub Personal Access Token (PAT)
            </label>
            <input
              id="github-token"
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
        </div>
      )}

      {storageProvider === 'S3' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="s3-bucket" className="font-medium text-sm text-on-surface flex items-center gap-2">
              <Database size={16} className="text-secondary" aria-hidden="true" />
              S3 Bucket Name
            </label>
            <input
              id="s3-bucket"
              type="text"
              value={s3Bucket}
              onChange={(e) => setS3Bucket(e.target.value)}
              className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="my-notes-bucket"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s3-region" className="font-medium text-sm text-on-surface flex items-center gap-2">
              <Server size={16} className="text-secondary" aria-hidden="true" />
              S3 Region
            </label>
            <input
              id="s3-region"
              type="text"
              value={s3Region}
              onChange={(e) => setS3Region(e.target.value)}
              className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="us-east-1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s3-access-key" className="font-medium text-sm text-on-surface flex items-center gap-2">
              <Key size={16} className="text-secondary" aria-hidden="true" />
              Access Key ID
            </label>
            <input
              id="s3-access-key"
              type="text"
              value={s3AccessKeyId}
              onChange={(e) => setS3AccessKeyId(e.target.value)}
              className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="AKIAIOSFODNN7EXAMPLE"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="s3-secret-key" className="font-medium text-sm text-on-surface flex items-center gap-2">
              <Key size={16} className="text-secondary" aria-hidden="true" />
              Secret Access Key
            </label>
            <input
              id="s3-secret-key"
              type="password"
              value={s3SecretAccessKey}
              onChange={(e) => setS3SecretAccessKey(e.target.value)}
              className="min-h-[44px] border border-outline-variant rounded-md px-3 py-2 bg-surface-container-lowest text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            />
          </div>
        </div>
      )}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1" role="alert">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-500 mt-1" role="status">{successMessage}</p>
      )}

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
    </div >
  );
};
