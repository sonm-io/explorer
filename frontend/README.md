```
npm start      # Start dev server
npm run build  # Build application for production
npm run sg     # Run Styleguidist server
```

While debugging you may face problem when `this` is undefined or when some variables has unexpected values. This is sourcemaps problem. To avoid it, comment `devtool` key in webpack.config.

ToDo:

- add less compilation in webpack.config.prod.