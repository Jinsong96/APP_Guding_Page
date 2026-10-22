import math, random
from PIL import Image, ImageDraw, ImageFilter

def create_star(draw, cx, cy, r_outer, r_inner, fill, points=4):
    coords = []
    for i in range(points * 2):
        r = r_outer if i % 2 == 0 else r_inner
        angle = i * math.pi / points - math.pi / 2
        coords.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(coords, fill=fill)

def render_book_layer(w, h, book_cx, book_cy, book_w, book_h):
    # Create layer for the book
    book_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(book_layer)

    # 1. Soft golden ambient under-glow
    glow_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.ellipse(
        (book_cx - book_w * 0.7, book_cy - book_h * 0.8,
         book_cx + book_w * 0.7, book_cy + book_h * 1.4),
        fill=(251, 191, 36, 120)
    )
    glow_draw.ellipse(
        (book_cx - book_w * 0.45, book_cy - book_h * 0.5,
         book_cx + book_w * 0.45, book_cy + book_h * 0.9),
        fill=(254, 240, 138, 180)
    )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(35))
    book_layer = Image.alpha_composite(book_layer, glow_layer)
    draw = ImageDraw.Draw(book_layer)

    # 2. Hardcover Base (thick dark cover underneath)
    cover_thickness = 22
    cover_color = (48, 38, 58, 255) # deep purple-brown leather
    cover_shadow = (25, 18, 30, 255)
    
    # Spine center and outer points
    spine_x = book_cx
    spine_top = book_cy - book_h * 0.25
    spine_bot = book_cy + book_h * 0.75

    left_outer_x = book_cx - book_w * 0.52
    left_top_y = book_cy - book_h * 0.15
    left_bot_y = book_cy + book_h * 0.65

    right_outer_x = book_cx + book_w * 0.52
    right_top_y = book_cy - book_h * 0.15
    right_bot_y = book_cy + book_h * 0.65

    # Cover base polygon
    cover_poly = [
        (left_outer_x, left_top_y + cover_thickness),
        (spine_x, spine_top + cover_thickness + 6),
        (right_outer_x, right_top_y + cover_thickness),
        (right_outer_x, right_bot_y + cover_thickness),
        (spine_x, spine_bot + cover_thickness + 10),
        (left_outer_x, left_bot_y + cover_thickness)
    ]
    draw.polygon(cover_poly, fill=cover_shadow)

    # 3. Stack of lower pages (block of pages depth)
    pages_depth = 16
    for dy in range(pages_depth, 0, -3):
        shade = int(210 + dy * 2)
        p_color = (shade, int(shade * 0.96), int(shade * 0.88), 255)
        p_poly = [
            (left_outer_x + 3, left_top_y + dy),
            (spine_x, spine_top + dy + 4),
            (right_outer_x - 3, right_top_y + dy),
            (right_outer_x - 3, right_bot_y + dy),
            (spine_x, spine_bot + dy + 6),
            (left_outer_x + 3, left_bot_y + dy)
        ]
        draw.polygon(p_poly, fill=p_color)

    # 4. Open Book Pages (Top surface with curved left and right wings)
    # Left page curve
    left_page_pts = []
    steps = 25
    for i in range(steps + 1):
        t = i / steps
        x = left_outer_x + t * (spine_x - left_outer_x)
        # Arching curve upwards then down into spine
        arch = -math.sin(t * math.pi) * (book_h * 0.18)
        y = left_top_y + t * (spine_top - left_top_y) + arch
        left_page_pts.append((x, y))

    for i in range(steps, -1, -1):
        t = i / steps
        x = left_outer_x + t * (spine_x - left_outer_x)
        arch = -math.sin(t * math.pi) * (book_h * 0.16)
        y = left_bot_y + t * (spine_bot - left_bot_y) + arch
        left_page_pts.append((x, y))

    # Right page curve
    right_page_pts = []
    for i in range(steps + 1):
        t = i / steps
        x = spine_x + t * (right_outer_x - spine_x)
        arch = -math.sin(t * math.pi) * (book_h * 0.18)
        y = spine_top + t * (right_top_y - spine_top) + arch
        right_page_pts.append((x, y))

    for i in range(steps, -1, -1):
        t = i / steps
        x = spine_x + t * (right_outer_x - spine_x)
        arch = -math.sin(t * math.pi) * (book_h * 0.16)
        y = spine_bot + t * (right_bot_y - spine_bot) + arch
        right_page_pts.append((x, y))

    # Draw page polygons with soft warm cream/white
    draw.polygon(left_page_pts, fill=(255, 252, 240, 255))
    draw.polygon(right_page_pts, fill=(255, 252, 240, 255))

    # Soft page crease line
    draw.line([(spine_x, spine_top - 2), (spine_x, spine_bot + 4)], fill=(217, 185, 140, 180), width=3)

    # 5. Inner golden radiant glow across pages
    inner_glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ig_draw = ImageDraw.Draw(inner_glow)
    ig_draw.ellipse(
        (spine_x - book_w * 0.35, spine_top, spine_x + book_w * 0.35, spine_bot),
        fill=(254, 240, 138, 220)
    )
    ig_draw.ellipse(
        (spine_x - book_w * 0.2, spine_top + 10, spine_x + book_w * 0.2, spine_bot - 10),
        fill=(255, 255, 255, 240)
    )
    inner_glow = inner_glow.filter(ImageFilter.GaussianBlur(18))

    # Mask inner glow to the pages
    mask = Image.new('L', (w, h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.polygon(left_page_pts, fill=255)
    m_draw.polygon(right_page_pts, fill=255)
    book_layer.paste(inner_glow, (0, 0), mask)

    return book_layer, (left_page_pts, right_page_pts)

def create_complete_composition():
    # Load original 3D deer
    deer_src = Image.open('public/assets/light.png').convert('RGBA')
    
    # 1. TRANSPARENT COMPANION PNG (w=600, h=620)
    canvas_w, canvas_h = 640, 640
    comp = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))

    # Position book at bottom center
    book_w = 460
    book_h = 160
    book_cx = canvas_w // 2
    book_cy = canvas_h - 130

    book_img, _ = render_book_layer(canvas_w, canvas_h, book_cx, book_cy, book_w, book_h)
    
    # Scale deer to stand gracefully on book
    # Deer original is 328x474. Scale to ~380 height
    deer_scale = 390 / deer_src.height
    deer_w = int(deer_src.width * deer_scale)
    deer_h = int(deer_src.height * deer_scale)
    deer_resized = deer_src.resize((deer_w, deer_h), Image.Resampling.LANCZOS)

    # Position deer so its hooves rest on the illuminated book surface
    deer_x = (canvas_w - deer_w) // 2
    deer_y = book_cy - deer_h + 45 # hooves contact pages

    # Hoof soft warm cast shadows on pages
    shadow_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    # 4 hooves contact ovals
    s_draw.ellipse((deer_x + deer_w * 0.28, deer_y + deer_h - 22, deer_x + deer_w * 0.42, deer_y + deer_h - 10), fill=(217, 119, 6, 90))
    s_draw.ellipse((deer_x + deer_w * 0.52, deer_y + deer_h - 32, deer_x + deer_w * 0.65, deer_y + deer_h - 18), fill=(217, 119, 6, 85))
    s_draw.ellipse((deer_x + deer_w * 0.64, deer_y + deer_h - 18, deer_x + deer_w * 0.76, deer_y + deer_h - 6), fill=(217, 119, 6, 95))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(6))

    # Composite Book -> Hoof Shadows -> Deer
    comp = Image.alpha_composite(comp, book_img)
    comp = Image.alpha_composite(comp, shadow_layer)
    comp.paste(deer_resized, (deer_x, deer_y), deer_resized)

    # 2. Antler Flame Light Halos
    flame_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    f_draw = ImageDraw.Draw(flame_layer)
    
    # Antler tip positions relative to scaled deer
    left_flame_x = deer_x + int(deer_w * 0.22)
    left_flame_y = deer_y + int(deer_h * 0.08)
    right_flame_x = deer_x + int(deer_w * 0.78)
    right_flame_y = deer_y + int(deer_h * 0.08)

    for fx, fy in [(left_flame_x, left_flame_y), (right_flame_x, right_flame_y)]:
        f_draw.ellipse((fx - 35, fy - 35, fx + 35, fy + 35), fill=(245, 158, 11, 160))
        f_draw.ellipse((fx - 18, fy - 18, fx + 18, fy + 18), fill=(254, 240, 138, 240))
        f_draw.ellipse((fx - 8, fy - 8, fx + 8, fy + 8), fill=(255, 255, 255, 255))
    flame_layer = flame_layer.filter(ImageFilter.GaussianBlur(10))
    comp = Image.alpha_composite(comp, flame_layer)

    # 3. Floating Magical Sparkles and Stars (matching user's uploaded illustration)
    sparkle_layer = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
    sp_draw = ImageDraw.Draw(sparkle_layer)
    
    stars = [
        (book_cx - 200, book_cy - 120, 8, 3, (254, 240, 138, 230)),
        (book_cx - 160, book_cy - 240, 10, 4, (255, 255, 255, 240)),
        (book_cx - 180, book_cy - 340, 12, 4, (251, 191, 36, 240)),
        (book_cx + 190, book_cy - 140, 9, 3, (254, 240, 138, 220)),
        (book_cx + 170, book_cy - 260, 11, 4, (255, 255, 255, 250)),
        (book_cx + 150, book_cy - 360, 8, 3, (251, 191, 36, 210)),
        (book_cx - 60, book_cy - 40, 6, 2, (254, 240, 138, 240)),
        (book_cx + 80, book_cy - 60, 7, 2.5, (255, 255, 255, 240)),
        (left_flame_x - 30, left_flame_y - 20, 9, 3, (254, 240, 138, 255)),
        (right_flame_x + 35, right_flame_y - 15, 9, 3, (254, 240, 138, 255)),
    ]
    for sx, sy, ro, ri, col in stars:
        create_star(sp_draw, sx, sy, ro, ri, col, 4)
    
    # Tiny golden glowing dust particles
    particles = [
        (book_cx - 130, book_cy - 20, 3, (254, 240, 138, 200)),
        (book_cx + 120, book_cy - 30, 3, (254, 240, 138, 200)),
        (book_cx - 90, book_cy - 80, 2.5, (255, 255, 255, 220)),
        (book_cx + 100, book_cy - 100, 2.5, (255, 255, 255, 220)),
        (book_cx - 40, book_cy - 160, 2, (251, 191, 36, 180)),
        (book_cx + 50, book_cy - 180, 2, (251, 191, 36, 180)),
    ]
    for px, py, pr, pcol in particles:
        sp_draw.ellipse((px - pr, py - pr, px + pr, py + pr), fill=pcol)

    comp = Image.alpha_composite(comp, sparkle_layer)

    # Save transparent avatar PNG
    comp.save('public/assets/light.png', 'PNG')
    comp.save('public/assets/light_v2.png', 'PNG')
    comp.save('public/assets/light_happy.png', 'PNG')
    print('Transparent Xiao Deng with Book saved to public/assets/light.png')

    # 4. FULL SCENE (with rich midnight blue starry sky, matching user image 1:1)
    scene_w, scene_h = 960, 540 # 16:9
    scene = Image.new('RGBA', (scene_w, scene_h), (0, 0, 0, 255))
    sc_draw = ImageDraw.Draw(scene)

    # Midnight navy radial gradient background
    bg_gradient = Image.new('RGBA', (scene_w, scene_h), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_gradient)
    # Deep navy base
    sc_draw.rectangle((0, 0, scene_w, scene_h), fill=(16, 20, 48, 255))
    # Soft central atmospheric illumination
    bg_draw.ellipse(
        (scene_w * 0.1, -100, scene_w * 0.9, scene_h * 1.1),
        fill=(30, 38, 85, 255)
    )
    bg_draw.ellipse(
        (scene_w * 0.25, scene_h * 0.2, scene_w * 0.75, scene_h * 0.95),
        fill=(48, 56, 115, 200)
    )
    bg_gradient = bg_gradient.filter(ImageFilter.GaussianBlur(60))
    scene = Image.alpha_composite(scene, bg_gradient)

    # Scatter delicate starry sky background
    random.seed(42)
    sky_layer = Image.new('RGBA', (scene_w, scene_h), (0, 0, 0, 0))
    sky_draw = ImageDraw.Draw(sky_layer)
    for _ in range(35):
        kx = random.randint(30, scene_w - 30)
        ky = random.randint(20, int(scene_h * 0.8))
        kr = random.choice([1, 1.5, 2])
        alpha = random.randint(90, 230)
        sky_draw.ellipse((kx - kr, ky - kr, kx + kr, ky + kr), fill=(210, 220, 255, alpha))
        if random.random() < 0.25:
            create_star(sky_draw, kx, ky, 5, 1.8, (240, 245, 255, alpha), 4)
    scene = Image.alpha_composite(scene, sky_layer)

    # Composite Xiao Deng & Book centered onto scene
    # Scale comp to fit scene nicely (e.g. 500x500)
    target_comp_h = int(scene_h * 0.92)
    target_comp_w = int(canvas_w * (target_comp_h / canvas_h))
    comp_scaled = comp.resize((target_comp_w, target_comp_h), Image.Resampling.LANCZOS)

    paste_x = (scene_w - target_comp_w) // 2
    paste_y = (scene_h - target_comp_h) // 2 + 15
    scene.paste(comp_scaled, (paste_x, paste_y), comp_scaled)

    scene.save('public/assets/light_scene.png', 'PNG')
    scene.save('public/assets/light_book_scene.png', 'PNG')
    print('Full Scene saved to public/assets/light_scene.png')

create_complete_composition()
