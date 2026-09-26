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

  // background music: put the file at this path. If the file isn't there, the page stays silent.
  music: "assets/music.mp3",
  musicLead: 1000,     // start the music this many ms before the page begins to scroll
  musicStart: 0,       // start this many seconds into the track (e.g. to skip a silent intro)

  // auto-scroll speed once the invitation fills the screen, in CSS pixels per second.
  // 41 is what the reference recording does (62 px/s of 590-px video on a 393-pt phone).
  scrollSpeed: 41
};
