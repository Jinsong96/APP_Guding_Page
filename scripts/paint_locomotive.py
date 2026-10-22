#!/usr/bin/env python3
import math
import struct
import subprocess
import os

W = 427
H = 852

with open('/tmp/original.rgba', 'rb') as f:
    buf = bytearray(f.read())

def get_pixel(x, y):
    if 0 <= x < W and 0 <= y < H:
        idx = (int(y) * W + int(x)) * 4
        return buf[idx], buf[idx+1], buf[idx+2], buf[idx+3]
    return 0, 0, 0, 0

def blend(x, y, r, g, b, a):
    if 0 <= x < W and 0 <= y < H and a > 0:
        idx = (int(y) * W + int(x)) * 4
        inv = 1.0 - a
        buf[idx]   = int(buf[idx] * inv + r * a)
        buf[idx+1] = int(buf[idx+1] * inv + g * a)
        buf[idx+2] = int(buf[idx+2] * inv + b * a)

def fill_rect(x1, y1, x2, y2, r, g, b, a):
    for y in range(int(y1), int(y2)+1):
        for x in range(int(x1), int(x2)+1):
            blend(x, y, r, g, b, a)

# 1. Driver Cab & Transitional Body (x: 282 -> 324, y: 382 -> 472)
# Midnight navy cab matching the carriage style, with gold roof trim
for y in range(382, 474):
    for x in range(282, 325):
        ny = (y - 382) / 92.0
        # Cylinder shading with top highlight
        col_t = 0.25 + 0.45 * (1.0 - math.pow(ny - 0.25, 2))
        r = int(24 + 18 * col_t)
        g = int(36 + 26 * col_t)
        b = int(60 + 40 * col_t)
        # Soft blend at boundary
        edge_a = 1.0
        if x < 286:
            edge_a = (x - 282) / 4.0
        blend(x, y, r, g, b, edge_a * 0.98)

# Cab window (Arched warm glowing window with passengers / warm lantern light)
for y in range(400, 442):
    for x in range(292, 316):
        # Arched top
        if y < 408:
            dx = (x - 304) / 12.0
            arch_limit = 408 - math.sqrt(max(0, 1.0 - dx*dx)) * 8
            if y < arch_limit:
                continue
        # Interior warm golden gradient
        t = (y - 400) / 42.0
        wr = int(255 - t * 20)
        wg = int(225 - t * 50)
        wb = int(140 - t * 80)
        # Window frame border
        is_border = (x <= 293 or x >= 314 or y <= 401 or y >= 440)
        if is_border:
            blend(x, y, 215, 175, 75, 0.9)
        else:
            blend(x, y, wr, wg, wb, 0.95)

# 2. Main Boiler Barrel (x: 318 -> 372, y: 395 -> 470)
# Rounded horizontal cylinder lying along tracks
for y in range(396, 472):
    for x in range(318, 372):
        ny = (y - 396) / 76.0
        # 3D cylindrical lighting (bright reflection on upper curve, deep shadow underneath)
        light = math.cos((ny - 0.28) * math.pi * 0.85)
        light = max(0.0, light)
        br = int(20 + 35 * light)
        bg = int(32 + 48 * light)
        bb = int(55 + 75 * light)
        # Slightly darker toward the front
        front_p = (x - 318) / 54.0
        br = int(br * (1.0 - front_p * 0.12))
        bg = int(bg * (1.0 - front_p * 0.12))
        bb = int(bb * (1.0 - front_p * 0.12))
        blend(x, y, br, bg, bb, 0.98)

# Boiler Brass Straps (Golden hoops encircling boiler at x=325, x=348)
for strap_x in [326, 348]:
    for y in range(396, 470):
        for dx in range(-1, 2):
            ny = (y - 396) / 74.0
            spec = max(0.0, math.cos((ny - 0.28) * math.pi))
            sr = int(190 + 65 * spec)
            sg = int(150 + 55 * spec)
            sb = int(50 + 40 * spec)
            blend(strap_x + dx, y, sr, sg, sb, 0.9)

