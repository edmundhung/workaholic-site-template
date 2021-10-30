# workaholic-site-template

This is a [Workaholic](https://github.com/edmundhung/workaholic) site template which also serves as a demo.

- [Documentation](./content)
- [Demo](https://demo.workaholic.site)

## Development

From the terminal:

```sh
# If this is the first time you run the dev server,
# Or whenever you updated something in the `content` directory
npm run generate
```

Then, starts the API worker on Miniflare by:

```sh
npm start
```

If you would like to run the demo site, run:

```
npm run style --prefix site && npm start --prefix site
```

This builds the CSS and kickstarts a dev server running the demo React app.
