# Colorfigures Gallery

Hand-drawn isometric machines you can play with, served as one GitHub Pages site.
Open `index.html`: it lists every piece, split into **Games** and **Demonstrations**.

## What's here

| Folder | Contents |
|---|---|
| `index.html` | The hub page, with a live preview card for every piece |
| `games/` | Pieces with a goal you can fail: Lift Operator, Terminal station, Fishing, Marble Run Adventure |
| `demos/` | How-it-works figures: Elevator, Escalator, Escalator pair, Train station, Candle, Vending machines, Sandwich kiosk, Marble tower, Marble helix, Traffic light, Washing machine |
| `src/` | Editable sources for the figures. They load the shared drawing engine from `src/core.js` |
| `assets/nav.js` | Adds the "← Gallery" link to each page, plus the `#thumb` preview mode the hub uses |

Each page in `games/` and `demos/` is self-contained, so it works when opened straight from disk.
Lift Operator, Marble Run, Traffic light and Washing machine have no separate source: edit the page itself.
(Traffic light and Washing machine come from the newer Colorfigures engine with a free camera, built into the page.)

## Turning a figure

Every demo can be turned: drag the figure (or use the arrow keys), and use **Front view** / **Turntable** under it.
Double-click returns to the front. Figures built on `src/core.js` turn up to 40° either side of the front, so the
faces they were drawn for always stay toward you. A figure that draws every side passes `turnLimit:180` to
`mountFigure` and turns all the way round: the escalators, Marble tower and Marble helix do, and so do Traffic light
and Washing machine.
Games keep a still view (`turn:false` in `mountFigure`).

## Battery use

Animations run at most 30 frames a second, pause while the page is hidden, and leave the page alone when a frame
draws nothing new. A figure with ongoing motion should start it with `ui.loop(step)` and return `false` from `step`
when nothing moves: the page then goes quiet until a button, picker, clickable part or key wakes it. On touch
screens the hand-drawn filter is switched off (it is recalculated every frame), and gallery previews freeze after
their first two seconds.

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
