# ECL ScreenShare

## Setting up

Use `npm install` to set up dependencies.

```sh
# run eslint
npm run lint

# build the library
npm run build:lib

# build the chrome extension
npm run build:ext
```

## Examples

Start web server on repository root.

## Contributing

Make sure you have nodejs installed. Run `npm install` to get started.

After making changes in `src/`, `chrome-extension/` you run

- `npm run lint` to validate

then run build commands

- `npm run build:lib` to build `screenshare(.min).js`
- `npm run build:ext` to build `screenshare_chrome_extension.zip`

which is stored in `dist` directory!
