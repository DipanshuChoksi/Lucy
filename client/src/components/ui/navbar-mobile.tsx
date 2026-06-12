"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function NavbarMobile() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (pathname.startsWith('/reader/') && pathname !== '/reader') {
        return null;
    }

    const getLinkClasses = (path: string) => {
        const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
        return `font-label-md text-label-md transition-colors cursor-pointer block py-sm px-sm rounded-lg ${isActive
                ? 'bg-secondary-container text-on-secondary-container font-bold'
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`;
    };

    return (
        <header className="md:hidden w-full bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
            <div className="flex justify-between items-center px-sm py-sm">
                <div className="flex items-center gap-sm">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-on-surface flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-highest transition-colors">
                        <span className="material-symbols-outlined text-[24px]">{isOpen ? 'close' : 'menu'}</span>
                    </button>
                    <h1 className="font-display text-headline-md font-bold text-primary">Lucy</h1>
                </div>
            </div>

            {isOpen && (
                <div className="px-sm pb-md flex flex-col gap-xs border-t border-outline-variant pt-sm bg-surface-container-lowest absolute w-full shadow-lg">
                    <Link onClick={() => setIsOpen(false)} className={getLinkClasses('/')} href="/">
                        <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px]">library_books</span>
                            My Library
                        </div>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} className={getLinkClasses('/queue')} href="/queue">
                        <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px]">history</span>
                            Recent
                        </div>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} className={getLinkClasses('/reader')} href="/reader">
                        <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px]">menu_book</span>
                            Reader
                        </div>
                    </Link>
                    <Link onClick={() => setIsOpen(false)} className={getLinkClasses('/settings')} href="/settings">
                        <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Settings
                        </div>
                    </Link>
                </div>
            )}
        </header>
    )
}

export default NavbarMobile;