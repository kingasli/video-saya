import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useState, useEffect } from 'react';

// GANTI DENGAN URL WORKER AKUN B
const API_URL = 'https://kitacoba.kingkep123.workers.dev';
const VIDEOS_PER_PAGE = 9;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari API
  async function fetchVideos(page) {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/videos?page=${page}`);
      const data = await res.json();
      
      setVideos(data.videos || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }

  // Ambil data pertama kali saat komponen dimuat
  useEffect(() => {
    fetchVideos(1);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Video Saya</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="text-center text-white py-10">
          Memuat video...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Video Saya</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Konten halaman */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
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
            <button 
              key={i + 1} 
              onClick={() => fetchVideos(i + 1)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 
                ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Layout>
  );
}

// Hapus getServerSideProps karena kita akan mengambil data di sisi klien
// export async function getServerSideProps...
