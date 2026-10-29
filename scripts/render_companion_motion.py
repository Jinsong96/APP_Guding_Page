"""Render six 2.5D reference-character motion clips, 720x960/24fps/2s.

Run after prepare_pet_sprites.py. The source board image is only used by preparation;
the rendered alpha sprites reside in output/companion-motion/sprites.
"""
from pathlib import Path
import math, os, subprocess, sys
import cv2
import numpy as np
from PIL import Image
from imageio_ffmpeg import get_ffmpeg_exe

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/companion-motion'
SPRITES = OUT / 'sprites'
FRAMES = OUT / '_frames'
W,H,FPS,N = 720,960,24,48
BG = np.array([250,247,241],dtype=np.uint8)

def load(name):
    return np.array(Image.open(SPRITES/name).convert('RGBA'))

wick = load('wick.png')
fox = {k:load('fox-'+k+'.png') for k in ['front','side','back']}
cat = np.array(Image.open(ROOT/'public/assets/companion-tuanzi-figure.png').convert('RGBA'))

def smooth(a,b,x):
    z=max(0,min(1,(x-a)/(b-a)))
    return z*z*(3-2*z)

def bump(x,a,b,c,d): return smooth(a,b,x)*(1-smooth(c,d,x))

def gauss(t,center,width): return math.exp(-((t-center)/width)**2)

