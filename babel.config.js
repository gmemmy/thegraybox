module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            sources: (filename) =>
              filename.includes('app/demos') || filename.includes('app/components'),
          },
        },
      ],
    ],
    plugins: [
      'react-native-worklets/plugin',
    ],
  };
};
