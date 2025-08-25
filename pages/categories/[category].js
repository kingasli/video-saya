import Head from 'next/head';
import Link from 'next/link';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

export async function getStaticPaths() {
    try {
        const res = await fetch(`${API_URL}/api/videos`);
        const { videos } = await res.json();
        
        if (!videos || videos.length === 0) {
            return {
                paths: [],
                fallback: false,
            };
        }

        const allCategories = new Set();
        videos.forEach(video => {
            if (typeof video.categories === 'string') {
                video.categories.split(',').map(cat => cat.trim()).forEach(cat => allCategories.add(cat));
            } else if (Array.isArray(video.categories)) {
                video.categories.forEach(cat => allCategories.add(cat));
            }
        });

        const paths = Array.from(allCategories).map(category => ({
            params: { category },
        }));

        return { paths, fallback: false };
    } catch (error) {
        console.error('Failed to fetch category paths:', error);
        return { paths: [], fallback: false };
    }
}

export async function getStaticProps({ params }) {
    try {
        const res = await fetch(`${API_URL}/api/videos`);
        const { videos } = await res.json();
        
        if (!videos || videos.length === 0) {
            return { notFound: true };
        }

        const filteredVideos = videos.filter(video => {
            if (typeof video.categories === 'string') {
                return video.categories.split(',').map(cat => cat.trim()).includes(params.category);
            } else if (Array.isArray(video.categories)) {
                return video.categories.includes(params.category);
            }
            return false;
        });

        return {
            props: {
                category: params.category,
                videos: filteredVideos,
            },
        };
    } catch (error) {
        console.error('Failed to fetch videos for category:', error);
        return { notFound: true };
    }
}

export default function CategoryPage({ category, videos }) {
    return (
        <div style={{ backgroundColor: '#181818', minHeight: '100vh', color: '#fff', padding: '20px' }}>
            <Head>
                <title>Kategori: {category}</title>
            </Head>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/" style={{ color: '#3498db', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
                    &larr; Kembali ke Beranda
                </Link>
                <h1 style={{ textTransform: 'capitalize' }}>Kategori: {category}</h1>
                <p>{videos.length} video ditemukan.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {videos.length > 0 ? (
                        videos.map(video => (
                            <Link key={video.slug} href={`/view/${video.slug}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
                                        <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                    </div>
                                    <h2 style={{ fontSize: '16px', marginTop: '10px' }}>{video.title}</h2>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>Tidak ada video dalam kategori ini.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

