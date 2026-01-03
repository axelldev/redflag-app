import { AnalysisResponse, RedFlag } from '@/types/analysis';

export const mockRedFlags: RedFlag[] = [
  {
    category: 'CEO',
    severity: 'medium',
    evidence: 'Profile mentions being "Founder & CEO" of 5 different startups',
    analysis: 'Excessive title dropping and serial entrepreneurship claims may indicate CEO posturing',
  },
  {
    category: 'AI Bro',
    severity: 'high',
    evidence: 'Bio includes "Building the future with AI" and multiple AI-related hashtags',
    analysis: 'Heavy AI hype language without substantial technical content',
  },
  {
    category: 'Crypto',
    severity: 'low',
    evidence: 'Occasional mentions of Web3 in retweets',
    analysis: 'Minimal crypto engagement, not a primary focus',
  },
];

export const validAnalysisResponse: AnalysisResponse = {
  isValid: true,
  validationMessage: 'Valid X/Twitter profile detected',
  redFlags: mockRedFlags,
  overallScore: 45,
  summary:
    'Moderate concerns detected. Profile shows some CEO posturing and AI hype culture, but nothing extreme. Overall risk level is medium.',
};

export const invalidAnalysisResponse: AnalysisResponse = {
  isValid: false,
  validationMessage: 'This does not appear to be a valid X/Twitter profile screenshot',
  redFlags: [],
  overallScore: 0,
  summary: '',
};

export const cleanProfileResponse: AnalysisResponse = {
  isValid: true,
  validationMessage: 'Valid X/Twitter profile detected',
  redFlags: [],
  overallScore: 10,
  summary: 'Clean profile with no significant red flags detected. Normal, authentic usage patterns.',
};

export const highRiskProfileResponse: AnalysisResponse = {
  isValid: true,
  validationMessage: 'Valid X/Twitter profile detected',
  redFlags: [
    {
      category: 'Scammer',
      severity: 'high',
      evidence: 'Multiple promises of guaranteed returns and "DM for info" messages',
      analysis: 'Classic scam patterns with financial promises and requests for direct contact',
    },
    {
      category: 'Crypto',
      severity: 'high',
      evidence: 'Constant promotion of pump-and-dump coins and NFT projects',
      analysis: 'Aggressive cryptocurrency promotion with get-rich-quick messaging',
    },
    {
      category: 'NFT',
      severity: 'high',
      evidence: 'Profile picture is an NFT, bio mentions multiple NFT projects',
      analysis: 'Heavy NFT involvement and promotion',
    },
  ],
  overallScore: 85,
  summary:
    'High risk profile with multiple severe red flags. Strong indicators of scam behavior and cryptocurrency promotion.',
};

export const mediumRiskProfileResponse: AnalysisResponse = {
  isValid: true,
  validationMessage: 'Valid X/Twitter profile detected',
  redFlags: [
    {
      category: 'TechBro',
      severity: 'medium',
      evidence: 'Frequent use of terms like "disruption", "10x", and "hustle culture"',
      analysis: 'Moderate tech bro culture indicators',
    },
    {
      category: 'Indie Hacker',
      severity: 'low',
      evidence: 'Bio mentions building in public and indie hacking',
      analysis: 'Light indie hacker culture, not concerning',
    },
  ],
  overallScore: 35,
  summary: 'Some tech culture indicators present but not extreme. Medium-low risk level.',
};
