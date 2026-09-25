# KerryWedding

完整的專案說明、流程時間、進度與待辦：見 [PROJECT.md](PROJECT.md)。

黃泰傑 ❤ 高凱俐 的訂婚邀請 — 2026.11.08

A deep red envelope glides in from the right, trailing sparks, and settles in the
middle of the screen, sealed with a bear wax seal. A letter opener waits beneath the
seal, handle down; if nobody touches it for a moment it gives a small push of its
own. Push it up and the seal comes away in one piece, the flap swings open, and the
invitation is drawn out on its side, turns upright, and grows to fill the phone.

From there the page glides slowly to the bottom on its own, like the original
婚貝請柬 invitation it is modelled on. A real scroll, swipe or key press hands control
back to the guest. A slim scrubber on the right edge jumps anywhere in the page.

## Editing

| What | Where |
| --- | --- |
| All the wording (names, parents, banquet, poems, directions) | `index.html` |
| Countdown target, calendar month, map search, music, gallery list, glide speed | `js/config.js` |
| Colours, type, spacing of the invitation | `css/invite.css` |
| The envelope scene | `css/style.css`, `js/scene.js` |

Photos live in `assets/photos/` as web-sized copies (long edge 1400 px) of the
originals in `pic/`, which are kept out of the repository.

Background music is off until you add a file, e.g. `assets/music.mp3`, and set
`music: "assets/music.mp3"` in `js/config.js`; the spinning record button then
appears top right, and the music starts on the guest's first touch.

## Running it

```bash
py -m http.server 5510
```

Then open <http://localhost:5510>. While editing:

- `?fast` skips the flight
- `?invite` jumps straight to the invitation
- `?invite&at=3000` opens the invitation 3000 px down, with everything already shown

## Layout

```
index.html          markup and all the wording
css/style.css       the envelope scene and the cover card
css/invite.css      the long invitation
js/config.js        the few computed things ← edit this
js/scene.js         envelope, seal, opener, card
js/invite.js        glide, scrubber, countdown, calendar, gallery, gold confetti
assets/             envelope layers, opener, seal, map, photos
```
