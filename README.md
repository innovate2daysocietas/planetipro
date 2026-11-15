# PLANETI

**Restoring Uganda's land and water with NASA data.**
Built for the NASA Space Apps Challenge 2026 (theme: The Next Frontier).

PLANETI shows where forests, wetlands and hillsides have lost vegetation over 20 years, ranks the best places to restore, and tracks whether recovery is happening. It runs entirely in the browser: no server, no build step, no dependencies.

Live demo: `https://[your-username].github.io/[your-repo]/` (after you enable GitHub Pages, see below)

## Features

- Interactive map of a site with three layers: restoration priority, vegetation (NDVI), vegetation lost since 2005
- Year slider from 2005 to 2025 and a vegetation trend chart
- Restoration score with adjustable weights (vegetation lost, rainfall, soil moisture, slope)
- Top 10 places to restore, each with plain-language advice
- New clearing alerts when NDVI drops by more than 0.10 in one year
- Paste-your-own-CSV ranking for real satellite data
- Built-in generator for a Google Earth Engine export script

## Important: sample data

The map on first load uses **simulated data** for three Ugandan sites (Mount Elgon, Kole District wetlands, Kampala wetlands) to demonstrate the workflow. It is not real measurement. For real results, load your own export (see below), and say clearly in any submission which data is real.

## Project structure

```
index.html            The complete app (HTML, CSS, JavaScript in one file)
gee/planeti_export.js Google Earth Engine script that exports real data as CSV
data/example.csv      Small example of the CSV format
.nojekyll             Tells GitHub Pages to serve the files as they are
LICENSE               MIT
```

## Run locally

Open `index.html` in any modern browser. Nothing else is needed. (An internet connection only loads an optional Google font, with a system font as fallback.)

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example `planeti`).
2. Upload everything in this folder to the repository root (drag and drop works on github.com, or use `git`).
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, and click Save.
5. After a minute or two your site is live at `https://[your-username].github.io/[repo-name]/`.

Using git:

```
git init
git add .
git commit -m "PLANETI: initial release"
git branch -M main
git remote add origin https://github.com/[your-username]/[repo-name].git
git push -u origin main
```

`index.html` is self-contained, so it also works on Netlify, Cloudflare Pages, or any static host.

## Using real NASA data

1. Open `gee/planeti_export.js` (or use the generator on the live page), edit `lat`, `lon` and `halfWidthKm`.
2. Paste it into the Earth Engine Code Editor (code.earthengine.google.com, free for research and nonprofit use) and click Run.
3. In the Tasks tab, run the `planeti_data` export. Download the CSV from Google Drive.
4. Paste the CSV contents into the "Use your own satellite data" box in PLANETI and click **Rank my data**.

Required CSV columns: `lat,lon,slope,rain,soil,ndvi_start,ndvi_end`. Values are rescaled automatically, so units do not matter. See `data/example.csv`.

Dataset names in Earth Engine change over time. If the script reports a missing dataset, search the Earth Engine catalog for the newer version.

## How the score works

```
score = (wL*loss + wR*rain + wS*soil + wP*slope) / (wL + wR + wS + wP)
```

Every input is scaled 0 to 1 and the weights are the sliders. Squares with under 10% vegetation loss score zero. A square raises a clearing alert when its NDVI falls by more than 0.10 compared with the previous year.

## NASA data sources

| Input | Dataset (Earth Engine ID) |
|---|---|
| Vegetation (NDVI) | MODIS/061/MOD13A1 |
| Rainfall | NASA/GPM_L3/IMERG_MONTHLY_V07 |
| Soil moisture | NASA/SMAP/SPL4SMGP/008 |
| Elevation and slope | USGS/SRTMGL1_003 |

## Limits

- Simulated data on first load; real data requires the export steps above.
- NDVI measures greenness, not tree species, so sites need checking on the ground.
- Rankings support decisions and do not replace local knowledge.

## Credits

Inspired by QUEÑARIS (Peru), the 2025 NASA Space Apps Local Impact winner. PLANETI is an original project by [your team name].

## License

MIT. See `LICENSE`.
