export type Platform = 'X' | 'Instagram' | 'LinkedIn' | 'Facebook' | 'TikTok' | 'Other' | 'Unknown';
export type ContentType = 'profile' | 'post';

export interface RedFlag {
  category: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  analysis: string;
}

export interface AnalysisResponse {
  isValid: boolean;
  platform: Platform;
  contentType: ContentType;
  validationMessage: string;
  redFlags: RedFlag[];
  overallScore: number;
  summary: string;
}
