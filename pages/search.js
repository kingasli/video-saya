    import { useRouter } from 'next/router';
    import Head from 'next/head';
    import Link from 'next/link';
    import { useEffect, useState } from 'react';
    import Layout from '../components/Layout';
    export default function Search() {
        const router = useRouter();
        const { keyword } = router.query;
        const [videos, setVideos] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        useEffect(() => {
            if (!keyword) {
                setLoading(false);
                return;
            }
            const fetchVideos = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        const errorMessage = errorData.error || res.statusText || 'Kesalahan respons server';
                        throw new Error(`Gagal mengambil data: ${errorMessage}`);
                    }
                    const data = await res.json();
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
        const title = keyword ? `Hasil Pencarian untuk: "${keyword}"` : 'Pencarian Video';
        return (
            <Layout>
                <Head>
                    <title>{title}</title>
                </Head>
                <h1 className="text-2xl font-bold mb-6 text-white">{title}</h1>
                {loading && <p>Mencari video...</p>}
                {error && <p className="text-red-500">Error: {error}.</p>}
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
    