// Ini adalah Next.js API Route.
// Next.js akan menjalankannya sebagai serverless function.

// Fungsi ini akan menangani permintaan ke /api/search
export default async function handler(req, res) {
    // Periksa metode HTTP, hanya izinkan GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Ambil keyword dari query string
        const { keyword } = req.query;

        // Pastikan keyword ada
        if (!keyword) {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        // --- Ini adalah kode dari Worker Anda, digabungkan di sini ---
        // Anda perlu memastikan D1 Database Anda terikat dengan benar ke proyek Next.js Anda di Cloudflare Pages
        // Biasanya ini dilakukan di dashboard Cloudflare Pages, di bagian "Settings" > "Functions"
        
        // PENTING: Nama binding database harus sama dengan yang Anda konfigurasikan di Cloudflare Pages.
        // Asumsi: binding-nya adalah 'DB'
        
        const { DB } = process.env;

        if (!DB) {
            console.error('D1 Database binding (DB) is not configured.');
            return res.status(500).json({ error: 'Database configuration error.' });
        }

        // Lakukan pencarian di D1 Database
        const { results: videos } = await DB.prepare('SELECT slug, title, thumbnailUrl, authorName FROM videos WHERE title LIKE ? ORDER BY publishedAt DESC')
            .bind(`%${keyword}%`)
            .all();

        // Kirim hasil pencarian
        return res.status(200).json({ videos: videos || [] });

    } catch (error) {
        console.error('Error in search API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
