import React from 'react';
import { SettingsForm } from '../../../features/settings/SettingsForm';

export default function Settings() {
  return (
    <main className="flex-1 md:ml-64 w-full flex items-center justify-center p-md sm:p-xl overflow-x-hidden">
      <div className="w-full max-w-2xl p-md sm:p-xl bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant">
        <div className="mb-xl text-center">
          <h1 className="font-display text-headline-lg sm:text-display text-on-background mb-xs">Developer Settings</h1>
          <p className="font-body-md sm:font-body-lg text-body-md sm:text-body-lg text-on-surface-variant">
            Manage your storage.
          </p>
        </div>

        <section>
          <SettingsForm />
        </section>
      </div>
    </main>
  );
}
