// PENTING: Deklarasi untuk Edge Runtime
export const runtime = 'edge';

// Handler untuk Next.js API Route
export default async function handler(request) {
    // Hanya izinkan metode GET
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');

        if (!keyword) {
            return new Response(JSON.stringify({ error: 'Keyword is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const DB = process.env.DB;

        if (!DB) {
            return new Response(JSON.stringify({ error: 'Database configuration error.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Periksa apakah tabel `videos` ada
        const tableCheck = await DB.prepare("PRAGMA table_info(videos)").all();
        if (tableCheck.results.length === 0) {
            return new Response(JSON.stringify({ error: 'Table "videos" does not exist.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Jalankan query pencarian
        const { results: videos } = await DB.prepare('SELECT slug, title, thumbnailUrl, authorName FROM videos WHERE title LIKE ? ORDER BY publishedAt DESC')
            .bind(`%${keyword}%`)
            .all();

        return new Response(JSON.stringify({ videos: videos || [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // PERBAIKAN: Kirim pesan error yang lebih detail ke client
        console.error('API Error:', error.stack);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
