import { POST } from '../analyze+api';
import Anthropic from '@anthropic-ai/sdk';
import {
  validAnalysisResponse,
  invalidAnalysisResponse,
  cleanProfileResponse,
} from '@/__tests__/fixtures/analysisResponses';
import { mockBase64Image, createMockRequest } from '@/__tests__/utils/testHelpers';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk');

describe('POST /analyze', () => {
  let mockCreate: jest.Mock;
  let MockedAnthropic: jest.MockedClass<typeof Anthropic>;

  beforeEach(() => {
    // Set up the mock for each test
    mockCreate = jest.fn();
    MockedAnthropic = Anthropic as jest.MockedClass<typeof Anthropic>;
    MockedAnthropic.mockImplementation(
      () =>
        ({
          beta: {
            messages: {
              create: mockCreate,
            },
          },
        }) as any
    );

    // Set mock environment variable
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.ANTHROPIC_API_KEY;
  });

  it('should return 400 when image is missing', async () => {
    const request = createMockRequest({});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Image data is required');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should analyze valid image successfully', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(validAnalysisResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
      mediaType: 'image/jpeg',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(validAnalysisResponse);
    expect(data.isValid).toBe(true);
    expect(data.overallScore).toBe(45);
  });

  it('should handle invalid profile screenshot', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(invalidAnalysisResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
      mediaType: 'image/jpeg',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.isValid).toBe(false);
    expect(data.validationMessage).toBe(
      'This does not appear to be a valid X/Twitter profile screenshot'
    );
  });

  it('should handle clean profile with no red flags', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(cleanProfileResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
      mediaType: 'image/jpeg',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.redFlags).toEqual([]);
    expect(data.overallScore).toBe(10);
  });

  it('should handle Anthropic API errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API rate limit exceeded'));

    const request = createMockRequest({
      image: mockBase64Image,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to analyze image');
    expect(data.details).toBe('API rate limit exceeded');
  });

  it('should handle JSON parsing errors', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: 'invalid json{',
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to parse analysis results');
    expect(data.details).toBe('invalid json{');
  });

  it('should call Anthropic with correct parameters', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(validAnalysisResponse),
        },
      ],
    });

    const testImage = 'testBase64ImageData';
    const testMediaType = 'image/png';

    const request = createMockRequest({
      image: testImage,
      mediaType: testMediaType,
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-sonnet-4-5',
        betas: ['structured-outputs-2025-11-13'],
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: testMediaType,
                  data: testImage,
                },
              },
              {
                type: 'text',
                text: expect.stringContaining('Phase 1: Validation'),
              },
            ],
          },
        ],
        output_format: expect.objectContaining({
          type: 'json_schema',
        }),
      })
    );
  });

  it('should use default mediaType when not provided', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(validAnalysisResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
    });

    await POST(request);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          {
            role: 'user',
            content: expect.arrayContaining([
              expect.objectContaining({
                type: 'image',
                source: expect.objectContaining({
                  media_type: 'image/jpeg',
                }),
              }),
            ]),
          },
        ],
      })
    );
  });

  it('should include correct JSON schema in output_format', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(validAnalysisResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
    });

    await POST(request);

    const callArgs = mockCreate.mock.calls[0][0];
    const schema = callArgs.output_format.schema;

    expect(schema.type).toBe('object');
    expect(schema.properties).toHaveProperty('isValid');
    expect(schema.properties).toHaveProperty('validationMessage');
    expect(schema.properties).toHaveProperty('redFlags');
    expect(schema.properties).toHaveProperty('overallScore');
    expect(schema.properties).toHaveProperty('summary');
  });

  it('should initialize Anthropic with API key from environment', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify(validAnalysisResponse),
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
    });

    await POST(request);

    expect(MockedAnthropic).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
    });
  });

  it('should handle non-text content in Anthropic response', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'not-text',
        },
      ],
    });

    const request = createMockRequest({
      image: mockBase64Image,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to parse analysis results');
  });

  it('should handle Error objects in catch block', async () => {
    const errorMessage = 'Custom error message';
    mockCreate.mockRejectedValueOnce(new Error(errorMessage));

    const request = createMockRequest({
      image: mockBase64Image,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to analyze image');
    expect(data.details).toBe(errorMessage);
  });

  it('should handle non-Error objects in catch block', async () => {
    mockCreate.mockRejectedValueOnce('string error');

    const request = createMockRequest({
      image: mockBase64Image,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to analyze image');
    expect(data.details).toBe('Unknown error');
  });
});
