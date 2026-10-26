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
        .from('templates')
        .select(`
          *,
          template_companies ( company_id, companies (*) ),
          template_roles ( role_id, roles (*) ),
          template_sources (*)
        `)
        .eq('publication_status', 'pending_review')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ pendingTemplates: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch pending queue' });
    }
  }

  if (req.method === 'POST') {
    const { templateId, decision, notes } = req.body || {};
    if (!templateId || !decision) {
      return res.status(400).json({ error: 'Missing templateId or decision (approved/rejected)' });
    }

    const newStatus = decision === 'approved' ? 'published' : 'rejected';

    try {
      // 1. Update template status
      const { error: tmplError } = await insforge.database
        .from('templates')
        .update({ publication_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', templateId);

      if (tmplError) {
        return res.status(500).json({ error: tmplError.message });
      }

      // 2. Record review audit record
      await insforge.database
        .from('template_reviews')
        .insert({
          template_id: templateId,
          decision,
          notes: notes || null,
          reviewed_at: new Date().toISOString()
        });

      return res.status(200).json({ message: `Template ${templateId} ${newStatus} successfully` });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Review action failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
