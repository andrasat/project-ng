import CompressionPlugin from 'compression-webpack-plugin';

module.exports = {
  plugins: [
    new CompressionPlugin({
      test: /\.(js|css|json)$/,
      algorithm: 'gzip',
      compressionOptions: {
        level: 5,
      },
      filename: '[path][base].gz',
      minRatio: 1,
    })
  ],
};