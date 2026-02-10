# Mystery Mail Archive

A mysterious archive application that generates and displays cryptic case files from the 1970s. Explore classified documents, witness statements, and evidence from unsolved investigations.

![Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Features

- **Retro Archive Interface**: Navigate through a vintage filing cabinet system with categories for Emails, Statements, and Evidence
- **AI-Generated Mysteries**: Click "Archives" to generate new cryptic case files using Google Gemini AI
- **Immersive UI**: Dark, suspenseful design with retro terminal aesthetics
- **Case File Viewer**: Detailed popup view for each document with sender, recipient, date, and content
- **Real-time Status**: Live system status indicators showing latency, signal strength, and encryption status

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google GenAI** - AI content generation (Gemini 3 Flash)
- **Tailwind CSS** - Styling (via utility classes)

## Prerequisites

- Node.js 18 or higher
- A Google Gemini API key

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mystery-mail-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Project Structure

```
mystery-mail-archive/
├── components/
│   ├── Cabinet.tsx          # File cabinet navigation
│   ├── Corkboard.tsx        # Main corkboard display
│   ├── LetterPopup.tsx      # Case file detail view
│   └── TopNav.tsx           # Top navigation bar
├── services/
│   └── gemini.ts            # AI content generation
├── App.tsx                  # Main application component
├── types.ts                 # TypeScript type definitions
├── index.tsx                # Application entry point
└── metadata.json           # Project metadata
```

## AI Features

The application uses Google Gemini AI to:

- **Generate Mystery Content**: Creates cryptic emails, police statements, and evidence reports based on random topics
- **Decrypt Redacted Text**: Provides chilling interpretations of redacted information
- **Scene Reconstruction**: Generates visual prompts for video reconstructions of crime scenes

## License

Private project - All rights reserved.
