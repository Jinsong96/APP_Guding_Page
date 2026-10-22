#!/usr/bin/env python3
import os
import subprocess

SVG_PATH = "scripts/locomotive_overlay.svg"
PNG_OVERLAY = "/tmp/locomotive_overlay.png"
BASE_IMG = "public/assets/readpal-start-scene.orig.png"
OUTPUT_IMG = "public/assets/readpal-start-scene.png"

def main():
    if not os.path.exists(SVG_PATH):
        print(f"Error: {SVG_PATH} not found.")
        return
    
    print("Rendering SVG to PNG overlay...")
    subprocess.run(["rsvg-convert", "-w", "427", "-h", "852", "-o", PNG_OVERLAY, SVG_PATH], check=True)
    
    print("Compositing onto base scene...")
    subprocess.run(["convert", BASE_IMG, PNG_OVERLAY, "-composite", OUTPUT_IMG], check=True)
    print(f"Successfully generated {OUTPUT_IMG}")

if __name__ == "__main__":
    main()
