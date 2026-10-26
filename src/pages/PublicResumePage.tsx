import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Copy, Check, Lock, Globe } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ResumeDocument, downloadResumePDF } from '@/modules/templates';

export const PublicResumePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { publicLinks, resumes } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const publicLink = publicLinks.find((l) => l.slug === slug);
  const resume = publicLink ? resumes.find((r) => r.id === publicLink.resumeId) : resumes[0];

  if (!publicLink || publicLink.accessType === 'private' || !publicLink.isPublic) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-forge-200 shadow-xl max-w-md w-full text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-forge-900">Private or Revoked Resume Link</h1>
          <p className="text-xs text-forge-500">
            This public link has been set to private, revoked by the author, or does not exist.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="px-4 py-2 bg-forge-900 text-white rounded-lg text-xs font-semibold hover:bg-forge-800"
            >
              Go to ResumeForge Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!resume) return;
    setIsDownloading(true);
    try {
      await downloadResumePDF(resume);
    } catch {
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-forge-100 py-8 px-4 text-left">
      {/* Public Bar */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl border border-forge-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-3 no-print">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <div>
            <div className="text-xs font-bold text-forge-900">Verified Public Resume</div>
            <div className="text-[11px] text-forge-500">Slug: /r/{slug} (Read-only real text)</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-white border border-forge-300 text-forge-700 hover:bg-forge-50 rounded-lg shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold bg-forge-900 text-white hover:bg-forge-800 rounded-lg shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Generating...' : 'Download Vector PDF'}</span>
          </button>
        </div>
      </div>

      {/* Real Selectable Resume Document */}
      <div className="max-w-4xl mx-auto shadow-2xl rounded-sm overflow-hidden bg-white">
        {resume && <ResumeDocument resume={resume} scale={1} />}
      </div>
    </div>
  );
};