# 3. Smokebox Front Face (Circular Boiler Door at front: x ~ 366 -> 378, y: 404 -> 466)
# Elliptical front plate angled along track curve
center_fx = 369
center_fy = 434
radius_fx = 9
radius_fy = 31

for y in range(center_fy - radius_fy - 3, center_fy + radius_fy + 4):
    for x in range(center_fx - radius_fx - 3, center_fx + radius_fx + 4):
        dx = (x - center_fx) / float(radius_fx)
        dy = (y - center_fy) / float(radius_fy)
        dist = math.sqrt(dx*dx + dy*dy)
        if dist <= 1.0:
            # Curved convex front cap
            depth = math.sqrt(1.0 - dist*dist)
            fr = int(18 + 25 * depth)
            fg = int(26 + 32 * depth)
            fb = int(45 + 50 * depth)
            # Rim ring
            if dist > 0.82:
                fr, fg, fb = 200, 160, 60
            blend(x, y, fr, fg, fb, 0.98)
        elif dist <= 1.15:
            # Soft anti-aliased edge
            alpha = (1.15 - dist) / 0.15 * 0.6
            blend(x, y, 20, 28, 48, alpha)

# Central Brass Compass Star on Boiler Door
star_cx = 369
star_cy = 434
for y in range(star_cy - 7, star_cy + 8):
    for x in range(star_cx - 4, star_cx + 5):
        dx = abs(x - star_cx)
        dy = abs(y - star_cy)
        if dx + dy * 0.5 <= 4.0 or dy + dx * 0.5 <= 6.0:
            blend(x, y, 240, 200, 80, 0.95)

# 4. Chimney / Smokestack (x: 334 -> 344, y: 368 -> 398)
for y in range(368, 399):
    t = (y - 368) / 30.0 # 0 at top, 1 at base
    half_w = 4.0 + (1.0 - t) * 1.5 # slight flare at top
    for x in range(int(339 - half_w), int(339 + half_w) + 1):
        # Cylinder shading
        cx = (x - 339) / half_w
        c_shade = max(0.0, math.cos(cx * math.pi * 0.5))
        cr = int(22 + 30 * c_shade)
        cg = int(32 + 38 * c_shade)
        cb = int(50 + 55 * c_shade)
        blend(x, y, cr, cg, cb, 0.98)

# Chimney Flanged Crown (Brass rim on top at y=368 -> 371)
for y in range(368, 372):
    for x in range(333, 346):
        blend(x, y, 225, 185, 75, 0.95)

# Soft billowing puffs of steam from the chimney top
for sy, sx, rad, alpha in [(362, 336, 12, 0.45), (354, 332, 16, 0.35), (345, 326, 22, 0.25), (336, 318, 28, 0.18)]:
    for y in range(sy - rad, sy + rad + 1):
        for x in range(sx - rad, sx + rad + 1):
            d = math.sqrt((x - sx)**2 + (y - sy)**2)
            if d < rad:
                puff_a = math.cos(d / rad * math.pi * 0.5) * alpha
                blend(x, y, 250, 246, 238, puff_a)

# 5. Brass Steam Dome (x: 317 -> 327, y: 378 -> 396)
for y in range(378, 397):
    dy = (y - 378) / 18.0
    half_dw = math.sqrt(max(0.0, 1.0 - (dy - 1.0)**2)) * 5.0
    for x in range(int(322 - half_dw), int(322 + half_dw) + 1):
        blend(x, y, 225, 180, 70, 0.95)
# Dome brass highlight
blend(321, 383, 255, 245, 180, 0.9)
blend(322, 383, 255, 245, 180, 0.9)

# 6. Prominent Golden Headlight Lantern (车头聚光大探照灯)
# Centered on front of locomotive: x = 373, y = 432
hl_cx = 373
hl_cy = 432

