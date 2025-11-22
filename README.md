# Quranic Wird - Modern Quran Reader PWA

A modern, mobile-first Progressive Web App for reading the Quran with beautiful animations and dark mode support.

## Features

- 🌙 **Dark Mode by Default** - Optimized for comfortable reading
- 📱 **PWA Support** - Install as a mobile app on any device
- 🎨 **Modern Design** - Built with Next.js 15 and shadcn/ui
- 📖 **Page Flipping** - Smooth animations when navigating between pages
- ⌨️ **Keyboard Navigation** - Use arrow keys to flip pages
- 👆 **Touch Gestures** - Swipe left/right to navigate
- 🎲 **Random Page** - Opens a random Quran page on launch
- 🖼️ **Image Optimization** - Black text inverted to white in dark mode
- 🌐 **RTL Support** - Full Arabic right-to-left layout
- 📺 **Fullscreen Mode** - Immersive reading experience
- 🎯 **Minimal UI** - Clean interface with auto-hiding controls

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Quran page images (PNG format) in `/public/quran/` directory
- Logo images in `/public/logos/` directory

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Navigation

- **Swipe** left/right on touch devices
- **Arrow keys** ← → on keyboard
- **Navigation buttons** on screen sides
- **Tap** anywhere to show/hide controls

### Features

- **Random Page**: The app opens to a random Quran page
- **Progress Bar**: Bottom bar shows reading progress
- **Page Counter**: Top right shows current page number
- **Theme Toggle**: Switch between dark and light modes
- **Fullscreen**: Toggle fullscreen mode for distraction-free reading
- **Home Button**: Return to get a new random page

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Main layout with PWA config
│   ├── page.tsx            # Home page (random redirect)
│   ├── globals.css         # Global styles and animations
│   └── page/
│       └── [pageNumber]/
│           └── page.tsx    # Quran page viewer
├── components/
│   └── theme-provider.tsx  # Dark mode provider
└── lib/
    └── utils.ts            # Utility functions

public/
├── quran/                  # Quran page images (000.png - 604.png)
├── logos/                  # App logos
├── manifest.json           # PWA manifest
└── sw.js                   # Service worker (auto-generated)
```

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **next-themes** - Dark mode
- **next-pwa** - Progressive Web App
- **Lucide React** - Icons

## PWA Installation

### On Mobile (iOS/Android)

1. Open the app in Safari (iOS) or Chrome (Android)
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install and behave like a native app

### On Desktop

1. Look for the install icon in the browser address bar
2. Click to install
3. The app will open in its own window

## Customization

### Change Page Range

Edit the `TOTAL_PAGES` constant in:
- `src/app/page.tsx`
- `src/app/page/[pageNumber]/page.tsx`

### Modify Theme Colors

Edit theme colors in `src/app/globals.css` under the `:root` and `.dark` selectors.

### Adjust Animation Speed

Modify the animation duration in `src/app/globals.css`:
```css
@keyframes flipLeft {
  /* Change 0.6s to desired duration */
}
```

## License

This project is open source and available for Islamic educational purposes.

## Credits

Built with ❤️ for the Muslim community
