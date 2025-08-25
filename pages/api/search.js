// Penting: Deklarasi untuk Edge Runtime
export const runtime = 'edge';

// Handler utama untuk permintaan API
// Perbaikan: Gunakan `context` sebagai argumen kedua
export default async function handler(request, context) {
    // Pastikan metode permintaan adalah GET
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Ambil parameter pencarian dari URL
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword');

        // Jika keyword tidak ada, kembalikan error
        if (!keyword) {
            return new Response(JSON.stringify({ error: 'Keyword is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // Perbaikan: Akses D1 Database binding dari context.env
        // Ini adalah cara yang benar di Cloudflare Pages
        const DB = context.env.DB;

        // Periksa apakah binding D1 Database ada
        if (!DB) {
            return new Response(JSON.stringify({ error: 'Database configuration error: DB binding is missing.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Jalankan query SQL
        const { results: videos } = await DB.prepare('SELECT slug, title, thumbnailUrl, authorName FROM videos WHERE title LIKE ? ORDER BY publishedAt DESC')
            .bind(`%${keyword}%`)
            .all();

        // Kembalikan hasil dalam format JSON
        return new Response(JSON.stringify({ videos: videos || [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // Tangani error dengan memberikan pesan yang lebih jelas
        console.error('API Error:', error.stack);
        return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
