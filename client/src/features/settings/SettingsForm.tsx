'use client';

import React, { useState } from 'react';

export const SettingsForm: React.FC = () => {
  const [githubToken, setGithubToken] = useState('');
  const [obsidianRepo, setObsidianRepo] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving settings:', { githubToken, obsidianRepo });
    // In real app, call API layer here
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm text-gray-600">GitHub Personal Access Token</label>
        <input 
          type="password" 
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm text-gray-600">Obsidian GitHub Repository</label>
        <input 
          type="text" 
          value={obsidianRepo}
          onChange={(e) => setObsidianRepo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="username/my-obsidian-vault"
        />
      </div>
      <button 
        type="submit" 
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Save Settings
      </button>
    </form>
  );
};
