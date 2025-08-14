# Gray Box — React Native Animated Interactions

This repo is a small compendium of animated interactions in React Native that I find fun to build and iterate on. It's an [Expo](https://expo.dev) app using [Expo Router](https://docs.expo.dev/router/) with [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/).

## Demos

All demos live under `app/demos`:

- `glass-tabs/`: Glassy tab bar with blur and springy transitions
- `nike/`: Product detail card, color/size selectors, and an options sheet interaction
- `parallax-header/`: Collapsing header with parallax image and sticky content

[iOS](https://github.com/user-attachments/assets/eb05b242-c348-4671-a6cd-ffc2dcb8c1e4)

## Run it

1. Install deps

```bash
npm install
```

2. Start the dev server

```bash
npm start
```

Then choose a target:

- iOS Simulator: `npx ios`
- Android Emulator: `npx android`

This project uses [file-based routing](https://docs.expo.dev/router/introduction). New demos can be added by creating a folder under `app/demos/` and exporting a screen from `index.tsx`.

## Tech

- React Native + Expo
- Expo Router
- React Native Reanimated 3
- React Native Gesture Handler
- Expo modules: Blur, Haptics, Image, Symbols, Status Bar

## Credits

Built for learning, exploration, and fun. Inspirations come from various product UIs and motion studies across the community.
