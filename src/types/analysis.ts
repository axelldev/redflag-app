export interface RedFlag {
  category: 'CEO' | 'TechBro' | 'AI Bro' | 'AI Artist' | 'NFT' | 'Crypto' | 'Scammer' | 'Indie Hacker' | 'Tech Tuber';
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  analysis: string;
}

export interface AnalysisResponse {
  isValid: boolean;
  validationMessage: string;
  redFlags: RedFlag[];
  overallScore: number;
  summary: string;
}
