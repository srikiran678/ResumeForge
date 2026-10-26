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
      const { company, role, level, search, status } = req.query || {};

      let query = insforge.database
        .from('templates')
        .select(`
          *,
          template_companies ( company_id, companies (*) ),
          template_roles ( role_id, roles (*) ),
          template_sources (*)
        `);

      const pubStatus = status || 'published';
      if (pubStatus !== 'all') {
        query = query.eq('publication_status', pubStatus);
      }

      const { data, error } = await query;
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      let results = (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        layout_style: t.layout_style,
        experience_level: t.experience_level,
        publication_status: t.publication_status,
        preview_url: t.preview_url,
        asset_url: t.asset_url,
        template_data: t.template_data,
        companies: t.template_companies?.map((tc: any) => tc.companies).filter(Boolean) || [],
        roles: t.template_roles?.map((tr: any) => tr.roles).filter(Boolean) || [],
        source: t.template_sources?.[0] || null,
        created_at: t.created_at,
        updated_at: t.updated_at
      }));

      // In-memory filter on joins if query params supplied
      if (company && company !== 'all') {
        results = results.filter((t: any) => t.companies?.some((c: any) => c.slug === company));
      }
      if (role && role !== 'all') {
        results = results.filter((t: any) => t.roles?.some((r: any) => r.category === role || r.title === role));
      }
      if (level && level !== 'all') {
        results = results.filter((t: any) => t.experience_level.toLowerCase().includes(String(level).toLowerCase()));
      }
      if (search && String(search).trim()) {
        const q = String(search).toLowerCase();
        results = results.filter((t: any) => 
          t.name.toLowerCase().includes(q) || 
          (t.description && t.description.toLowerCase().includes(q))
        );
      }

      return res.status(200).json({ templates: results });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch templates' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
