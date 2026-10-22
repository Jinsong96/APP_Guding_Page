#!/usr/bin/env python3
import math
import struct
import subprocess

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

# Step 1: Smoothly inpaint the 3 small passenger windows on the front carriage (x: 330 to 376, y: 440 to 510)
# This turns the front car from a passenger carriage into a sleek, solid enameled-steel locomotive boiler!
for y in range(435, 510):
    for x in range(330, 376):
        # Only inpaint pixels that are glowing window yellow or window frame
        r, g, b, _ = get_pixel(x, y)
        is_window = (r > 130 and g > 100 and b < 120) or (r > 170 and g > 140)
        if is_window:
            # Sample reference midnight blue body color from x=324 at the same y
            ref_r, ref_g, ref_b, _ = get_pixel(324, min(y, 495))
            # Perspective adjustment: front curves slightly into moonlight shadow
            p = (x - 330) / 46.0
            target_r = int(ref_r * (1.0 - p * 0.1))
            target_g = int(ref_g * (1.0 - p * 0.1))
            target_b = int(ref_b * (1.0 - p * 0.1))
            blend(x, y, target_r, target_g, target_b, 0.95)

# Smooth the boiler body shading horizontally to remove seams
for y in range(440, 502):
    for x in range(332, 374):
        # Soft metallic blur
        acc_r, acc_g, acc_b = 0, 0, 0
        samples = 0
        for dx in range(-2, 3):
            pr, pg, pb, _ = get_pixel(x + dx, y)
            acc_r += pr; acc_g += pg; acc_b += pb
            samples += 1
        blend(x, y, acc_r // samples, acc_g // samples, acc_b // samples, 0.6)

# Step 2: Boiler Brass Straps (Curved golden bands across the locomotive boiler)
for band_x, band_tilt in [(338, 0.2), (356, 0.25)]:
    for y in range(430, 498):
        offset_x = band_x + (y - 430) * band_tilt
        for dx in [-1, 0, 1]:
            px = int(offset_x + dx)
            # Metallic gold reflection
            spec = math.cos((y - 430) / 68.0 * math.pi)
            gold_r = int(210 + 40 * max(0, spec))
            gold_g = int(170 + 35 * max(0, spec))
            gold_b = int(70 + 30 * max(0, spec))
            blend(px, y, gold_r, gold_g, gold_b, 0.85)

# Step 3: Steam Smokestack (Chimney) on the locomotive roof (x ~ 347, y ~ 398 to 430)
# Flanged chimney with 3D cylindrical lighting and brass crown
chim_cx = 347
for y in range(398, 432):
    t = (y - 398) / 34.0  # 0 at top, 1 at roof base
    half_w = 4.2 + (1.0 - t) * 1.6  # flared top
    for x in range(int(chim_cx - half_w - 1), int(chim_cx + half_w + 2)):
        cx = (x - chim_cx) / half_w
        if abs(cx) <= 1.0:
            shade = math.cos(cx * math.pi * 0.5)
            cr = int(28 + 35 * shade)
            cg = int(38 + 45 * shade)
            cb = int(62 + 65 * shade)
            blend(x, y, cr, cg, cb, 0.98)
        elif abs(cx) <= 1.3:
            alpha = (1.3 - abs(cx)) / 0.3 * 0.6
            blend(x, y, 25, 35, 55, alpha)

# Brass crown ring on chimney top (y: 398 to 402)
for y in range(398, 403):
    for x in range(int(chim_cx - 6), int(chim_cx + 7)):
        dx = abs(x - chim_cx) / 6.0
        if dx <= 1.0:
            blend(x, y, 230, 185, 75, 0.95)

# Step 4: Soft Painterly Steam Billowing from Chimney
for sy, sx, rad, alpha in [(392, 345, 10, 0.45), (382, 340, 15, 0.38), (370, 332, 22, 0.28), (356, 322, 28, 0.2)]:
    for y in range(int(sy - rad), int(sy + rad) + 1):
        for x in range(int(sx - rad), int(sx + rad) + 1):
            d = math.sqrt((x - sx)**2 + (y - sy)**2)
            if d < rad:
                puff_a = math.cos(d / rad * math.pi * 0.5) * alpha
                blend(x, y, 252, 248, 240, puff_a)

# Step 5: Brass Steam Dome (x ~ 334, y ~ 406 to 424)
dome_cx, dome_cy = 334, 415
for y in range(406, 426):
    dy = (y - 416) / 10.0
    half_w = math.sqrt(max(0.0, 1.0 - dy*dy)) * 4.8
    for x in range(int(dome_cx - half_w), int(dome_cx + half_w) + 1):
        dx = (x - dome_cx) / max(1, half_w)
        spec = max(0.0, math.cos(dx * math.pi * 0.5) * math.cos(dy * math.pi * 0.5))
        blend(x, y, int(210 + 45 * spec), int(170 + 40 * spec), int(60 + 50 * spec), 0.95)

# Step 6: Prominent Front Golden Headlight (车头聚光大探照灯)
# Positioned at the very front nose of the locomotive: x = 377, y = 478
hl_cx = 377
hl_cy = 478

# 6a. Forward Light Cone shining down the curved rails towards the bridge
for y in range(455, 520):
    for x in range(380, 427):
        ang_y = (y - hl_cy) / float(max(1, x - hl_cx))
        # Beam angles down toward track
        if -0.2 <= ang_y <= 0.65:
            dist = (x - 380) / 47.0
            beam_a = (1.0 - dist * 0.65) * 0.35 * (1.0 - abs(ang_y - 0.2) / 0.45)
            beam_a = max(0.0, beam_a)
            blend(x, y, 255, 235, 150, beam_a)

# 6b. Outer Golden Glow Halo
for y in range(hl_cy - 22, hl_cy + 23):
    for x in range(hl_cx - 16, hl_cx + 25):
        d = math.sqrt((x - hl_cx)**2 * 0.7 + (y - hl_cy)**2)
        if d < 20:
            glow_a = math.pow((20 - d) / 20.0, 1.6) * 0.65
            blend(x, y, 255, 215, 80, glow_a)

# 6c. Brass Lantern Housing & Rim
for y in range(hl_cy - 8, hl_cy + 9):
    for x in range(hl_cx - 5, hl_cx + 8):
        dx = (x - hl_cx)
        dy = (y - hl_cy)
        d = math.sqrt(dx*dx + dy*dy)
        if d <= 7.2:
            blend(x, y, 215, 170, 55, 0.98)

# 6d. Radiant Lens Core
for y in range(hl_cy - 5, hl_cy + 6):
    for x in range(hl_cx - 2, hl_cx + 6):
        dx = (x - (hl_cx + 1))
        dy = (y - hl_cy)
        d = math.sqrt(dx*dx + dy*dy)
        if d <= 4.2:
            blend(x, y, 255, 252, 220, 1.0)
        elif d <= 5.8:
            blend(x, y, 255, 210, 60, 0.95)

# Center lens brilliant highlight
blend(hl_cx + 1, hl_cy, 255, 255, 255, 1.0)
blend(hl_cx + 2, hl_cy, 255, 255, 255, 1.0)
blend(hl_cx + 1, hl_cy - 1, 255, 255, 255, 1.0)

# Step 7: Cowcatcher / Pilot Grill at front lower track (x ~ 376 -> 388, y ~ 505 -> 522)
for y in range(505, 523):
    ty = (y - 505) / 18.0
    start_x = int(376 + ty * 2)
    end_x = int(382 + ty * 6)
    for x in range(start_x, min(W, end_x + 1)):
        is_rib = (x - start_x) % 3 == 0
        if is_rib:
            blend(x, y, 210, 165, 60, 0.9)
        else:
            blend(x, y, 28, 38, 58, 0.85)

with open('/tmp/with_locomotive.rgba', 'wb') as f:
    f.write(buf)

print("Locomotive painted seamlessly!")
