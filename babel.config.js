const presets = [
  [
    "@babel/env",
    {
      targets: {
        node: 'current',
        chrome: "67",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };