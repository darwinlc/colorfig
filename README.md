# Colorfigures Gallery

Hand-drawn isometric machines you can play with, served as one GitHub Pages site.
Open `index.html`: it lists every piece, split into **Games** and **Demonstrations**.

## What's here

| Folder | Contents |
|---|---|
| `index.html` | The hub page, with a live preview card for every piece |
| `games/` | Pieces with a goal you can fail: Lift Operator, Terminal station, Fishing, Marble Run Adventure |
| `demos/` | How-it-works figures: Elevator, Escalator, Escalator pair, Train station, Candle, Vending machines, Sandwich kiosk |
| `src/` | Editable sources for the figures. They load the shared drawing engine from `src/core.js` |
| `assets/nav.js` | Adds the "← Gallery" link to each page, plus the `#thumb` preview mode the hub uses |

Each page in `games/` and `demos/` is self-contained, so it works when opened straight from disk.
Lift Operator and Marble Run have no separate source: edit the page itself.

## Editing a figure

1. Edit `src/<name>.html`. Open it in a browser while you work: it loads `core.js` from the same folder.
2. Rebuild the self-contained page by replacing `<script src="core.js"></script>` with the contents of `core.js`
   inside a `<script>` tag. The Colorfigures `scripts/build.py` does this.
3. Save it over `demos/<name>.html` or `games/<name>.html`, then add
   `<script src="../assets/nav.js"></script>` just before `</body>`.
4. If you add a new page, add a card for it in the `GAMES` or `DEMOS` list in `index.html`.

## Running locally

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
```

## Publishing on GitHub Pages

Push to GitHub, then go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**,
and pick `main` / `(root)`.

## Credits

The drawing engine and style come from [Colorfigures](https://april-zhu.com/colorfigures) by April Zhu,
which builds on iso-glow (April Zhu) and iso-figure (Tolga Cohce). MIT licensed, see `LICENSE`.
