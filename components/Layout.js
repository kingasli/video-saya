import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-10 p-8 pb-4">
                <Link href="/" className="text-3xl font-bold text-white tracking-wide mb-4 sm:mb-0">
                    Video Saya
                </Link>
                <div className="flex items-center space-x-4">
                    <nav>
                        <Link href="/categories" className="text-gray-400 hover:text-white transition duration-300">
                            Kategori
                        </Link>
                    </nav>
                    <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari video..."
                            className="w-full pl-10 pr-4 py-2 rounded-full text-sm text-gray-100 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </header>
            <main className="p-8 pt-4">
                {children}
            </main>
        </div>
    );
}