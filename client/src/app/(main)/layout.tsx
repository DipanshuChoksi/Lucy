import React from 'react';
import NavbarDesktop from '../../components/ui/navbar-desktop';
import NavbarMobile from '../../components/ui/navbar-mobile';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased">
      {/* SideNavBar (Desktop) */}
      <NavbarDesktop />
      {/* TopAppBar (Mobile) */}
      <NavbarMobile />
      {children}
    </div>
  );
}
