import Anthropic from "@anthropic-ai/sdk";

const ANALYSIS_PROMPT = `You are analyzing a social media screenshot to detect potential red flags.

**Phase 1: Platform & Content Detection**
First, identify:
1. **Platform**: Which social media platform is this? (X, Instagram, LinkedIn, Facebook, TikTok, or Other)
   - Look for distinctive UI elements, branding, layout patterns
   - Examples: Instagram's circular story icons, LinkedIn's blue header, X's interface, Facebook's layout

2. **Content Type**: Is this a profile or a post?
   - Profile: Shows bio, username/handle, follower counts, profile picture
   - Post: Shows individual content (image/video/text) with likes, comments, shares

3. **Validation**: Is this a valid social media screenshot?
   - If NOT a social media screenshot, return:
     {
       "isValid": false,
       "platform": "Unknown",
       "contentType": "profile",
       "validationMessage": "Explain what the image shows instead",
       "redFlags": [],
       "overallScore": 0,
       "summary": "Not a valid social media screenshot"
     }

**Phase 2: Red Flag Analysis** (only if valid)
If it IS valid social media content, analyze the visible information for red flags.

**Dynamic Category Guidelines:**
You are NOT limited to predefined categories. Generate categories that accurately describe the red flags you observe. Common categories might include:

- **Professional Posturing**: CEO/Founder title dropping, serial entrepreneur claims, "visionary" language
- **Hustle Culture**: Grindset mentions, "rise and grind", overnight success claims, toxic productivity
- **AI Hype**: Excessive AI enthusiasm without substance, "AI will change everything" claims
- **Crypto/Web3**: Crypto shilling, NFT promotion, "WAGMI", "to the moon", unrealistic gains
- **Scammer Indicators**: Unrealistic promises, urgency tactics, guaranteed returns, too-good-to-be-true
- **Authenticity Issues**: Fake engagement patterns, purchased followers, bot-like behavior
- **Engagement Bait**: Deliberately provocative statements designed for engagement farming
- **MLM/Pyramid Schemes**: Multi-level marketing language, recruitment focus
- **Misinformation**: Conspiracy theories, false claims, misleading information
- **Toxic Behavior**: Harassment, hate speech, discriminatory content

**Create your own categories** if the red flags don't fit the above. Use clear, descriptive category names (2-4 words).

For each red flag found, provide:
- **category**: A clear, descriptive category name (can be custom)
- **severity**: "low" (minor indicators), "medium" (clear patterns), or "high" (extreme/multiple indicators)
- **evidence**: Specific text or visual elements from the content
- **analysis**: Brief explanation of why it's a red flag

**Scoring (0-100):**
- 0-20: Clean, minimal concerns
- 21-40: Some minor red flags
- 41-60: Moderate concerns
- 61-80: Significant red flags
- 81-100: Major concerns, multiple severe red flags

**Platform-Specific Considerations:**
- **LinkedIn**: Professional posturing may be more common and less concerning than on other platforms
- **Instagram**: Visual content, influencer culture, aesthetic focus
- **X**: Hot takes, engagement farming, quote-tweet culture
- **Facebook**: More personal, potential MLM activity
- **TikTok**: Short-form video content, trend participation

Return ONLY valid JSON in this exact format:
{
  "isValid": true,
  "platform": "Instagram",
  "contentType": "profile",
  "validationMessage": "Valid Instagram profile detected",
  "redFlags": [
    {
      "category": "Crypto Promotion",
      "severity": "high",
      "evidence": "Bio says 'DM for crypto tips 💎' and links to pump-and-dump groups",
      "analysis": "Aggressive cryptocurrency promotion with financial advice and direct messaging requests indicates potential scam activity"
    }
  ],
  "overallScore": 65,
  "summary": "Brief 1-2 sentence summary of the analysis"
}

Be honest and direct. Not all content will have red flags. If it seems genuine, say so with an overallScore of 0-20 and empty redFlags array.`;

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
            platform: {
              type: "string",
              enum: [
                "X",
                "Instagram",
                "LinkedIn",
                "Facebook",
                "TikTok",
                "Other",
                "Unknown",
              ],
            },
            contentType: {
              type: "string",
              enum: ["profile", "post"],
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
                    enum: ["low", "medium", "high"],
                  },
                  evidence: {
                    type: "string",
                  },
                  analysis: {
                    type: "string",
                  },
                },
                required: ["category", "severity", "evidence", "analysis"],
              },
            },
            overallScore: {
              type: "number",
            },
            summary: { type: "string" },
          },
          required: [
            "isValid",
            "platform",
            "contentType",
            "validationMessage",
            "redFlags",
            "overallScore",
            "summary",
          ],
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
