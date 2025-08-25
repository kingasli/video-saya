import Head from 'next/head';
import Link from 'next/link';

// BARIS INI DITAMBAHKAN UNTUK MEMASTIKAN HALAMAN UTAMA BEKERJA DENGAN BENAR DI CLOUDFLARE PAGES
export const runtime = 'experimental-edge';

// GANTI URL INI DENGAN ALAMAT GUDANG (WORKER) ANDA DI AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

export async function getStaticProps() {
    const res = await fetch(`${API_URL}/api/videos`);
    const { videos } = await res.json();

    return {
        props: {
            videos,
        },
        revalidate: 60,
    };
}

export default function HomePage({ videos }) {
    return (
        <div>
            <Head>
                <title>Toko Video Saya</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Video Terbaru</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.slug} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                            <Link href={`/view/${video.slug}`}>
                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover" />
                            </Link>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    <Link href={`/view/${video.slug}`}>
                                        {video.title}
                                    </Link>
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}