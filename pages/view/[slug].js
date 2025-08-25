// Tambahkan baris ini di bagian paling atas file Anda
export const runtime = 'edge'; 

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

// GANTI URL INI DENGAN ALAMAT GUDANG (WORKER) ANDA DI AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev'

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
    // ... sisa kode di bawahnya
}