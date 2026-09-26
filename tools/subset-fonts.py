"""
Builds the invitation's web fonts from the font zips in the project folder.

    py tools/subset-fonts.py

Chocolate Classical Sans is a 12 MB font. A phone should not download all of it,
so this keeps only the characters the invitation actually uses (plus all of
basic Latin, digits and common punctuation) and saves them as WOFF2.

Run it again after changing any Chinese text in index.html: a character that
is not in the subset would fall back to the phone's own font.

Needs:  py -m pip install --user fonttools brotli
"""
import io
import os
import re
import zipfile

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "fonts")

# (zip file, file inside the zip, output name, which characters)
FONTS = [
    ("Chocolate_Classical_Sans.zip", "ChocolateClassicalSans-Regular.ttf",
     "chocolate-classical-sans.woff2", "page"),
    ("Allura,Chocolate_Classical_Sans.zip", "Allura/Allura-Regular.ttf",
     "allura.woff2", "latin"),
    ("Kaushan_Script.zip", "KaushanScript-Regular.ttf",
     "kaushan-script.woff2", "latin"),
]

LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + "’‘“”–—…·•©®"
PUNCT = "，。、：；！？「」『』（）【】〔〕／～…—·﹏％＆＋－＝＜＞＃＊＠｜　"


def page_characters():
    """Every character used by the page's text and settings."""
    text = ""
    for rel in ("index.html", os.path.join("js", "config.js"), os.path.join("js", "scene.js"),
                os.path.join("js", "invite.js")):
        with io.open(os.path.join(ROOT, rel), encoding="utf-8") as f:
            text += f.read()
    chars = set(ch for ch in text if ord(ch) > 0x7F)
    return "".join(sorted(chars)) + LATIN + PUNCT + "0123456789"


def build(zip_name, member, out_name, which):
    src = os.path.join(ROOT, zip_name)
    if not os.path.exists(src):
        print("skip: %s not found" % zip_name)
        return
    with zipfile.ZipFile(src) as z:
        data = z.read(member)
    font = TTFont(io.BytesIO(data))

    chars = page_characters() if which == "page" else LATIN
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]      # keep ligatures, kerning, alternates
    options.name_IDs = ["*"]
    options.notdef_outline = True
    sub = subset.Subsetter(options=options)
    sub.populate(text=chars)
    sub.subset(font)

    os.makedirs(OUT, exist_ok=True)
    dest = os.path.join(OUT, out_name)
    font.flavor = "woff2"
    font.save(dest)
    kept = len(set(chars))
    print("%-34s %6.0f KB  (%d characters, from %.1f MB)" % (
        out_name, os.path.getsize(dest) / 1024.0, kept, len(data) / 1048576.0))


if __name__ == "__main__":
    for spec in FONTS:
        build(*spec)
