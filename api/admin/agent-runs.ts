import { createClient } from '@insforge/sdk';
import { ResumeLibraryAgent } from '../src/services/resumeLibraryAgent';

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
        .from('agent_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ runs: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch agent runs' });
    }
  }

  if (req.method === 'POST') {
    // Trigger agent run
    try {
      const result = await ResumeLibraryAgent.runDiscovery('manual');
      return res.status(200).json({ message: 'Agent discovery completed', run: result });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Agent run failed' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
