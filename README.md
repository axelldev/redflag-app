# Red Flag Analyzer

An AI-powered mobile app that analyzes Twitter/X profile screenshots to detect potential red flags using Claude's vision capabilities.

## What It Does

Upload a screenshot of any Twitter/X profile and get an instant AI analysis that identifies potential red flags across multiple categories:

- **CEO/Founder Posturing**: Excessive title dropping, serial entrepreneur claims
- **TechBro Culture**: Hustle culture, grindset mentions, overnight success claims
- **AI Hype**: Excessive AI enthusiasm without substance
- **AI Artist**: AI-generated art advocacy, anti-traditional art stance
- **NFT/Crypto**: NFT promotions, crypto shilling, unrealistic gains
- **Scammer Indicators**: Unrealistic promises, urgency tactics
- **Indie Hacker**: Excessive "building in public", revenue screenshot bragging
- **Tech Tuber**: Clickbait language, dramatic claims

Each detected red flag includes severity level, specific evidence from the profile, and analysis explaining why it's concerning.

## Tech Stack

- **React Native** with Expo
- **TypeScript** (strict mode)
- **Expo Router** for file-based routing
- **Anthropic Claude API** (Sonnet 4.5) with vision and structured outputs
- Cross-platform support: iOS, Android, and Web

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables:

   Create a `.env` file in the root directory:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Run on your preferred platform:

   ```bash
   npm run ios       # iOS simulator
   npm run android   # Android emulator
   npm run web       # Web browser
   ```

## How It Works

1. **Upload**: Take a photo, choose from your library, or paste from clipboard
2. **Analyze**: The image is sent to Claude's vision API with a structured analysis prompt
3. **Review**: Get a detailed breakdown of red flags with an overall risk score (0-100)

The app uses Claude's structured outputs feature to ensure consistent, validated JSON responses with two-phase validation:
- Phase 1: Verify the image is actually a Twitter/X profile
- Phase 2: Analyze profile content for red flags if valid

## Project Structure

```
src/
├── app/
│   ├── index.tsx          # Main screen
│   └── analyze+api.ts     # API route for Claude integration
├── components/            # UI components
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
└── constants/            # App constants
```

See [CLAUDE.md](./CLAUDE.md) for detailed architectural documentation.
