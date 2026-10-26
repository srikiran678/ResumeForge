import { ResumeLibraryAgent } from '../../src/services/resumeLibraryAgent';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  // Verify CRON_SECRET if configured on Vercel
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
  }

  try {
    const runResult = await ResumeLibraryAgent.runDiscovery('cron');
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      run: runResult
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Scheduled discovery cycle failed'
    });
  }
}
