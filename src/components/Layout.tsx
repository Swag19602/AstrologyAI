import React from 'react';
import { Sparkles } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-yellow-300 w-10 h-10" />
                        <h1 className="text-3xl font-bold tracking-wide">Astrology AI</h1>
                    </div>
            </header>
            <main className="flex-grow p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; {new Date().getFullYear()} Astrology AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;