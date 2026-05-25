import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Developer Assistant Platform',
  description: 'Manage your Socratic DSA Coach and OS Scout.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
