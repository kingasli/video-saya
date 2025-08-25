import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';
const VIDEOS_PER_PAGE = 16;

export const runtime = 'experimental-edge';

export async function getServerSideProps({ query }) {
    const page = parseInt(query.page) || 1;
    const offset = (page - 1) * VIDEOS_PER_PAGE;

    try {
        const res = await fetch(`${API_URL}/api/videos?limit=${VIDEOS_PER_PAGE}&offset=${offset}`);
        const data = await res.json();
        
        const videos = data.videos || [];
        const totalCount = data.totalCount || 0;
        const totalPages = Math.ceil(totalCount / VIDEOS_PER_PAGE);

        return {
            props: {
                videos,
                totalPages,
                currentPage: page,
            },
        };
    } catch (error) {
        console.error('Failed to fetch videos:', error);
        return {
            props: {
                videos: [],
                totalPages: 1,
                currentPage: 1,
            },
        };
    }
}

export default function Home({ videos, totalPages, currentPage }) {
    return (
        <Layout>
            <Head>
                <title>Video Saya</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Link 
                            key={i + 1} 
                            href={`/?page=${i + 1}`} 
                            className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 
                                ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'}`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </Layout>
    );
}