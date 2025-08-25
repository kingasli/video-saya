import Head from 'next/head';
import Link from 'next/link';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

export const runtime = 'experimental-edge';

export async function getServerSideProps({ params }) {
    try {
        const categoryName = params.category;
        const res = await fetch(`${API_URL}/api/videos/category/${categoryName}`);
        const videos = await res.json();
        
        return {
            props: {
                videos: videos || [],
                categoryName,
            },
        };
    } catch (error) {
        console.error('Failed to fetch videos by category:', error);
        return {
            props: {
                videos: [],
                categoryName: params.category,
            },
        };
    }
}

export default function CategoryPage({ videos, categoryName }) {
    const title = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');

    return (
        <div className="bg-gray-900 min-h-screen text-gray-100 p-8 font-sans">
            <Head>
                <title>{title}</title>
            </Head>
            <header className="flex justify-between items-center mb-10">
                <Link href="/" className="text-3xl font-bold text-white tracking-wide">
                    Video Saya
                </Link>
                <nav>
                    <Link href="/categories" className="text-gray-400 hover:text-white transition duration-300">
                        Kategori
                    </Link>
                </nav>
            </header>
            <main>
                <h1 className="text-3xl font-bold mb-6 text-white">{title}</h1>
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
            </main>
        </div>
    );
}
