import CompressionPlugin from 'compression-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

dotenv.config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'vars': {
        QS_API: JSON.stringify(process.env.QS_API),
        QS_BEARER: JSON.stringify(process.env.QS_BEARER),
        QS_USERNAME: JSON.stringify(process.env.QS_USERNAME),
        QS_PASS: JSON.stringify(process.env.QS_PASS),
        GOOGLE_API: JSON.stringify(process.env.GOOGLE_API),
        GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
        MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
        FIREBASE: JSON.stringify({
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
        }),
      },
    }),
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