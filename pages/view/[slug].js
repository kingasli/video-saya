import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// GANTI URL INI DENGAN ALAMAT GUDANG (WORKER) ANDA DI AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/api/videos`);
    const { videos } = await res.json();
    const paths = videos.map((video) => ({
        params: { slug: video.slug },
    }));

    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const res = await fetch(`${API_URL}/api/videos/${params.slug}`);
    const video = await res.json();

    if (!video) {
        return { notFound: true };
    }

    return {
        props: {
            video,
        },
        revalidate: 60,
    };
}

export default function VideoPage({ video }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Head>
                <title>{video.title}</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <Link href="/">
                    <a className="text-blue-500 hover:underline mb-4 inline-block">← Kembali ke Halaman Utama</a>
                </Link>
                <h1 className="text-4xl font-bold mt-4 mb-2">{video.title}</h1>
                <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                    <iframe
                        src={video.embedUrl}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
                {video.downloadUrl && (
                    <a href={video.downloadUrl} className="mt-4 inline-block text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Download Video</a>
                )}

                {video.relatedVideos && video.relatedVideos.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Video Terkait</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {video.relatedVideos.map((relatedVideo) => (
                                <div key={relatedVideo.slug} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
                                    <Link href={`/view/${relatedVideo.slug}`}>
                                        <img src={relatedVideo.thumbnailUrl} alt={relatedVideo.title} className="w-full h-32 object-cover" />
                                    </Link>
                                    <div className="p-2">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            <Link href={`/view/${relatedVideo.slug}`}>
                                                {relatedVideo.title}
                                            </Link>
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}