def blink(src, centers, amt, fur, line, one=False):
    if amt < .09: return src
    out=src.copy(); h,w=out.shape[:2]
    for i,(cx,cy,rx,ry) in enumerate(centers):
        if one and i==0: continue
        # Smooth fur-coloured eyelid covers each eye only at blink peak.
        overlay=out.copy()
        cv2.ellipse(overlay,(cx,cy),(rx+2,ry+1),0,0,360,(*fur,255),-1,cv2.LINE_AA)
        opacity=min(1., max(0.,(amt-.14)/.55))
        cv2.addWeighted(overlay,opacity,out,1-opacity,0,dst=out)
        if amt>.55:
            yy=cy+int(ry*.15)
            pts=np.array([(cx-rx+2,yy-1),(cx-rx//2,yy+2),(cx,yy+3),(cx+rx//2,yy+2),(cx+rx-2,yy-1)],np.int32)
            cv2.polylines(out,[pts],False,(*line,255),1,cv2.LINE_AA)
    return out

def deform(src, top_drop=0, side_wave=0, tail_swing=0, stretch=0):
    if max(abs(top_drop),abs(side_wave),abs(tail_swing),abs(stretch))<0.001:return src
    h,w=src.shape[:2]
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32)
    top=np.clip((h*.78-yy)/(h*.58),0,1)**1.6
    # A neck-led nod, anchored feet. A mild ear sway accompanies breathing.
    dy=top_drop*top
    dx=side_wave*top
    if tail_swing:
        tail=np.clip((h*.78-yy)/(h*.22),0,1)
        tail=np.clip(1-tail,0,1) * np.clip((w*.48-xx)/(w*.32),0,1)
        dx+=tail_swing*tail
    if stretch:
        # Follow the body contour while keeping the face comparatively stable.
        lower=np.clip((yy-h*.32)/(h*.62),0,1)
        dx+=-stretch*(xx-w/2)*lower
        dy+=stretch*5*lower
    mx=xx-dx.astype(np.float32); my=yy-dy.astype(np.float32)
    return cv2.remap(src,mx,my,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))

def canvas(bottom=756, shadow_width=158):
    frame=np.empty((H,W,3),dtype=np.uint8);frame[:]=BG
    shade=np.zeros((H,W),np.uint8)
    cv2.ellipse(shade,(W//2,bottom+5),(shadow_width,19),0,0,360,35,-1,cv2.LINE_AA)
    shade=cv2.GaussianBlur(shade,(0,0),12)
    factor=(1-shade[:,:,None].astype(np.float32)/255*0.37)
    frame=(frame.astype(np.float32)*factor).astype(np.uint8)
    return frame

def paste(frame,source,target_h,bottom=750,x=W//2,tilt=0,sx=1,sy=1,mirror=False,fade=1):
    src=source[:,::-1,:].copy() if mirror else source
    h,w=src.shape[:2]; scale=target_h/h
    theta=math.radians(tilt); c=math.cos(theta);s=math.sin(theta)
    # OpenCV source -> output affine with a fixed foot anchor.
    a=scale*sx*c;b=-scale*sy*s
    d=scale*sx*s;e=scale*sy*c
    m=np.array([[a,b,x-a*w/2-b*h],[d,e,bottom-d*w/2-e*h]],np.float32)
    layer=cv2.warpAffine(src,m,(W,H),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
    alpha=layer[:,:,3:4].astype(np.float32)/255*fade
    frame[:]=np.clip(layer[:,:,:3]*alpha+frame*(1-alpha),0,255).astype(np.uint8)
    return frame

def sparkles(frame,t,origin,mode):
    for j in range(8 if mode=='fox' else 6):
        phase=(t-(.35 if mode=='wick' else .28)-j*.067)
        if not 0<phase<1.1:continue
        if mode=='wick':
            ox,oy=origin[j%2]; x=ox+math.sin(j*7.5)*13+math.sin(phase*6+j)*12; y=oy-70*phase
        else:
            theta=phase*2*math.pi*1.35+j*.61
            x=360+195*math.cos(theta); y=510+78*math.sin(theta)-35*phase
        r=max(1,int((3.2+1.5*math.sin(j))*math.sin(min(1,phase*2)*math.pi/2)))
        if 0<x<W and 0<y<H:
            cv2.circle(frame,(int(x),int(y)),r,(246,191,93),-1,cv2.LINE_AA)
            cv2.circle(frame,(int(x),int(y)),max(1,r//2),(255,238,189),-1,cv2.LINE_AA)

def antler_glow(frame,source,t,bright,target_h,bottom):
    # The amber antlers are lit selectively; a blurred bloom remains inside the cutout.
    h,w=source.shape[:2]
    ant=np.zeros((h,w),np.uint8)
    rgb=source[:,:,:3].astype(np.int16)
    selected=(np.indices((h,w))[0]<h*.41)&(source[:,:,3]>20)&(rgb[:,:,0]>210)&(rgb[:,:,1]>135)&(rgb[:,:,2]<204)
    ant[selected]=255
    ant=cv2.GaussianBlur(ant,(0,0),2)
    m=np.array([[target_h/h,0,W/2-(target_h/h)*w/2],[0,target_h/h,bottom-target_h]],np.float32)
    mask=cv2.warpAffine(ant,m,(W,H),flags=cv2.INTER_LINEAR).astype(np.float32)/255
    bloom=cv2.GaussianBlur(mask,(0,0),14)
    alpha=np.clip((mask*.12+bloom*.35)*bright,0,.5)[:,:,None]
    glow=np.array([255,211,111],np.float32)
    frame[:]=np.clip(frame*(1-alpha)+glow*alpha,0,255).astype(np.uint8)

def draw_wick(mode,t):
    idle=mode=='待机'
    f=canvas(bottom=722,shadow_width=137)
    if idle:
        phase=2*math.pi*t
        nod=0.7*math.sin(phase)
        ear=1.5*math.sin(phase+0.1)
        sy=1+.008*math.sin(phase-.5)
        blink_amt=gauss(t,.52,.055)
        glow=.35+.23*(1-math.cos(phase))/2
    else:
        nod=9*bump(t,.06,.50,.68,.94)
        ear=2*bump(t,.68,.85,1.05,1.27)
        sy=1-.016*bump(t,.12,.4,.6,.9)
        blink_amt=gauss(t,1.52,.12)
        glow=.12+.86*smooth(.13,.88,t)
    src=blink(wick,[(107,181,13,15),(163,190,13,15)],blink_amt,(244,222,200),(107,64,47))
    src=deform(src,top_drop=nod,side_wave=ear)
    paste(f,src,600,764,tilt=(.3*math.sin(2*math.pi*t) if idle else -2*bump(t,.08,.48,.70,.96)),sy=sy)
    antler_glow(f,src,t,glow,600,764)
    if not idle:sparkles(f,t,[(300,226),(450,255)],'wick')
    return f

def fox_idle(t):
    f=canvas(bottom=718,shadow_width=130)
    phase=2*math.pi*t
    src=blink(fox['front'],[(52,100,12,11),(103,100,12,11)],gauss(t,.54,.055),(236,143,67),(91,54,38))
    src=deform(src,side_wave=1.4*math.sin(phase),tail_swing=4.5*math.sin(2*phase))
    paste(f,src,492,740,sy=1+.008*math.sin(phase-.4),tilt=.6*math.sin(phase+.3))
    return f

def fox_signature(t):
    f=canvas(bottom=718,shadow_width=130)
    # Five view key poses: front → side → back → opposite side → front.
    # Short crossfades and a foot-anchored horizontal perspective squash imply a spin.
    stages=[(0,.20,'front',False),(.20,.43,'side',False),(.43,.69,'back',False),(.69,.91,'side',True),(.91,1.14,'front',False)]
    active=None
    for a,b,k,flip in stages:
        if a<=t<b:active=(a,b,k,flip);break
    if active is None:active=(1.14,2,'front',False)
    a,b,k,flip=active
    src=fox[k]
    if k=='front' and t>1.31:
        src=blink(src,[(52,100,12,11),(103,100,12,11)],gauss(t,1.62,.105),(236,143,67),(91,54,38),one=True)
    # A soft landing, then tilt and confident wink.
    lift=17*math.sin(math.pi*min(1,t/1.12))**2 if t<1.12 else 0
    tilt=-5*bump(t,1.25,1.49,1.75,1.96)
    width=1-.33*max(gauss(t,b,.045) for b in [.20,.43,.69,.91,1.14])
    paste(f,src,492,740-lift,sx=width,tilt=tilt,mirror=flip)
    sparkles(f,t,(None,None),'fox')
    return f

def cat_idle(t):
    f=canvas(bottom=723,shadow_width=175)
    phase=2*math.pi*t
    src=blink(cat,[(130,74,12,11),(189,73,12,11)],gauss(t,.51,.064),(214,196,179),(101,74,69))
    src=deform(src,side_wave=1.1*math.sin(phase+.9),tail_swing=2.5*math.sin(phase*2))
    paste(f,src,468,741,sx=1+.009*math.sin(phase-.6),sy=1+.016*math.sin(phase-.6))
    return f

def cat_signature(t):
    f=canvas(bottom=723,shadow_width=175)
    stretch=bump(t,.10,.54,.96,1.38)
    yawn=bump(t,.44,.76,1.06,1.28)
    curl=bump(t,1.25,1.56,1.88,2.0)
    src=cat.copy()
    if yawn>.25:
        # A tiny open-mouth yawn beneath the pink nose, fading before the curl.
        overlay=src.copy()
        cv2.ellipse(overlay,(158,104),(7,int(2+10*yawn)),0,0,360,(93,58,59,255),-1,cv2.LINE_AA)
        cv2.ellipse(overlay,(158,108),(3,max(1,int(2+3*yawn))),0,0,360,(211,137,138,255),-1,cv2.LINE_AA)
        cv2.addWeighted(overlay,min(1,yawn*1.5),src,1-min(1,yawn*1.5),0,dst=src)
    src=blink(src,[(130,74,12,11),(189,73,12,11)],max(yawn*.65,curl*.92),(214,196,179),(101,74,69))
    src=deform(src,top_drop=4*stretch,stretch=stretch*.08)
    # Gentle grounded squash/lengthen gives the front paws a reaching silhouette.
    paste(f,src,468,741,sx=1+.16*stretch-.05*curl,sy=1-.09*stretch+.015*curl)
    return f

RENDERERS=[('灯芯','招牌',lambda t:draw_wick('招牌',t)),('灯芯','待机',lambda t:draw_wick('待机',t)),
           ('帕利','招牌',fox_signature),('帕利','待机',fox_idle),
           ('团子','招牌',cat_signature),('团子','待机',cat_idle)]

def main():
    ffmpeg=get_ffmpeg_exe()
    for name,mode,fn in RENDERERS:
        directory=FRAMES/(name+'-'+mode)
        directory.mkdir(parents=True,exist_ok=True)
        initial=None
        for i in range(N):
            t=i/(N-1)*2
            frame=initial.copy() if (mode=='待机' and i==N-1) else fn(t)
            if i==0:initial=frame.copy()
            Image.fromarray(frame,'RGB').save(directory/f'{i:03d}.png',compress_level=1)
        target=OUT/(name+'-'+mode+'.mp4')
        cmd=[ffmpeg,'-hide_banner','-loglevel','error','-y','-framerate',str(FPS),'-i',str(directory/'%03d.png'),
             '-an','-c:v','libx264','-preset','medium',*(['-qp','0'] if mode=='待机' else ['-crf','18']),'-pix_fmt','yuv420p','-g',('1' if mode=='待机' else '24'),'-r',str(FPS),
             '-t','2','-movflags','+faststart',str(target)]
        subprocess.run(cmd,check=True)
        print(f'{target}: {target.stat().st_size/1024:.0f} KiB',flush=True)

if __name__=='__main__':main()
