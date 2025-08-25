import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';

// Mengaktifkan Edge Runtime agar getServerSideProps bisa berjalan di Cloudflare Pages
export const runtime = 'experimental-edge';

export async function getServerSideProps({ params }) {
    try {
        const res = await fetch(`${API_URL}/api/videos/${params.slug}`);
        const video = await res.json();

        if (!video || Object.keys(video).length === 0) {
            return { notFound: true };
        }

        return {
            props: {
                video,
            },
        };
    } catch (error) {
        console.error('Gagal mengambil data video:', error);
        return { notFound: true };
    }
}

export default function VideoPage({ video }) {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!video) {
        return <div>Video tidak ditemukan.</div>;
    }

    const {
        title,
        embedUrl,
        thumbnailUrl,
        duration,
        categories,
        publishedAt,
        downloadUrl,
    } = video;

    const tanggal = new Date(publishedAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const [minutes, seconds] = duration.split(':');
    const durasiFormatted = `${minutes} : ${seconds}`;

    return (
        <div style={{ backgroundColor: '#181818', minHeight: '100vh', color: '#fff', padding: '20px' }}>
            <Head>
                <title>{title}</title>
            </Head>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000' }}>
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        ></iframe>
                    ) : thumbnailUrl ? (
                        <img src={thumbnailUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#999' }}>
                            Tidak ada media
                        </div>
                    )}
                </div>
                <h1 style={{ marginTop: '20px', marginBottom: '5px' }}>{title}</h1>
                <p style={{ color: '#999', marginBottom: '10px' }}>
                    Tanggal: {tanggal} - Durasi: {durasiFormatted} -{' '}
                    {downloadUrl && (
                        <Link href={downloadUrl} style={{ color: '#3498db', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                            Download
                        </Link>
                    )}
                </p>
                <div style={{ marginBottom: '15px' }}>
                    {categories && categories.map((cat) => (
                        <Link key={cat} href={`/categories/${cat}`} style={{ display: 'inline-block', backgroundColor: '#333', color: '#fff', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', borderRadius: '5px', textDecoration: 'none' }}>
                            {cat}
                        </Link>
                    ))}
                </div>
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ marginBottom: '15px' }}>Video Terkait</h2>
                    <div>Belum ada video terkait.</div>
                </div>
            </div>
        </div>
    );
}