import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useProfileAnalysis } from '../useProfileAnalysis';
import { validAnalysisResponse } from '@/__tests__/fixtures/analysisResponses';
import { mockBase64Image } from '@/__tests__/utils/testHelpers';

describe('useProfileAnalysis', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useProfileAnalysis());

    expect(result.current.analysis).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful analysis', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => validAnalysisResponse,
    });

    const { result } = renderHook(() => useProfileAnalysis());

    act(() => {
      result.current.analyzeProfile(mockBase64Image);
    });

    // Should set loading to true immediately
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for async operation to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.analysis).toEqual(validAnalysisResponse);
    expect(result.current.error).toBeNull();
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProfileAnalysis());

    await act(async () => {
      await result.current.analyzeProfile(mockBase64Image);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Failed to analyze profile. Please try again.');
    expect(result.current.analysis).toBeNull();
  });

  it('should handle non-ok responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useProfileAnalysis());

    await act(async () => {
      await result.current.analyzeProfile(mockBase64Image);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Failed to analyze profile. Please try again.');
    expect(result.current.analysis).toBeNull();
  });

  it('should clear error before new analysis', async () => {
    // First request fails
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProfileAnalysis());

    await act(async () => {
      await result.current.analyzeProfile(mockBase64Image);
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());

    // Second request succeeds
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => validAnalysisResponse,
    });

    await act(async () => {
      await result.current.analyzeProfile(mockBase64Image);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.analysis).toEqual(validAnalysisResponse);
  });

  it('should send correct request format', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => validAnalysisResponse,
    });

    const { result } = renderHook(() => useProfileAnalysis());
    const testImage = 'testBase64ImageData';

    await act(async () => {
      await result.current.analyzeProfile(testImage);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(global.fetch).toHaveBeenCalledWith('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: testImage,
        mediaType: 'image/jpeg',
      }),
    });
  });

  it('should clear analysis and error', () => {
    const { result } = renderHook(() => useProfileAnalysis());

    // Manually trigger state changes (simulating previous analysis)
    act(() => {
      result.current.clearAnalysis();
    });

    expect(result.current.analysis).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle multiple sequential calls', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => validAnalysisResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...validAnalysisResponse, overallScore: 75 }),
      });

    const { result } = renderHook(() => useProfileAnalysis());

    // First call
    await act(async () => {
      await result.current.analyzeProfile('image1');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.analysis?.overallScore).toBe(45);

    // Second call
    await act(async () => {
      await result.current.analyzeProfile('image2');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.analysis?.overallScore).toBe(75);
  });

  it('should set loading to false even when error occurs', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

    const { result } = renderHook(() => useProfileAnalysis());

    await act(async () => {
      await result.current.analyzeProfile(mockBase64Image);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isLoading).toBe(false);
  });
});
