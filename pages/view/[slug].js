import Head from 'next/head';
import { useRouter } from 'next/router';

// GANTI URL INI DENGAN ALAMAT GUDANG (WORKER) ANDA DI AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev'

export const runtime = 'experimental-edge';

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

    if (!video || Object.keys(video).length === 0) {
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

    // Pastikan objek 'video' ada dan isinya tidak kosong
    if (!video) {
        return <div>Video tidak ditemukan.</div>;
    }

    return (
        <div>
            <Head>
                <title>{video.title}</title>
            </Head>
            <h1 style={{ textAlign: 'center' }}>{video.title}</h1>
            <p style={{ textAlign: 'center' }}>{video.slug}</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {video.embedUrl && (
                    <iframe
                        width="560"
                        height="315"
                        src={video.embedUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {video.thumbnailUrl && (
                    <img src={video.thumbnailUrl} alt={video.title} style={{ maxWidth: '100%', height: 'auto' }} />
                )}
            </div>
            
            <p style={{ textAlign: 'center' }}>Durasi: {video.duration}</p>
        </div>
    );
}