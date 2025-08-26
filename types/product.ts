import type {ImageSourcePropType} from 'react-native';

export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  image: ImageSourcePropType;
  brand?: string;
};
