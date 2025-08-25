import Link from 'next/link';

export default function Layout({ children }) {
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
                </div>
            </header>
            <main className="p-8 pt-4">
                {children}
            </main>
        </div>
    );
}
