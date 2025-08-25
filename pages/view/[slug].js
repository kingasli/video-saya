import Head from 'next/head';
import { useRouter } from 'next/router';

// GANTI URL INI DENGAN ALAMAT GUDANG (WORKER) ANDA DI AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev'

// Gunakan 'edge' atau 'experimental-edge' untuk mengaktifkan Edge Runtime
export const runtime = 'experimental-edge'; 

// Menggunakan getServerSideProps untuk mengambil data saat permintaan masuk
export async function getServerSideProps({ params }) {
    try {
        const res = await fetch(`${API_URL}/api/videos/${params.slug}`);
        const video = await res.json();

        // Jika API mengembalikan data kosong atau tidak valid
        if (!video || Object.keys(video).length === 0) {
            return { notFound: true };
        }

        return {
            props: {
                video,
            },
        };
    } catch (error) {
        console.error('Failed to fetch video data:', error);
        return { notFound: true };
    }
}

export default function VideoPage({ video }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    // Tampilkan pesan jika data video tidak ada
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