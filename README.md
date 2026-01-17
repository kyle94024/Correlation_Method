# Correlation Study

A beautiful, mobile-first web application for conducting correlational studies. Users answer optional survey questions and immediately see real-time correlation analysis visualized with stunning charts and insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **📱 Mobile-First Design**: Optimized for QR code scanning and phone usage
- **🎨 Modern UI**: Beautiful glassmorphism design with smooth animations
- **📊 Real-Time Analysis**: Instant Pearson correlation calculations
- **🔒 Duplicate Prevention**: Browser fingerprinting prevents multiple submissions
- **⚡ Vercel Ready**: Serverless architecture with Neon database
- **🌐 Responsive**: Works seamlessly on all devices

## 🖼️ Preview

The application displays:
1. **Survey Page**: 8 lifestyle questions with intuitive sliders
2. **Results Page**: Top 5 correlations ranked by strength with:
   - R values and R² statistics
   - Color-coded strength indicators
   - Plain-English interpretations
   - Sample size information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Neon](https://neon.tech) database account (free tier available)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd correlation-study
npm install
```

### 2. Set Up Neon Database

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy the connection string

### 3. Configure Environment

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### 4. Initialize Database

Run the Drizzle migration to create tables:

```bash
npm run db:push
```

This creates two tables:
- `survey_responses`: Stores anonymous survey data
- `correlation_cache`: Optional caching for computed correlations

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
correlation-study/
├── src/
│   ├── app/
│   │   ├── actions.ts      # Server actions (submit, get correlations)
│   │   ├── globals.css     # Global styles & Tailwind
│   │   ├── layout.tsx      # Root layout with fonts
│   │   └── page.tsx        # Main page
│   ├── components/
│   │   ├── SurveyForm.tsx      # Main form controller
│   │   ├── QuestionSlider.tsx  # Individual question UI
│   │   ├── CorrelationCard.tsx # Result card with stats
│   │   └── ResultsDisplay.tsx  # Results page layout
│   ├── config/
│   │   └── questions.ts    # Survey questions configuration
│   ├── db/
│   │   ├── index.ts        # Database connection
│   │   └── schema.ts       # Drizzle schema
│   ├── lib/
│   │   ├── correlation.ts  # Pearson correlation math
│   │   └── fingerprint.ts  # Device fingerprinting
│   └── types/
│       └── index.ts        # TypeScript definitions
├── drizzle.config.ts       # Drizzle ORM config
├── next.config.js          # Next.js config
├── tailwind.config.ts      # Tailwind with custom theme
└── package.json
```

## 🎯 How It Works

### Duplicate Prevention

The app uses multiple layers to prevent duplicate submissions:

1. **Browser Fingerprinting**: Generates a hash from:
   - Screen dimensions & color depth
   - Timezone
   - Language & platform
   - Canvas fingerprint
   - WebGL renderer info
   - Audio context sample rate

2. **Local Storage**: Quick check before server request

3. **Database Check**: Server-side verification

Users who've already submitted see the results page directly.

### Correlation Analysis

Uses Pearson correlation coefficient:

```
r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
```

Strength interpretation:
- **Strong**: |r| ≥ 0.7
- **Moderate**: |r| ≥ 0.4
- **Weak**: |r| ≥ 0.2
- **None**: |r| < 0.2

## 🚢 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deploy

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
4. Deploy!

### Vercel Environment Variables

```
DATABASE_URL=postgresql://...
```

## 🔧 Customization

### Adding/Modifying Questions

Edit `src/config/questions.ts`:

```typescript
export const QUESTIONS: QuestionConfig[] = [
  {
    key: 'newQuestion',      // Database column name
    label: 'Question Title',
    description: 'Help text for the question',
    lowLabel: 'Low end label',
    highLabel: 'High end label',
    icon: '🎯',
  },
  // ...
];
```

Then update the schema in `src/db/schema.ts` and run `npm run db:push`.

### Styling

The design uses:
- **Tailwind CSS** with custom theme in `tailwind.config.ts`
- **CSS Variables** in `globals.css`
- **Framer Motion** for animations

Key colors:
- `electric-cyan`: Primary accent (#00d4ff)
- `neon-mint`: Success/positive (#00ffa3)
- `coral-accent`: Negative/warning (#ff6b6b)
- `soft-violet`: Secondary accent (#8b5cf6)

## 📊 Database Schema

```sql
CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  fingerprint_hash TEXT NOT NULL,
  sleep_hours INTEGER,
  exercise_frequency INTEGER,
  stress_level INTEGER,
  screen_time INTEGER,
  social_activity INTEGER,
  productivity INTEGER,
  mood_rating INTEGER,
  caffeine_intake INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own studies!

## 🙏 Credits

- **Next.js** - React framework
- **Neon** - Serverless Postgres
- **Drizzle ORM** - Type-safe database queries
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Recharts** - (Optional) Data visualization
