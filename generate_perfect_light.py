from PIL import Image, ImageDraw, ImageFilter
import subprocess

# 1. Create the SVG for the 3D glowing open book with elegant curves
svg_code = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">
  <defs>
    <!-- Page lighting gradient -->
    <radialGradient id="pageGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFFDF7" stop-opacity="1" />
      <stop offset="30%" stop-color="#FEF3C7" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#FDE68A" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#FCD34D" stop-opacity="0.6" />
    </radialGradient>
    
    <!-- Deep book cover gradient -->
    <linearGradient id="coverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2438" />
      <stop offset="100%" stop-color="#181322" />
    </linearGradient>

    <!-- Page block shadow -->
    <linearGradient id="pageBlockLeft" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DDD2C0" />
      <stop offset="100%" stop-color="#EBE3D5" />
    </linearGradient>

    <linearGradient id="pageBlockRight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EBE3D5" />
      <stop offset="100%" stop-color="#DDD2C0" />
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Ambient Under Glow -->
  <ellipse cx="400" cy="230" rx="360" ry="140" fill="#F59E0B" opacity="0.35" filter="url(#softGlow)" />
  <ellipse cx="400" cy="220" rx="260" ry="90" fill="#FEF08A" opacity="0.55" filter="url(#softGlow)" />

  <!-- Hardcover Base (thick dark bottom) -->
  <path d="M 60,195 
           Q 220,165 400,210 
           Q 580,165 740,195 
           L 745,260 
           Q 580,240 400,275 
           Q 220,240 55,260 Z" 
        fill="url(#coverGrad)" />

  <!-- Page Thickness Block - Left -->
  <path d="M 75,190 
           Q 230,170 400,210 
           L 400,245 
           Q 230,215 75,230 Z" 
        fill="url(#pageBlockLeft)" />

  <!-- Page Thickness Block - Right -->
  <path d="M 400,210 
           Q 570,170 725,190 
           L 725,230 
           Q 570,215 400,245 Z" 
        fill="url(#pageBlockRight)" />

  <!-- Page Edge Horizontal Lines -->
  <path d="M 80,205 Q 230,185 400,222 M 80,215 Q 230,195 400,232 M 80,225 Q 230,205 400,240" 
        stroke="#C4B5A0" stroke-width="1.2" opacity="0.7" fill="none" />
  <path d="M 400,222 Q 570,185 720,205 M 400,232 Q 570,195 720,215 M 400,240 Q 570,205 720,225" 
        stroke="#C4B5A0" stroke-width="1.2" opacity="0.7" fill="none" />

  <!-- Left Open Page Surface (Curved) -->
  <path d="M 85,185 
           C 160,110 320,120 400,205 
           L 400,240 
           C 320,160 160,150 85,225 Z" 
        fill="#FDFBF7" stroke="#E2D7C3" stroke-width="1.5" />

  <!-- Right Open Page Surface (Curved) -->
  <path d="M 400,205 
           C 480,120 640,110 715,185 
           L 715,225 
           C 640,150 480,160 400,240 Z" 
        fill="#FFFDF9" stroke="#E2D7C3" stroke-width="1.5" />

  <!-- Radiance radiating from center crease -->
  <path d="M 120,180 
           C 200,125 320,135 400,205 
           C 480,135 600,125 680,180 
           L 670,210 
           C 590,165 480,175 400,230 
           C 320,175 210,165 130,210 Z" 
        fill="url(#pageGlow)" opacity="0.85" />

  <!-- Center Crease Shadow -->
  <path d="M 400,205 L 400,240" stroke="#B45309" stroke-width="3" opacity="0.4" />
