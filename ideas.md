Create an elegant, cinematic interactive wedding invitation landing page.

The experience should feel like receiving a real physical wedding invitation, rather than opening a normal wedding website.

## Overall Animation Flow

The complete sequence should be:

**Envelope flies in from the right → draws a heart-shaped flight path → the heart path gradually grows larger → envelope stops exactly in the center → user clicks the wax seal → the wax seal is traditionally broken → the envelope opens → a red wedding invitation card slides out.**

The animation should feel romantic, elegant, tactile, and realistic.

Avoid cartoonish or overly bouncy animations.

---

## 1. Initial Scene

When the webpage loads:

* Use a warm ivory / cream background.
* Add a very subtle paper texture.
* Keep the scene minimal and elegant.
* Do not show the envelope immediately.

After approximately 0.5–1 second, an envelope appears from the far right side of the screen.

The envelope should initially be:

* Small
* Slightly transparent
* Slightly blurred
* Far away from the viewer
* Positioned toward the upper-right area

It should feel like the envelope is approaching the viewer from a distance.

---

## 2. Envelope Flight

The envelope must NOT simply move in a straight line from right to left.

It must follow a **heart-shaped flight path**.

Conceptually:

```text
                       Start
                         ✉
                          \
                           \
                            ♥
                         /     \
                       /         \
                      /           \
                      \           /
                       \         /
                        \       /
                         \     /
                           \ /
                            ▼
                         Center
                           ✉
```

The envelope should visually trace the shape of a heart while flying.

Do NOT draw a visible solid heart line.

The heart should only be implied by the envelope's movement.

Optional subtle effects:

* Very faint particles
* Tiny glowing dust
* Soft flower petals
* Very subtle sparkles

These effects must remain secondary to the envelope.

---

## 3. The Heart Gradually Gets Larger

The heart-shaped flight path should begin small and gradually become larger.

At the beginning:

* The heart path is small.
* The envelope is tiny.
* The envelope is far away.
* The envelope has slight motion blur.

As the animation progresses:

* The heart path gradually expands.
* The envelope moves closer to the viewer.
* The envelope becomes larger.
* The envelope becomes sharper.
* Opacity increases.
* Motion blur decreases.
* Rotation gradually returns to neutral.

The final movement should transition naturally from the heart-shaped trajectory into the center of the screen.

The envelope must finally stop **exactly at the center of the viewport**.

---

## 4. Envelope Arrival

When the envelope reaches the center:

* Stop all major rotation.
* Face the envelope directly toward the user.
* Add a very subtle floating motion.
* Add a soft shadow underneath.
* Give the envelope a slight physical settling effect.

For example:

```text
scale 0.98
→
scale 1.02
→
scale 1.00
```

The movement should be subtle.

It should feel like a physical envelope gently settling in front of the viewer.

---

## 5. Envelope Design

The envelope should look like a premium physical wedding invitation.

Visual style:

* Ivory / warm white handmade paper
* Subtle paper fibers
* Elegant botanical decorations
* Refined wedding stationery
* Soft shadows
* Slightly imperfect handmade texture

In the center of the envelope is a prominent **red or burgundy wax seal**.

The wax seal should have:

* Realistic wax texture
* Slightly irregular handmade edges
* Subtle 3D depth
* Soft highlights
* A small wedding emblem or monogram in the center

The wax seal is the primary interactive element.

---

## 6. User Interaction

After the envelope arrives, DO NOT automatically open it.

Wait for the user to click or tap the wax seal.

Only the wax seal should trigger the opening animation.

The wax seal should have a subtle interaction effect:

* Slight scale-up on hover
* Very subtle glow
* Small movement when touched
* Cursor should become `pointer` on desktop
* Must work naturally on mobile touchscreens

Optional hint below the envelope:

**"Tap to open"**

Keep the hint subtle and elegant.

---

# 7. Traditional Wax Seal Opening

When the user clicks the wax seal, do NOT immediately fade out the envelope.

The opening must visually simulate a traditional physical wax-sealed letter being opened.

Animation sequence:

### Step 1

The wax seal slightly vibrates from the click.

### Step 2

A tiny crack appears in the center of the wax seal.

### Step 3

The crack gradually expands outward.

### Step 4

The wax seal breaks apart naturally.

### Step 5

A few small pieces of wax detach and fall.

### Step 6

