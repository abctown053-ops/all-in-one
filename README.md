# CourseHub Mobile

A professional, mobile-first course and feature aggregator application optimized for Android and iOS WebView environments.

## Features

- **Mobile-Only UI**: Strictly optimized for mobile screens with a fixed bottom navigation bar.
- **Course Management**: Categorized courses (YouTube, Facebook, Instagram, TikTok) with detailed views.
- **Feature Content**: Specialized sections for Video Bundles and Editing Materials.
- **Ad Management**: Integrated Interstitial and Banner ad placeholders with skip logic.
- **Admin Panel**: Secure management dashboard for courses, features, and ads.
- **Link Generation**: Secure link generation process with ad-gate and one-click copy functionality.

## Tech Stack

- **React 19**: Modern UI library.
- **TypeScript**: Type-safe development.
- **Tailwind CSS 4.0**: Utility-first styling with mobile-specific optimizations.
- **Motion**: Fluid animations and transitions.
- **Lucide React**: Crisp, consistent iconography.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/coursehub-mobile.git
   cd coursehub-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

The application is a Single Page Application (SPA). You can deploy the `dist` folder to any static hosting service like GitHub Pages, Vercel, or Netlify.

### GitHub Pages Deployment

1. Install the `gh-pages` package:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Add deployment scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Run the deployment command:
   ```bash
   npm run deploy
   ```

## Admin Credentials

- **Email**: `admin@app.com`
- **Password**: `Naeemullah12`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