</svg>"""

with open('book.svg', 'w') as f:
    f.write(svg_code)

# Convert SVG to high-res PNG using ImageMagick
subprocess.run(['convert', '-background', 'none', 'book.svg', 'book.png'], check=True)

# Now composite the fawn deer onto the book
book_img = Image.open('book.png').convert('RGBA')
deer_img = Image.open('light_full_preview.png').convert('RGBA')

# Target canvas size: 700x700
canvas_w, canvas_h = 700, 700
comp = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))

# Resize book to ~620 width
bw = 620
bh = int(book_img.height * (bw / book_img.width))
book_resized = book_img.resize((bw, bh), Image.Resampling.LANCZOS)

# Position book at bottom center
book_x = (canvas_w - bw) // 2
book_y = canvas_h - bh - 20

# Scale deer to stand proudly on book
dh = 460
dw = int(deer_img.width * (dh / deer_img.height))
deer_resized = deer_img.resize((dw, dh), Image.Resampling.LANCZOS)

# Deer position so hooves contact the book page surface
deer_x = (canvas_w - dw) // 2
deer_y = book_y - dh + 215

# Hooves contact warm shadows
shadow = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
# Left front hoof
sdraw.ellipse((deer_x + dw * 0.32, deer_y + dh - 26, deer_x + dw * 0.44, deer_y + dh - 12), fill=(180, 83, 9, 130))
# Left rear hoof
sdraw.ellipse((deer_x + dw * 0.52, deer_y + dh - 36, deer_x + dw * 0.64, deer_y + dh - 20), fill=(180, 83, 9, 110))
# Right front hoof
sdraw.ellipse((deer_x + dw * 0.65, deer_y + dh - 24, deer_x + dw * 0.77, deer_y + dh - 10), fill=(180, 83, 9, 140))
shadow = shadow.filter(ImageFilter.GaussianBlur(6))

# Paste Book -> Shadow -> Deer
comp.paste(book_resized, (book_x, book_y), book_resized)
comp = Image.alpha_composite(comp, shadow)
comp.paste(deer_resized, (deer_x, deer_y), deer_resized)

# Floating sparkles & stars
def add_star(draw, x, y, r1, r2, color):
    import math
    pts = []
    for i in range(8):
        r = r1 if i % 2 == 0 else r2
        ang = i * math.pi / 4 - math.pi / 2
        pts.append((x + r * math.cos(ang), y + r * math.sin(ang)))
    draw.polygon(pts, fill=color)

sparkles = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
sp_draw = ImageDraw.Draw(sparkles)

star_list = [
    (110, 420, 10, 3, (254, 240, 138, 230)),
    (140, 320, 12, 4, (255, 255, 255, 240)),
    (120, 200, 14, 4.5, (251, 191, 36, 230)),
    (590, 410, 11, 3.5, (254, 240, 138, 230)),
    (570, 310, 13, 4, (255, 255, 255, 250)),
    (580, 210, 11, 3.5, (251, 191, 36, 220)),
    (180, 120, 12, 4, (254, 240, 138, 240)),
    (520, 130, 12, 4, (254, 240, 138, 240)),
    (240, 520, 8, 2.5, (255, 255, 255, 220)),
    (460, 530, 9, 3, (254, 240, 138, 220)),
]
for x, y, r1, r2, col in star_list:
    add_star(sp_draw, x, y, r1, r2, col)

# Subtle particles
for px, py, pr, pcol in [
    (280, 480, 3, (255, 255, 255, 220)),
    (420, 490, 3, (254, 240, 138, 220)),
    (220, 380, 2.5, (251, 191, 36, 180)),
    (480, 390, 2.5, (251, 191, 36, 180)),
    (310, 250, 2, (254, 240, 138, 190)),
    (390, 260, 2, (254, 240, 138, 190)),
]:
    sp_draw.ellipse((px-pr, py-pr, px+pr, py+pr), fill=pcol)

comp = Image.alpha_composite(comp, sparkles)

# Crop transparent avatar to clean bounds
comp.save('public/assets/light.png', 'PNG')
comp.save('public/assets/light_v2.png', 'PNG')
comp.save('public/assets/light_happy.png', 'PNG')
print('Pristine light.png saved successfully!')

# Also create the full 16:9 midnight sky scene matching user image
scene_w, scene_h = 960, 540
scene = Image.new('RGBA', (scene_w, scene_h), (18, 24, 60, 255))
s_draw = ImageDraw.Draw(scene)

# Vertical navy gradient
for y in range(scene_h):
    t = y / scene_h
    r = int(18 * (1-t) + 10 * t)
    g = int(24 * (1-t) + 14 * t)
    b = int(62 * (1-t) + 38 * t)
    s_draw.line([(0, y), (scene_w, y)], fill=(r, g, b, 255))

# Soft ambient light behind book & deer
amb = Image.new('RGBA', (scene_w, scene_h), (0, 0, 0, 0))
amb_draw = ImageDraw.Draw(amb)
amb_draw.ellipse((scene_w * 0.22, scene_h * 0.15, scene_w * 0.78, scene_h * 0.95), fill=(35, 45, 95, 220))
amb_draw.ellipse((scene_w * 0.32, scene_h * 0.45, scene_w * 0.68, scene_h * 0.92), fill=(245, 158, 11, 75))
amb = amb.filter(ImageFilter.GaussianBlur(50))
scene = Image.alpha_composite(scene, amb)

# Background stars
import random
random.seed(99)
bg_stars = Image.new('RGBA', (scene_w, scene_h), (0, 0, 0, 0))
bgs_draw = ImageDraw.Draw(bg_stars)
for _ in range(50):
    bx = random.randint(20, scene_w - 20)
    by = random.randint(20, int(scene_h * 0.85))
    br = random.choice([1, 1.3, 1.8])
    ba = random.randint(100, 240)
    bgs_draw.ellipse((bx-br, by-br, bx+br, by+br), fill=(225, 235, 255, ba))
scene = Image.alpha_composite(scene, bg_stars)

# Scale comp to fit scene
scale_scene = 0.82
sc_w = int(canvas_w * scale_scene)
sc_h = int(canvas_h * scale_scene)
comp_for_scene = comp.resize((sc_w, sc_h), Image.Resampling.LANCZOS)
px = (scene_w - sc_w) // 2
py = scene_h - sc_h + 10
scene.paste(comp_for_scene, (px, py), comp_for_scene)

scene.save('public/assets/light_scene.png', 'PNG')
scene.save('public/assets/light_book_scene.png', 'PNG')
print('Pristine light_scene.png saved successfully!')