The envelope flap becomes released.

### Step 7

The envelope flap slowly opens upward/backward.

### Step 8

The inside of the envelope becomes visible.

### Step 9

A red wedding invitation card begins sliding out.

### Step 10

The red invitation card moves forward and slightly enlarges.

### Step 11

The invitation card becomes the main focus of the screen.

The entire sequence should feel physical and tactile.

Do NOT use a simple:

```text
click → fade out → show card
```

The user must clearly see the envelope being physically opened.

---

# 8. Wax Seal Breaking

The wax seal should break like real traditional sealing wax.

It should NOT:

* Explode like glass
* Shatter into dozens of pieces
* Look like a video game effect
* Produce excessive particles

Instead:

```text
Intact wax
↓
Small crack
↓
Crack expands
↓
Seal splits
↓
A few wax fragments fall
```

The broken wax should retain realistic weight and thickness.

---

# 9. Red Wedding Invitation

After the envelope opens, reveal a **deep red / burgundy wedding invitation card**.

The card should feel luxurious and traditional.

Design:

* Deep red / burgundy paper
* Subtle paper texture
* Fine gold borders
* Elegant botanical details
* Refined wedding stationery aesthetic
* Large clean central area for typography

The invitation should initially be partially hidden inside the envelope.

It should slowly slide outward:

```text
Small portion visible
        ↓
More of the card emerges
        ↓
Card leaves the envelope
        ↓
Card moves toward the viewer
        ↓
Card becomes centered
```

Add a subtle scale transition as it emerges.

---

# 10. Invitation Content

Once the red invitation is fully visible, show minimal information first.

For example:

**WE ARE GETTING MARRIED**

**XXX & XXX**

**202X.XX.XX**

Do not overload the first screen with information.

The first impression should simply communicate:

> "We have a special invitation for you."

Additional sections can appear afterward:

* Wedding date
* Wedding venue
* Ceremony time
* Reception time
* Our story
* Wedding photos
* RSVP
* Google Maps
* Countdown
* Contact information

---

# 11. Animation Timing

Recommended timing:

### Initial entrance

0.5–1 sec
Page settles.

### Envelope flight

2.5–3.5 sec
Envelope flies from the right and traces the growing heart-shaped path.

### Arrival

0.3–0.5 sec
Envelope settles in the center.

### Waiting

Pause until user interaction.

### Wax seal interaction

0.4–0.6 sec
Crack and break.

### Envelope opening

0.7–1.0 sec

### Invitation reveal

1.0–1.5 sec

### Final settling

0.3–0.5 sec

The animation should feel slow, elegant, and cinematic rather than fast or playful.

---

# 12. Technical Implementation

Use:

* HTML
* CSS
* JavaScript

If the project already uses GSAP, use GSAP.

Recommended animation technology:

* GSAP
* SVG path
* MotionPathPlugin if available
* CSS 3D transforms
* CSS perspective
* CSS transitions

The heart-shaped trajectory should preferably use an SVG path or GSAP MotionPath rather than manually moving the envelope with many hardcoded coordinates.

Do not use `setInterval()` to simulate the animation.

Prioritize smooth 60 FPS animation.

The experience must work on:

* iPhone
* Android
* Desktop browsers

Design mobile-first.

---

# 13. Asset Structure

Keep visual assets separate from animation logic.

Prepare placeholders for:

```text
/assets/
    envelope-front.png
    envelope-back.png
    wax-seal.png
    wax-seal-broken.png
    invitation-red.png
```

Do not bake editable text into the image assets.

Names, dates, and wedding information should be HTML/CSS text so they can easily be changed later.

---

# 14. Important UX Goal

The emotional progression should be:

**"Something is coming toward me."**

↓

**"Wait... it's drawing a heart."**

↓

**"It's a letter."**

↓

**"It's stopping right in front of me."**

↓

**"I want to open it."**

↓

**"I broke the wax seal."**

↓

**"The envelope is actually opening."**

↓

**"There's a beautiful red wedding invitation inside."**

The entire experience should feel like:

**A real wedding letter personally delivered to the guest.**

Do not make it look like a generic wedding website template.

Do not reveal all elements at once.

Do not simply fade between scenes.

The animation should tell one continuous visual story:

**Fly in → Draw a heart → Grow larger → Stop → Click wax seal → Break wax → Open envelope → Reveal red wedding invitation.**
