import React from 'react';
import { PersonalInfo } from '../../types';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personalInfo, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <div className="bg-white border border-forge-200 rounded-xl p-6 shadow-sm text-left">
      <div className="border-b border-forge-100 pb-3 mb-5">
        <h2 className="text-base font-bold text-forge-900">Personal Information</h2>
        <p className="text-xs text-forge-500">Your core contact details and high-level professional headline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Full Legal / Professional Name *</label>
          <input
            type="text"
            required
            value={personalInfo.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="e.g. Alex Morgan"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Headline / Target Label</label>
          <input
            type="text"
            value={personalInfo.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="e.g. Computer Science Student | Backend Developer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={personalInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="name@university.edu"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={personalInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Location (City, State / Country)</label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="e.g. Seattle, WA, USA"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">Personal Website / Portfolio</label>
          <input
            type="url"
            value={personalInfo.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="https://yourdomain.dev"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={personalInfo.linkedIn}
            onChange={(e) => handleChange('linkedIn', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forge-700 mb-1">GitHub URL</label>
          <input
            type="url"
            value={personalInfo.github}
            onChange={(e) => handleChange('github', e.target.value)}
            className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold text-forge-700 mb-1">Summary / Career Objective</label>
        <textarea
          rows={3}
          value={personalInfo.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          className="w-full text-xs p-2.5 border border-forge-200 rounded-lg focus:ring-2 focus:ring-forge-900 focus:outline-none"
          placeholder="Brief 2-3 sentence overview of your technical foundations, academic focus, and passions."
        />
      </div>
    </div>
  );
};
