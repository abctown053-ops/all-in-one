import { Course, Feature } from './types';

export const ADMIN_CREDENTIALS = {
  email: 'admin@app.com',
  password: 'Naeemullah12'
};

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Mastering YouTube SEO',
    category: 'YouTube',
    isPaid: false,
    link: 'https://example.com/yt-seo',
    image: 'https://picsum.photos/seed/youtube/800/450',
    language: 'English',
    description: 'Learn how to rank your videos #1 with advanced keyword research.',
    status: 'Published'
  },
  {
    id: '2',
    name: 'Facebook Ads 2024',
    category: 'Facebook',
    isPaid: true,
    link: 'https://example.com/fb-ads',
    image: 'https://picsum.photos/seed/facebook/800/450',
    language: 'Spanish',
    description: 'Advanced targeting strategies for high-converting campaigns.',
    status: 'Published'
  },
  {
    id: '3',
    name: 'Instagram Reels Growth',
    category: 'Instagram',
    isPaid: false,
    link: 'https://example.com/ig-reels',
    image: 'https://picsum.photos/seed/instagram/800/450',
    language: 'English',
    description: 'Go viral with these secret reel editing techniques.',
    status: 'Published'
  },
  {
    id: '4',
    name: 'TikTok Shop Blueprint',
    category: 'TikTok',
    isPaid: true,
    link: 'https://example.com/tiktok-shop',
    image: 'https://picsum.photos/seed/tiktok/800/450',
    language: 'English',
    description: 'Start your e-commerce journey on TikTok today.',
    status: 'Published'
  }
];

export const INITIAL_FEATURES: Feature[] = [
  {
    id: 'f1',
    type: 'Bundle',
    title: 'Cinematic LUTs Pack',
    description: '10+ Professional color grading presets for mobile editors.',
    image: 'https://picsum.photos/seed/luts/800/450',
    link: 'https://example.com/luts',
    isActive: true
  },
  {
    id: 'f2',
    type: 'Material',
    title: 'Overlay Effects Library',
    description: 'High-quality dust, grain, and light leak overlays.',
    image: 'https://picsum.photos/seed/overlays/800/450',
    link: 'https://example.com/overlays',
    isActive: true
  }
];
