# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native/Expo mobile app that analyzes Twitter/X profile screenshots to detect potential "red flags" using Claude's vision API. The app uses AI to analyze profile content and categorize red flags across multiple dimensions (CEO posturing, tech bro culture, AI hype, crypto/NFT promotion, etc.).

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Run on specific platforms
npm run android   # Android emulator
npm run ios       # iOS simulator
npm run web       # Web browser

# Linting
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Expo (React Native) with file-based routing (Expo Router)
- **Language**: TypeScript with strict mode enabled
- **AI Integration**: Anthropic SDK with Claude Sonnet 4.5 using structured outputs
- **State Management**: React hooks (no global state library)

### Directory Structure

```
src/
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Main screen
│   └── analyze+api.ts     # API route for analysis
├── components/            # Reusable UI components
│   ├── results/          # Analysis results display components
│   └── [other UI components]
├── hooks/                # Custom React hooks
│   ├── useProfileAnalysis.ts  # API calls to analyze endpoint
│   └── useImageUpload.ts      # Image picker/camera/clipboard logic
├── types/                # TypeScript type definitions
│   └── analysis.ts       # Analysis response types
└── constants/            # App constants
    └── colors.ts         # Color palette
```

### Key Architectural Patterns

#### API Route Pattern
The app uses Expo Router's API routes feature (`+api.ts` files) to create serverless endpoints:
- `src/app/analyze+api.ts` exports a `POST` function that handles analysis requests
- The endpoint receives base64-encoded images and returns structured JSON using Claude's vision API
- Environment variables (like `ANTHROPIC_API_KEY`) are accessed via `process.env` on the API route side

#### Custom Hook Pattern
Business logic is extracted into custom hooks:
- `useProfileAnalysis`: Manages analysis state (loading, error, results) and calls the `/analyze` API endpoint
- `useImageUpload`: Handles image selection via camera, photo library, or clipboard with permission management

#### Component Composition
The main screen (`src/app/index.tsx`) is composed of:
1. Image upload UI (ImageUploadArea, ImageSourceButtons)
2. Analysis trigger (AnalyzeButton)
3. Loading/error states (LoadingIndicator, ErrorAlert)
4. Results display (AnalysisResults with nested result components)

#### Vision API Integration
The analysis flow uses Claude's structured outputs feature:
- Base64-encoded images are sent with a detailed analysis prompt
- JSON schema is enforced via `output_format` with `json_schema` type
- Response validation happens in two phases: (1) Check if image is a valid Twitter/X profile, (2) Analyze for red flags if valid
- Red flags are categorized by type, severity, evidence, and analysis

### Environment Configuration

Required environment variables (in `.env`):
- `ANTHROPIC_API_KEY`: API key for Claude

### Path Aliases

TypeScript is configured with path aliases:
- `@/*` maps to `src/*` (e.g., `@/components/Button` → `src/components/Button.tsx`)

## Platform-Specific Considerations

### iOS
- Requires camera and photo library permissions defined in `app.json` under `ios.infoPlist`
- Uses `expo-camera` and `expo-image-picker` with permission requests

### Android
- Requires CAMERA and READ_MEDIA_IMAGES permissions in `app.json`
- Edge-to-edge mode is enabled

### Web
- Configured for server-side rendering (`"output": "server"` in `app.json`)
- API routes work seamlessly in web mode

## Key Dependencies

- `@anthropic-ai/sdk`: Claude API integration with vision support
- `expo-camera`: Camera access for taking photos
- `expo-image-picker`: Image selection from library or camera
- `expo-clipboard`: Clipboard image paste functionality
- `expo-router`: File-based routing system
