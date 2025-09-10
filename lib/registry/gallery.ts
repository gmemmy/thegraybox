import type {Href} from 'expo-router';

export type GalleryItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: number;
  route: Href;
  accent?: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'nike',
    title: 'Nike Product Detail',
    subtitle: 'Options sheet + transitions',
    image: require('../../assets/images/gallery/gallery-01.jpg'),
    route: '/demos/nike',
  },
  {
    id: 'glass-tabs',
    title: 'Glass Tabs',
    subtitle: 'Frosted tabs + springs',
    image: require('../../assets/images/gallery/gallery-03.jpg'),
    route: '/demos/glass-tabs',
  },
  {
    id: 'chat',
    title: 'Chat',
    subtitle: 'Messages & interactions',
    image: require('../../assets/images/gallery/gallery-02.jpg'),
    route: '/demos/chat',
  },
  {
    id: 'danmaku',
    title: 'Danmaku Streams',
    subtitle: 'Danmaku + transitions',
    image: require('../../assets/images/gallery/gallery-06.jpg'),
    route: '/demos/stream',
  },
];
