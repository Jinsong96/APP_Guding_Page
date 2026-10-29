from pathlib import Path
import sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
BOARD = Image.open(ROOT / 'output/companion-motion/reference-board.png').convert('RGB')
OUT = ROOT / 'output/companion-motion/sprites'
OUT.mkdir(parents=True, exist_ok=True)

def cut(name, box, shapes, seeds, blur=0.9):
    im = BOARD.crop(box)
    w, h = im.size
    rough = Image.new('L',(w,h)); d=ImageDraw.Draw(rough)
    for shape in shapes: d.polygon(shape,fill=255)
    arr = np.array(rough)
    # Tight human-specified contour; GrabCut only refines the 6px boundary band.
    kernel=np.ones((3,3),np.uint8)
    inner=cv2.erode(arr,kernel,iterations=5)>0
    outer=cv2.dilate(arr,kernel,iterations=6)>0
    labels=np.zeros((h,w),np.uint8)
    labels[outer]=cv2.GC_PR_BGD
    labels[arr>0]=cv2.GC_PR_FGD
    labels[inner]=cv2.GC_FGD
    for x,y,rx,ry in seeds:
        cv2.ellipse(labels,(x,y),(rx,ry),0,0,360,int(cv2.GC_FGD),-1)
    bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
    cv2.grabCut(cv2.cvtColor(np.array(im),cv2.COLOR_RGB2BGR),labels,None,bg,fg,7,cv2.GC_INIT_WITH_MASK)
    result=np.where((labels==cv2.GC_FGD)|(labels==cv2.GC_PR_FGD),255,0).astype(np.uint8)
    # Keep contour decision local, avoiding over-subtraction of cream-white fur.
    result[inner]=255
    result[~outer]=0
    if name == 'fox-back':
        # The printed back-view panel clips the tail at its right edge. Feather
        # that boundary into a rounded silhouette instead of a vertical cut.
        for yy in range(124,min(218,h)):
            radius=max(0,1-((yy-171)/51)**2)**.5
            cutoff=124+13*radius
            for xx in range(max(0,int(cutoff)-2),w):
                result[yy,xx]=int(result[yy,xx]*max(0,min(1,(cutoff-xx)/4)))
    alpha=Image.fromarray(result).filter(ImageFilter.GaussianBlur(blur))
    rgba=im.convert('RGBA'); rgba.putalpha(alpha)
    rgba.save(OUT/f'{name}.png')
    print(name,rgba.size,alpha.getbbox())

# Lampwick: large left reference illustration; traced separate antler silhouettes from the warm sky.
cut('wick', (210,0,467,342), [
    [(68,211),(66,189),(70,164),(55,162),(39,152),(32,135),(33,113),(40,102),(52,100),(71,109),(86,119),(103,117),(122,116),(151,119),(176,127),(194,132),(210,136),(228,135),(243,147),(248,161),(243,177),(228,185),(208,189),(205,207),(195,220),(179,230),(173,245),(160,255),(158,280),(153,304),(141,314),(123,315),(109,312),(90,309),(77,299),(65,293),(63,269),(56,258),(54,240),(59,222)],
    [(98,123),(89,111),(86,96),(76,83),(68,81),(65,72),(70,65),(76,66),(85,78),(92,78),(94,59),(90,48),(93,33),(98,23),(105,21),(113,26),(118,35),(115,47),(108,62),(105,72),(109,74),(121,60),(130,57),(137,60),(143,69),(138,76),(129,81),(122,89),(118,110),(123,119)],
    [(175,132),(178,112),(183,101),(181,82),(177,74),(180,66),(187,64),(193,69),(196,82),(202,89),(208,85),(212,73),(212,59),(216,48),(224,44),(232,48),(237,58),(234,72),(228,83),(221,93),(227,99),(238,97),(245,103),(247,111),(242,118),(228,124),(204,126),(194,136)]
], [(125,165,37,35),(112,262,28,33),(91,296,11,9),(105,44,5,7),(222,60,4,7),(195,108,7,10)])

cut('fox-front',(490,425,660,650), [
    [(8,120),(18,108),(19,82),(20,46),(27,21),(32,17),(39,20),(54,42),(70,36),(84,35),(101,34),(116,17),(125,19),(133,32),(139,74),(142,99),(150,116),(146,126),(134,136),(128,147),(135,160),(140,175),(134,185),(137,201),(130,211),(105,215),(51,215),(36,211),(22,203),(14,190),(10,164),(23,155),(25,140),(12,135)]
], [(79,90,40,36),(82,178,27,29),(35,47,5,10),(122,47,5,10)])
cut('fox-side',(655,425,852,650), [
    [(9,119),(18,112),(24,93),(36,67),(56,48),(70,24),(81,15),(88,19),(91,31),(96,15),(103,12),(108,21),(107,65),(120,75),(139,86),(153,96),(171,113),(184,140),(191,170),(187,192),(172,207),(125,212),(67,215),(40,211),(29,206),(29,176),(20,165),(24,138),(10,134)]
], [(72,93,38,32),(132,153,36,38),(68,185,27,21)])
cut('fox-back',(850,425,992,650), [
    [(5,107),(13,97),(23,74),(32,25),(40,15),(48,17),(65,48),(78,45),(86,22),(95,18),(101,25),(111,75),(121,91),(129,100),(131,110),(123,122),(114,129),(116,147),(134,152),(137,189),(128,208),(99,215),(41,214),(17,209),(11,197),(13,172),(16,149),(20,129),(5,119)]
], [(67,96,38,38),(75,179,32,28),(90,37,4,8)])
