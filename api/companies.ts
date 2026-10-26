import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.VITE_INSFORGE_URL || process.env.INSFORGE_URL || 'https://vdkvb6uy.ap-southeast.insforge.app';
const insforgeKey = process.env.INSFORGE_SERVICE_KEY || process.env.VITE_INSFORGE_KEY || 'ik_b97a7fab26dfb80bab9dcb52753d9e4d';

const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey
});

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    try {
      const { data, error } = await insforge.database
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ companies: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch companies' });
    }
  }

  if (req.method === 'POST') {
    // Admin check: Require Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
    }

    const { name, slug, logo_url, official_careers_url, description } = req.body || {};
    if (!name || !slug) {
      return res.status(400).json({ error: 'Missing required fields: name and slug' });
    }

    try {
      const { data, error } = await insforge.database
        .from('companies')
        .insert({
          name: name.trim(),
          slug: slug.toLowerCase().trim(),
          logo_url: logo_url || null,
          official_careers_url: official_careers_url || null,
          description: description || null
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(201).json({ company: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to create company' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
