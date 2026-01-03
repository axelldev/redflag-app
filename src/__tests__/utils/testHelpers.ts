import { AnalysisResponse } from '@/types/analysis';

// Mock base64 image data (shortened for tests)
export const mockBase64Image =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Helper to create mock image picker results
export const createMockImageResult = (canceled = false, base64?: string) => ({
  canceled,
  assets: canceled
    ? []
    : [
        {
          uri: 'file:///test-image.jpg',
          base64: base64 || mockBase64Image,
          width: 1080,
          height: 1920,
        },
      ],
});

// Helper to create mock fetch response
export const mockFetchResponse = (data: AnalysisResponse, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  json: async () => data,
});

// Helper to create mock Request object
export const createMockRequest = (body: Record<string, any>) =>
  new Request('http://localhost/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

// Helper to wait for async state updates
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to create mock clipboard data
export const mockClipboardData = {
  data: mockBase64Image,
};
