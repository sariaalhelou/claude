#!/usr/bin/env python3
"""Fit a photo to Artego's 4:5 canvas (1080x1350): scale to cover (Lanczos), center-crop.
   python3 fit_photo.py <in.jpg> <out.jpg> [--pos-x 0.5] [--pos-y 0.5]
Prints the scale and crop offset so areas measured on the original image can be converted:
   x_post = x_orig * scale - off_x ,  y_post = y_orig * scale - off_y
Use it to turn the calm wall/ceiling you see in the photo into the slide's data-calm="l,r,b"."""
import sys
from PIL import Image
a = sys.argv[1:]
if len(a) < 2: sys.exit(__doc__)
px = float(a[a.index("--pos-x") + 1]) if "--pos-x" in a else 0.5
py = float(a[a.index("--pos-y") + 1]) if "--pos-y" in a else 0.5
im = Image.open(a[0]).convert("RGB")
W, H = 1080, 1350
s = max(W / im.width, H / im.height)
w, h = round(im.width * s), round(im.height * s)
ox, oy = round((w - W) * px), round((h - H) * py)
im.resize((w, h), Image.LANCZOS).crop((ox, oy, ox + W, oy + H)).save(a[1], quality=95)
print(f"original {im.width}x{im.height} -> scale {s:.4f}, crop offset x {ox} y {oy}")
if s > 1.25: print(f"WARN upscaled x{s:.2f}: ask for a larger download (or upscale the photo first)")
