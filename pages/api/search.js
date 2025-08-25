export const runtime = 'edge';

export default async function handler(request) {
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
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
