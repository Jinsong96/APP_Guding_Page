import math, random
from PIL import Image, ImageDraw, ImageFilter

def bezier_point(p0, p1, p2, p3, t):
    x = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
    y = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
    return (x, y)

def sample_curve(p0, p1, p2, p3, steps=30):
    return [bezier_point(p0, p1, p2, p3, i / steps) for i in range(steps + 1)]

def draw_star(draw, cx, cy, r_out, r_in, fill):
    pts = []
    for i in range(8):
        r = r_out if i % 2 == 0 else r_in
        ang = i * math.pi / 4 - math.pi / 2
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, fill=fill)

def render_3d_book(w, h, cx, cy, scale=1.0):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Perspective book dimensions
    bw = 380 * scale
    bh = 130 * scale
    
    # Key coordinates
    spine_x = cx
    spine_top_y = cy - bh * 0.25
    spine_bot_y = cy + bh * 0.45

    left_top_x = cx - bw * 0.52
    left_top_y = cy - bh * 0.35
    left_bot_x = cx - bw * 0.48
    left_bot_y = cy + bh * 0.40

    right_top_x = cx + bw * 0.52
    right_top_y = cy - bh * 0.25
    right_bot_x = cx + bw * 0.48
    right_bot_y = cy + bh * 0.48

    thickness = 28 * scale

    # 1. Hardcover Base (thick dark navy/brown binder)
    cover_poly = [
        (left_top_x - 12, left_top_y + thickness),
        (spine_x, spine_top_y + thickness + 12),
        (right_top_x + 12, right_top_y + thickness),
        (right_bot_x + 16, right_bot_y + thickness + 12),
        (spine_x, spine_bot_y + thickness + 16),
        (left_bot_x - 16, left_bot_y + thickness + 12)
    ]
    # Rounded dark cover
    draw.polygon(cover_poly, fill=(28, 22, 42, 255))

    # 2. Page Block Depth (layers of paper along front edges)
    # Left front edge stack
    left_block = [
        (left_bot_x, left_bot_y),
        (spine_x, spine_bot_y),
        (spine_x, spine_bot_y + thickness),
        (left_bot_x - 6, left_bot_y + thickness)
    ]
    draw.polygon(left_block, fill=(185, 172, 195, 255))

    # Right front edge stack
    right_block = [
        (spine_x, spine_bot_y),
        (right_bot_x, right_bot_y),
        (right_bot_x + 6, right_bot_y + thickness),
        (spine_x, spine_bot_y + thickness)
    ]
    draw.polygon(right_block, fill=(205, 195, 215, 255))

    # Paper line striations along page block
    for s in range(4, int(thickness), 4):
        draw.line([(left_bot_x - 4, left_bot_y + s), (spine_x, spine_bot_y + s)], fill=(160, 145, 170, 180), width=1)
        draw.line([(spine_x, spine_bot_y + s), (right_bot_x + 4, right_bot_y + s)], fill=(175, 160, 185, 180), width=1)

    # 3. Open Book Curved Pages
    # Left Page Curves: Top edge, Spine, Bottom edge, Outer edge
    left_top_curve = sample_curve(
        (left_top_x, left_top_y),
        (cx - bw * 0.35, left_top_y + bh * 0.08),
        (cx - bw * 0.15, spine_top_y - bh * 0.12),
        (spine_x, spine_top_y)
    )
    left_bot_curve = sample_curve(
        (spine_x, spine_bot_y),
        (cx - bw * 0.15, spine_bot_y - bh * 0.10),
        (cx - bw * 0.35, left_bot_y + bh * 0.08),
        (left_bot_x, left_bot_y)
    )
    left_outer_curve = sample_curve(
        (left_bot_x, left_bot_y),
        (left_bot_x - 10, (left_top_y + left_bot_y)/2),
        (left_top_x - 5, (left_top_y + left_bot_y)/2),
        (left_top_x, left_top_y)
    )
    left_page_poly = left_top_curve + [(spine_x, spine_bot_y)] + left_bot_curve + left_outer_curve

    # Right Page Curves
    right_top_curve = sample_curve(
        (spine_x, spine_top_y),
        (cx + bw * 0.15, spine_top_y - bh * 0.12),
        (cx + bw * 0.35, right_top_y + bh * 0.08),
        (right_top_x, right_top_y)
    )
    right_outer_curve = sample_curve(
        (right_top_x, right_top_y),
        (right_top_x + 8, (right_top_y + right_bot_y)/2),
        (right_bot_x + 5, (right_top_y + right_bot_y)/2),
        (right_bot_x, right_bot_y)
    )
    right_bot_curve = sample_curve(
        (right_bot_x, right_bot_y),
        (cx + bw * 0.35, right_bot_y + bh * 0.08),
        (cx + bw * 0.15, spine_bot_y - bh * 0.10),
        (spine_x, spine_bot_y)
    )
    right_page_poly = right_top_curve + right_outer_curve + right_bot_curve

    # Draw pages with warm paper colors
    draw.polygon(left_page_poly, fill=(248, 244, 235, 255))
    draw.polygon(right_page_poly, fill=(255, 252, 245, 255))

    # Multiple subtle page leaf layers beneath top page
    draw.line(left_outer_curve, fill=(215, 205, 190, 200), width=2)
    draw.line(right_outer_curve, fill=(215, 205, 190, 200), width=2)
    draw.line([(spine_x, spine_top_y), (spine_x, spine_bot_y)], fill=(200, 175, 140, 220), width=3)

    # 4. Warm Golden Light radiating from open pages
    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse(
        (spine_x - bw * 0.32, cy - bh * 0.3, spine_x + bw * 0.32, cy + bh * 0.5),
        fill=(254, 240, 138, 240)
    )
    g_draw.ellipse(
        (spine_x - bw * 0.18, cy - bh * 0.18, spine_x + bw * 0.18, cy + bh * 0.38),
        fill=(255, 255, 255, 255)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(16))

    # Mask golden glow to pages only
    mask = Image.new('L', (w, h), 0)
    m_draw = ImageDraw.Draw(mask)
    m_draw.polygon(left_page_poly, fill=255)
    m_draw.polygon(right_page_poly, fill=255)
    img.paste(glow, (0, 0), mask)

    return img, (left_page_poly, right_page_poly)

