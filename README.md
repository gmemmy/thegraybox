# Gray Box — React Native Animated Interactions

This repo is a small compendium of animated interactions in React Native that I find fun to build and iterate on. It's an [Expo](https://expo.dev) app (SDK 54) using [Expo Router](https://docs.expo.dev/router/) with [Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/).

## Demos

All demos live under `app/demos`:

- `chat/`: Animated chat UI — inbox list, scrollable thread, sticky composer (Keyboard Controller), and a "new messages" pill
- `glass-tabs/`: Glassy tab bar with blur and springy transitions
- `nike/`: Product detail card, color/size selectors, and an options sheet interaction
- `danmaku-stream/`: WIP

https://github.com/user-attachments/assets/dc413210-6108-4dd7-aa57-afd124e16b07

[iOS](https://github.com/user-attachments/assets/4bba9bb8-b673-4175-ac90-cc485269b958)

## Run it

1. Install deps

```bash
bun install
```

2. Start the dev server

```bash
bun start
```

Then choose a target:

- iOS Simulator: `bunx ios`
- Android Emulator: `bunx android`

This project uses [file-based routing](https://docs.expo.dev/router/introduction). New demos can be added by creating a folder under `app/demos/` and exporting a screen from `index.tsx`.

## Tech

- React Native + Expo (SDK 54)
- Expo Router 6 (beta)
- React 19 + React Compiler (opt-in)
- React Native Reanimated 4
- React Native Gesture Handler
- React Native Keyboard Controller
- react-native-screen-transitions (shared-element style transitions)
- @shopify/react-native-skia (some effects/graphics)
- React Native Worklets (lightweight worklets utilities)
- Expo modules: Blur, Haptics, Image, Symbols, Status Bar,

## Credits

Built for learning, exploration, and fun. Inspirations come from various product UIs and motion studies across the community.

Ciao!
