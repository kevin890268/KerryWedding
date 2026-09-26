# Assets

| File | What it is | Made from |
| --- | --- | --- |
| `env-inside.webp` | the open envelope's body — the dark interior you see once the flap lifts | `空的信件.png` |
| `env-pocket.webp` | the front pocket only, cut along its V; the card slides out from behind it | `空的信件.png` |
| `env-flap.webp` | the closed flap, hinged along the top edge — the piece that swings open | `信件關.png` |
| `wax-seal.webp` | the bear wax seal, 440 px wide (WebP, like all the artwork here: about 150 KB in total) | `蜂蠟.png` |
| `opener.webp` | the letter opener, lifted off its checkerboard | `蜂蠟刀.png` |
| `map.jpg` | the venue map, 1100 px | `S__207273998.jpg` |
| `photos/` | web copies of every photo in `pic/`, long edge 1400 px | `pic/` |

The three envelope layers share one canvas of 1400 × 814 and stack pixel for pixel:
`env-inside` → the card → `env-pocket` → `env-flap` → the seal. The flap was re-cut
so that its point meets the seal at the envelope's centre.

The source images came with a checkerboard painted into them rather than real
transparency, so the layers were cut out by flood-filling the grey from the edges.
If you replace a source image, the layers need re-cutting — ask, and the script can
be rebuilt.