def create_full_scene():
    w, h = 960, 540
    scene = Image.new('RGBA', (w, h), (0, 0, 0, 255))
    draw = ImageDraw.Draw(scene)

    # Deep Midnight Navy Gradient Background
    for y in range(h):
        t = y / h
        # From #12183c at top to #0a0d24 at bottom
        r = int(18 * (1-t) + 10 * t)
        g = int(24 * (1-t) + 13 * t)
        b = int(60 * (1-t) + 36 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Soft radial ambient glow behind book & character
    ambient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    amb_draw = ImageDraw.Draw(ambient)
    amb_draw.ellipse((w*0.2, h*0.1, w*0.8, h*0.95), fill=(35, 45, 95, 220))
    amb_draw.ellipse((w*0.3, h*0.3, w*0.7, h*0.88), fill=(245, 158, 11, 80))
    ambient = ambient.filter(ImageFilter.GaussianBlur(55))
    scene = Image.alpha_composite(scene, ambient)

    # Delicate background stars
    random.seed(101)
    stars_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    st_draw = ImageDraw.Draw(stars_layer)
    for _ in range(45):
        sx = random.randint(25, w - 25)
        sy = random.randint(20, int(h * 0.85))
        r = random.choice([1, 1.2, 1.8])
        a = random.randint(110, 240)
        st_draw.ellipse((sx - r, sy - r, sx + r, sy + r), fill=(220, 230, 255, a))
        if random.random() < 0.2:
            draw_star(st_draw, sx, sy, 4.5, 1.5, (240, 245, 255, a))
    scene = Image.alpha_composite(scene, stars_layer)

    # 3D Book
    book_cx = w // 2
    book_cy = h - 135
    book_img, _ = render_3d_book(w, h, book_cx, book_cy, scale=1.12)
    scene = Image.alpha_composite(scene, book_img)

    # Load 3D fawn deer and position on book
    deer_src = Image.open('public/assets/light.png').convert('RGBA')
    # Resize deer
    target_deer_h = 320
    target_deer_w = int(deer_src.width * (target_deer_h / deer_src.height))
    deer_scaled = deer_src.resize((target_deer_w, target_deer_h), Image.Resampling.LANCZOS)

    deer_x = book_cx - target_deer_w // 2 + 5
    deer_y = book_cy - target_deer_h + 38

    # Soft contact shadows on book pages where hooves stand
    shadows = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadows)
    # 4 Hoof contact shadows
    sh_draw.ellipse((deer_x + target_deer_w * 0.32, deer_y + target_deer_h - 18, deer_x + target_deer_w * 0.44, deer_y + target_deer_h - 8), fill=(180, 110, 30, 120))
    sh_draw.ellipse((deer_x + target_deer_w * 0.54, deer_y + target_deer_h - 26, deer_x + target_deer_w * 0.66, deer_y + target_deer_h - 14), fill=(180, 110, 30, 110))
    sh_draw.ellipse((deer_x + target_deer_w * 0.65, deer_y + target_deer_h - 14, deer_x + target_deer_w * 0.77, deer_y + target_deer_h - 5), fill=(180, 110, 30, 120))
    shadows = shadows.filter(ImageFilter.GaussianBlur(5))
    scene = Image.alpha_composite(scene, shadows)

    # Paste Deer
    scene.paste(deer_scaled, (deer_x, deer_y), deer_scaled)

    # Warm upward glow reflected on deer belly and hooves
    warm_refl = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    wr_draw = ImageDraw.Draw(warm_refl)
    wr_draw.ellipse(
        (book_cx - 110, book_cy - 70, book_cx + 110, book_cy + 25),
        fill=(254, 240, 138, 140)
    )
    warm_refl = warm_refl.filter(ImageFilter.GaussianBlur(22))
    scene = Image.alpha_composite(scene, warm_refl)

    # Glowing Flame Tips on Antlers
    flame_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    fl_draw = ImageDraw.Draw(flame_layer)
    fx1 = deer_x + int(target_deer_w * 0.23)
    fy1 = deer_y + int(target_deer_h * 0.08)
    fx2 = deer_x + int(target_deer_w * 0.77)
    fy2 = deer_y + int(target_deer_h * 0.08)

    for fx, fy in [(fx1, fy1), (fx2, fy2)]:
        fl_draw.ellipse((fx - 32, fy - 32, fx + 32, fy + 32), fill=(245, 158, 11, 150))
        fl_draw.ellipse((fx - 16, fy - 16, fx + 16, fy + 16), fill=(254, 240, 138, 230))
        fl_draw.ellipse((fx - 7, fy - 7, fx + 7, fy + 7), fill=(255, 255, 255, 255))
        draw_star(fl_draw, fx, fy, 14, 4, (255, 255, 255, 220))
    flame_layer = flame_layer.filter(ImageFilter.GaussianBlur(7))
    scene = Image.alpha_composite(scene, flame_layer)

    # Floating magical sparkles and dust motes rising from book
    magic_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    mg_draw = ImageDraw.Draw(magic_layer)
    sp_list = [
        (book_cx - 180, book_cy - 80, 8, 3, (254, 240, 138, 240)),
        (book_cx - 150, book_cy - 190, 10, 3.5, (255, 255, 255, 250)),
        (book_cx - 170, book_cy - 280, 12, 4, (251, 191, 36, 230)),
        (book_cx + 170, book_cy - 100, 9, 3, (254, 240, 138, 230)),
        (book_cx + 150, book_cy - 210, 11, 4, (255, 255, 255, 250)),
        (book_cx + 140, book_cy - 300, 8, 3, (251, 191, 36, 220)),
        (book_cx - 50, book_cy - 40, 6, 2, (254, 240, 138, 240)),
        (book_cx + 70, book_cy - 50, 7, 2.5, (255, 255, 255, 240)),
        (fx1 - 35, fy1 - 15, 9, 3, (254, 240, 138, 255)),
        (fx2 + 35, fy2 - 15, 9, 3, (254, 240, 138, 255)),
    ]
    for mx, my, ro, ri, c in sp_list:
        draw_star(mg_draw, mx, my, ro, ri, c)

    # Small circular glowing particles
    for px, py, pr, pc in [
        (book_cx - 100, book_cy - 20, 3, (254, 240, 138, 220)),
        (book_cx + 90, book_cy - 30, 3, (254, 240, 138, 220)),
        (book_cx - 60, book_cy - 90, 2.5, (255, 255, 255, 240)),
        (book_cx + 75, book_cy - 110, 2.5, (255, 255, 255, 240)),
        (book_cx - 20, book_cy - 150, 2, (251, 191, 36, 200)),
        (book_cx + 35, book_cy - 170, 2, (251, 191, 36, 200)),
    ]:
        mg_draw.ellipse((px-pr, py-pr, px+pr, py+pr), fill=pc)

    scene = Image.alpha_composite(scene, magic_layer)

    # Save full 16:9 illustration
    scene.save('public/assets/light_scene.png', 'PNG')
    print('Generated public/assets/light_scene.png (960x540)')

    # Also create the centered 1:1 transparent avatar version for avatar slots
    crop_w = int(w * 0.58)
    crop_h = int(h * 0.95)
    crop_x = (w - crop_w) // 2
    crop_y = int(h * 0.05)
    
    # Isolate character + book onto transparent background
    avatar_canvas = Image.new('RGBA', (crop_w, crop_h), (0, 0, 0, 0))
    # Paste relevant layers from book, shadows, deer, glow, sparkles
    # Render book relative to avatar canvas
    ab_cx = crop_w // 2
    ab_cy = crop_h - 105
    ab_book, _ = render_3d_book(crop_w, crop_h, ab_cx, ab_cy, scale=1.0)
    avatar_canvas = Image.alpha_composite(avatar_canvas, ab_book)

    ad_h = 300
    ad_w = int(deer_src.width * (ad_h / deer_src.height))
    ad_scaled = deer_src.resize((ad_w, ad_h), Image.Resampling.LANCZOS)
    ad_x = ab_cx - ad_w // 2 + 5
    ad_y = ab_cy - ad_h + 35

    # Shadows
    ashadows = Image.new('RGBA', (crop_w, crop_h), (0, 0, 0, 0))
    ash_draw = ImageDraw.Draw(ashadows)
    ash_draw.ellipse((ad_x + ad_w * 0.32, ad_y + ad_h - 18, ad_x + ad_w * 0.44, ad_y + ad_h - 8), fill=(180, 110, 30, 120))
    ash_draw.ellipse((ad_x + ad_w * 0.54, ad_y + ad_h - 26, ad_x + ad_w * 0.66, ad_y + ad_h - 14), fill=(180, 110, 30, 110))
    ash_draw.ellipse((ad_x + ad_w * 0.65, ad_y + ad_h - 14, ad_x + ad_w * 0.77, ad_y + ad_h - 5), fill=(180, 110, 30, 120))
    ashadows = ashadows.filter(ImageFilter.GaussianBlur(5))
    avatar_canvas = Image.alpha_composite(avatar_canvas, ashadows)

    avatar_canvas.paste(ad_scaled, (ad_x, ad_y), ad_scaled)

    # Flames
    aflame = Image.new('RGBA', (crop_w, crop_h), (0, 0, 0, 0))
    afl_draw = ImageDraw.Draw(aflame)
    afx1 = ad_x + int(ad_w * 0.23)
    afy1 = ad_y + int(ad_h * 0.08)
    afx2 = ad_x + int(ad_w * 0.77)
    afy2 = ad_y + int(ad_h * 0.08)
    for fx, fy in [(afx1, afy1), (afx2, afy2)]:
        afl_draw.ellipse((fx - 28, fy - 28, fx + 28, fy + 28), fill=(245, 158, 11, 150))
        afl_draw.ellipse((fx - 14, fy - 14, fx + 14, fy + 14), fill=(254, 240, 138, 230))
        afl_draw.ellipse((fx - 6, fy - 6, fx + 6, fy + 6), fill=(255, 255, 255, 255))
        draw_star(afl_draw, fx, fy, 12, 3.5, (255, 255, 255, 220))
    aflame = aflame.filter(ImageFilter.GaussianBlur(6))
    avatar_canvas = Image.alpha_composite(avatar_canvas, aflame)

    # Sparkles
    asparkle = Image.new('RGBA', (crop_w, crop_h), (0, 0, 0, 0))
    asp_draw = ImageDraw.Draw(asparkle)
    for mx, my, ro, ri, c in [
        (ab_cx - 150, ab_cy - 70, 7, 2.5, (254, 240, 138, 240)),
        (ab_cx - 130, ab_cy - 160, 9, 3, (255, 255, 255, 250)),
        (ab_cx - 140, ab_cy - 240, 11, 3.5, (251, 191, 36, 230)),
        (ab_cx + 140, ab_cy - 80, 8, 2.5, (254, 240, 138, 230)),
        (ab_cx + 130, ab_cy - 180, 10, 3.5, (255, 255, 255, 250)),
        (ab_cx + 120, ab_cy - 260, 8, 2.5, (251, 191, 36, 220)),
        (afx1 - 25, afy1 - 12, 8, 2.5, (254, 240, 138, 255)),
        (afx2 + 25, afy2 - 12, 8, 2.5, (254, 240, 138, 255)),
    ]:
        draw_star(asp_draw, mx, my, ro, ri, c)
    avatar_canvas = Image.alpha_composite(avatar_canvas, asparkle)

    # Save to public/assets/light.png, light_v2.png, light_happy.png
    avatar_canvas.save('public/assets/light.png', 'PNG')
    avatar_canvas.save('public/assets/light_v2.png', 'PNG')
    avatar_canvas.save('public/assets/light_happy.png', 'PNG')
    print('Generated transparent avatar to public/assets/light.png')

create_full_scene()
