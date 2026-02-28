export type Category = 'YouTube' | 'Facebook' | 'Instagram' | 'TikTok' | 'Other';
export type FeatureType = 'Bundle' | 'Material';

export interface Course {
  id: string;
  name: string;
  category: Category;
  isPaid: boolean;
  link: string;
  image: string;
  language: string;
  description: string;
  status: 'Published' | 'Unlisted';
}

export interface Feature {
  id: string;
  type: FeatureType;
  title: string;
  description: string;
  image: string;
  link: string;
  isActive: boolean;
}