# Outer golden glow halo
for y in range(hl_cy - 30, hl_cy + 31):
    for x in range(hl_cx - 20, hl_cx + 45):
        d = math.sqrt((x - hl_cx)**2 * 0.6 + (y - hl_cy)**2)
        if d < 28:
            glow_a = math.pow((28 - d) / 28.0, 1.8) * 0.65
            blend(x, y, 255, 215, 90, glow_a)

# Forward lantern light cone projecting onto tracks ahead
for y in range(410, 485):
    for x in range(376, 427):
        ang_y = (y - hl_cy) / float(max(1, x - hl_cx))
        # Beam points forward and slightly downward onto rails
        if -0.25 <= ang_y <= 0.7:
            beam_dist = (x - 376) / 51.0
            beam_a = (1.0 - beam_dist * 0.7) * 0.38 * (1.0 - abs(ang_y - 0.25) / 0.5)
            beam_a = max(0.0, beam_a)
            blend(x, y, 255, 240, 160, beam_a)

# Brass Lantern Housing
for y in range(hl_cy - 8, hl_cy + 9):
    for x in range(hl_cx - 4, hl_cx + 7):
        dx = (x - hl_cx)
        dy = (y - hl_cy)
        d = math.sqrt(dx*dx + dy*dy)
        if d <= 7.5:
            blend(x, y, 205, 160, 55, 0.98)

# Glowing Lantern Core (brilliant warm starlight lens)
for y in range(hl_cy - 6, hl_cy + 7):
    for x in range(hl_cx - 1, hl_cx + 6):
        dx = (x - (hl_cx + 1))
        dy = (y - hl_cy)
        d = math.sqrt(dx*dx + dy*dy)
        if d <= 5.0:
            blend(x, y, 255, 250, 205, 1.0)
        elif d <= 6.2:
            blend(x, y, 255, 205, 60, 0.95)

# Center brilliant star spark
fill_rect(hl_cx + 1, hl_cy - 1, hl_cx + 2, hl_cy + 1, 255, 255, 255, 1.0)

# 7. Cowcatcher / Pilot Grill at front bottom (x: 366 -> 382, y: 466 -> 483)
# Slanted wedge on tracks
for y in range(466, 484):
    ty = (y - 466) / 17.0
    start_x = int(366 + ty * 3)
    end_x = int(374 + ty * 9)
    for x in range(start_x, min(W, end_x + 1)):
        # Slanted ribs
        is_rib = (x - start_x) % 3 == 0
        if is_rib:
            blend(x, y, 210, 165, 60, 0.95)
        else:
            blend(x, y, 25, 35, 55, 0.9)

# 8. Drive Wheel & Connecting Rod (x: 326 -> 362, y: 460 -> 482)
# Spoked steel wheel
wcx, wcy, wrad = 344, 471, 11
for y in range(wcy - wrad, wcy + wrad + 1):
    for x in range(wcx - wrad, wcx + wrad + 1):
        d = math.sqrt((x - wcx)**2 + (y - wcy)**2)
        if d <= wrad:
            if d > wrad - 2.5:
                # Steel rim
                blend(x, y, 140, 155, 180, 0.95)
            elif d < 3.0:
                # Brass central hub
                blend(x, y, 220, 180, 70, 0.98)
            else:
                # Spoke pattern
                ang = math.atan2(y - wcy, x - wcx)
                spoke = math.cos(ang * 6)
                if spoke > 0.4:
                    blend(x, y, 100, 115, 140, 0.9)
                else:
                    blend(x, y, 15, 22, 38, 0.85)

# Piston connecting rod (steel bar from x=334 to x=366, y=471)
for x in range(334, 367):
    for y in range(470, 473):
        blend(x, y, 190, 200, 215, 0.95)

# Save result back to raw
with open('/tmp/with_locomotive.rgba', 'wb') as f:
    f.write(buf)

print("Locomotive painted successfully!")
