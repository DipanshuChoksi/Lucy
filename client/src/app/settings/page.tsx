import React from 'react';
import { SettingsForm } from '../../features/settings/SettingsForm';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-2xl p-8 bg-bg-surface rounded-xl shadow-sm border border-border-main">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3 text-primary tracking-tight">Developer Settings</h1>
          <p className="text-lg text-text-muted">Manage your GitHub token, Obsidian repository, and tech stack.</p>
        </div>
        
        <section>
          <SettingsForm />
        </section>
      </main>
    </div>
  );
}
