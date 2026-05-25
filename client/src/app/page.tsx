import React from 'react';
import { SettingsForm } from '../features/settings/SettingsForm';

export default function Home() {
  return (
    <main className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg border border-gray-100 mt-10">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Developer Assistant Platform</h1>
      <p className="text-lg text-gray-700 mb-8">Manage your DSA Coach, OS Scout, and SQL Sandbox settings.</p>
      
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Integrations</h2>
        <SettingsForm />
      </section>
    </main>
  );
}
