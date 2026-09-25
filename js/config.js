/*
 * The few things the page computes. All the wording lives in index.html.
 */
window.WEDDING = {
  // the countdown under "Save the date" runs to this moment
  countdownTo: "2026-11-08T12:00:00+08:00",

  // the month drawn in the red calendar, and the day that is circled
  calendar: { year: 2026, month: 11, day: 8 },

  // opened by the venue, the address and the map
  mapQuery: "上海鄉村 承德本家 臺北市大同區承德路一段2號7樓",

  // optional background music, e.g. "assets/music.mp3" — the record button appears only when set
  music: "",

  // the rest of the shoot, shown under "Our Moments" (landscape shots span the full width)
  gallery: [
    "sunn0517.jpg",
    "sunn0529-1.jpg", "sunn0557-1.jpg",
    "sunn0563-1.jpg",
    "sunn0570-1.jpg", "sunn0582.jpg",
    "sunn0601-1.jpg",
    "sunn0608-1.jpg", "sunn0610-1.jpg",
    "sunn0621.jpg", "sunn0638.jpg",
    "sunn0628-1.jpg",
    "sunn0661-2.jpg", "sunn0676-1.jpg",
    "sunn0705-2.jpg", "sunn0713-1.jpg",
    "sunn0719.jpg", "sunn0736.jpg",
    "sunn0740.jpg"
  ],
  galleryWide: ["sunn0517.jpg", "sunn0563-1.jpg", "sunn0601-1.jpg", "sunn0628-1.jpg"],

  // auto-scroll speed once the invitation fills the screen (pixels per second)
  scrollSpeed: 52
};
