"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';

function NavbarDesktop() {
  const pathname = usePathname();
  const { logout } = useUser();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `flex items-center gap-md px-md py-xs transition-all rounded-xl cursor-pointer ${isActive
      ? 'bg-secondary-container text-on-secondary-container opacity-100 scale-100 font-bold'
      : 'text-on-surface-variant hover:bg-surface-container-highest active:scale-95'
      }`;
  };

  const getIconClasses = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `material-symbols-outlined ${isActive ? 'fill' : ''}`;
  };

  return (
    <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-md z-40 bg-surface-container-low border-r border-outline-variant">
      <div className="mb-xl">
        <h1 className="font-display text-headline-md font-semibold text-on-surface">Lucy</h1>
        <p className="font-label-sm text-label-sm text-secondary">Productive Calm</p>
      </div>
      <div className="flex-1 space-y-sm">
        <Link className={getLinkClasses('/')} href="/">
          <span className={getIconClasses('/')} data-icon="library_books">library_books</span>
          <span className="font-label-md text-label-md">My Library</span>
        </Link>
        <Link className={getLinkClasses('/queue')} href="/queue">
          <span className={getIconClasses('/queue')} data-icon="history">history</span>
          <span className="font-label-md text-label-md">Recent</span>
        </Link>
        <Link className={getLinkClasses('/reader')} href="/reader">
          <span className={getIconClasses('/reader')} data-icon="menu_book">menu_book</span>
          <span className="font-label-md text-label-md">Reader</span>
        </Link>
        <Link className={getLinkClasses('/settings')} href="/settings">
          <span className={getIconClasses('/settings')} data-icon="settings">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </Link>
      </div>
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-md px-md py-xs w-full text-left transition-all rounded-xl cursor-pointer text-on-surface-variant hover:bg-surface-container-highest active:scale-95"
        >
          <span className="material-symbols-outlined" data-icon="logout">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default NavbarDesktop