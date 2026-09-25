# Assets

| File | What it is | Made from |
| --- | --- | --- |
| `env-inside.png` | the open envelope's body — the dark interior you see once the flap lifts | `空的信件.png` |
| `env-pocket.png` | the front pocket only, cut along its V; the card slides out from behind it | `空的信件.png` |
| `env-flap.png` | the closed flap, hinged along the top edge — the piece that swings open | `信件關.png` |
| `wax-seal.png` | the bear wax seal, 440 px wide | `蜂蠟.png` |
| `opener.png` | the letter opener, lifted off its checkerboard | `蜂蠟刀.png` |
| `map.png` | the venue map, cropped from the reference screen recording | the recording |
| `photos/` | web copies of every photo in `pic/`, long edge 1400 px | `pic/` |

The three envelope layers share one canvas of 1400 × 814 and stack pixel for pixel:
`env-inside` → the card → `env-pocket` → `env-flap` → the seal. The flap was re-cut
so that its point meets the seal at the envelope's centre.

The source images came with a checkerboard painted into them rather than real
transparency, so the layers were cut out by flood-filling the grey from the edges.
If you replace a source image, the layers need re-cutting — ask, and the script can
be rebuilt.

`map.png` is only 376 px wide because it comes from a 590 px screen recording. A
sharper original from the venue can simply replace it (keep it square-ish, and
update the `width`/`height` on its `<img>` in `index.html`).
