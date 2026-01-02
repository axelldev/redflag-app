import Anthropic from "@anthropic-ai/sdk";

const ANALYSIS_PROMPT = `You are analyzing a screenshot to determine if it's an X profile and identify potential red flags.

**Phase 1: Validation**
First, verify this is a valid X profile screenshot. Check for:
- Profile photo (circular avatar)
- Username with @ handle
- Bio/description section
- X UI elements (follow button, profile layout, etc.)

If this is NOT an X profile screenshot, return:
{
  "isValid": false,
  "validationMessage": "Explain what the image shows instead",
  "redFlags": [],
  "overallScore": 0,
  "summary": "Not a valid X profile screenshot"
}

**Phase 2: Red Flag Analysis** (only if valid)
If it IS an X profile, analyze the bio, display name, and visible content for these red flag categories:

1. **CEO/Founder Posturing**: Excessive title dropping, serial entrepreneur claims, "visionary" language
2. **TechBro**: Hustle culture, grindset mentions, "rise and grind", overnight success claims
3. **AI Bro**: Excessive AI hype, "AI will change everything", AI enthusiast without substance
4. **AI Artist**: AI-generated art advocacy, anti-traditional art stance, prompt engineering flex
5. **NFT**: NFT promotions, floor price mentions, JPEG references, ape/punk references
6. **Crypto**: Crypto shilling, "WAGMI", "to the moon", coin promotions, unrealistic gains
7. **Scammer**: Unrealistic promises, urgency tactics, guaranteed returns, too good to be true offers
8. **Indie Hacker**: Excessive "building in public", revenue screenshot bragging, SaaS obsession
9. **Tech Tuber**: Clickbait language, thumbnail-style profile pic, dramatic claims, "you won't believe"

For each red flag found, provide:
- category: exact match from above
- severity: "low" (minor indicators), "medium" (clear patterns), or "high" (extreme/multiple indicators)
- evidence: specific text or visual elements from the profile
- analysis: brief explanation of why it's a red flag

Calculate overallScore (0-100):
- 0-20: Clean profile, minimal concerns
- 21-40: Some minor red flags
- 41-60: Moderate concerns
- 61-80: Significant red flags
- 81-100: Major concerns, multiple severe red flags

Return ONLY valid JSON in this exact format:
{
  "isValid": true,
  "validationMessage": "Valid X profile",
  "redFlags": [
    {
      "category": "CEO",
      "severity": "medium",
      "evidence": "Bio says 'Serial Entrepreneur | Founder of 5 companies'",
      "analysis": "Excessive title dropping and founder claims without context"
    }
  ],
  "overallScore": 45,
  "summary": "Brief 1-2 sentence summary of the analysis"
}

Be honest and direct. Not all profiles will have red flags. If the profile seems genuine, say so with an overallScore of 0-20 and empty redFlags array.`;

export async function POST(request: Request) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const { image, mediaType } = await request.json();

    if (!image) {
      return Response.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const msg = await anthropic.beta.messages.create({
      model: "claude-sonnet-4-5",
      betas: ["structured-outputs-2025-11-13"],
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            {
              type: "text",
              text: ANALYSIS_PROMPT,
            },
          ],
        },
      ],
      output_format: {
        type: "json_schema",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            isValid: {
              type: "boolean",
            },
            validationMessage: {
              type: "string",
            },
            redFlags: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  category: {
                    type: "string",
                  },
                  severity: {
                    type: "string",
                  },
                  evidence: {
                    type: "string",
                  },
                  analysis: {
                    type: "string",
                  },
                },
              },
            },
            overallScore: {
              type: "number",
            },
            summary: { type: "string" },
          },
        },
      },
    } as const);

    const responseText =
      msg.content[0].type === "text" ? msg.content[0].text : "";

    let analysisResult;
    try {
      analysisResult = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse response:", responseText);
      return Response.json(
        {
          error: "Failed to parse analysis results",
          details: responseText,
        },
        { status: 500 }
      );
    }

    return Response.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
