import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

export default function Search() {
    const router = useRouter();
    const { keyword } = router.query;
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(keyword || '');

    useEffect(() => {
        if (!keyword) {
            setLoading(false);
            return;
        }

        const fetchVideos = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/api/search?keyword=${encodeURIComponent(keyword)}`);
                if (!res.ok) {
                    throw new Error(`Gagal mengambil data pencarian: ${res.statusText}`);
                }
                const data = await res.json();
                // Periksa apakah data.videos ada dan merupakan array
                if (data && Array.isArray(data.videos)) {
                    setVideos(data.videos);
                } else {
                    setVideos([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [keyword]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(searchQuery)}`);
        }
    };

    const title = keyword ? `Hasil Pencarian untuk: "${keyword}"` : 'Pencarian Video';

    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            
            {/* BILAH PENCARIAN BARU */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mb-10">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pencarian video..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-md text-gray-100 bg-gray-800 border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
            </form>

            <h1 className="text-2xl font-bold mb-6 text-white">{title}</h1>

            {loading && <p>Mencari video...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            {!loading && !error && videos.length === 0 && (
                <p>Tidak ada video yang ditemukan.</p>
            )}

            {!loading && !error && videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <Link key={video.slug} href={`/view/${video.slug}`} className="block overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-800">
                            <div className="relative w-full h-42">
                                <img
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    style={{ width: '300px', height: '168px' }}
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-sm font-semibold text-white mb-1 leading-snug truncate">{video.title}</h2>
                                <p className="text-xs text-gray-400 truncate">{video.authorName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Layout>
    );
}
