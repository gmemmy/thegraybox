import {useColorScheme} from '@/hooks/useColorScheme';
import {colors} from '@/theme/colors';

export function useThemeColor(
  props: {light?: string; dark?: string},
  colorName: keyof typeof colors,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  if (colorFromProps) return colorFromProps;
  return colors[colorName];
}
