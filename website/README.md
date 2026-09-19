# sitcom-flavour website

The one-page site at https://ada.tools/sitcom-flavour/. Built with [Astro](https://astro.build), plain CSS and a few small TypeScript modules. Fonts are self-hosted through Fontsource.

The situation explorer and the cast cards read `../banks/*.md` at build time, so rebuilding the site picks up bank changes.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:4321/sitcom-flavour/
pnpm build      # astro check + static build into dist/
pnpm preview
```

## Deploy

`dist/` is a static site built for the `/sitcom-flavour/` base path. Upload its contents to that directory on ada.tools. The base and site URL are set in `astro.config.mjs`.

## Social card

`public/og.png` is rendered from `src/pages/og.astro`. To regenerate it, run `pnpm preview` and then `pnpm og` in another terminal. Set `CHROME_PATH` if Chrome isn't in the default macOS location.

## Notes

- TypeScript is pinned to 6.x because `astro check` doesn't support the TypeScript 7 native compiler yet.
- The applause sign and the rimshot button synthesise their sound with the Web Audio API. There are no audio files.
