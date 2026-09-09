#!/usr/bin/env python3
"""Downscale oversized images in public/media in place (max 2000px on the long edge). Keeps filenames/formats."""
import os
from PIL import Image
D='/Users/atailor/PROJECTS/ami website/public/media'
MAX=2000
n=0; saved=0
for f in sorted(os.listdir(D)):
    p=os.path.join(D,f); ext=f.rsplit('.',1)[-1].lower()
    if ext not in ('jpg','jpeg','png','webp'): continue
    try:
        im=Image.open(p); w,h=im.size
    except Exception as e:
        print('skip',f,e); continue
    before=os.path.getsize(p)
    if max(w,h)<=MAX and before<1_500_000: continue
    scale=min(1.0, MAX/max(w,h))
    if scale<1: im=im.resize((round(w*scale),round(h*scale)), Image.LANCZOS)
    if ext in ('jpg','jpeg'):
        im=im.convert('RGB'); im.save(p,'JPEG',quality=85,optimize=True,progressive=True)
    elif ext=='png':
        if im.mode not in ('RGBA','P','LA') : im=im.convert('RGB')
        im.save(p,'PNG',optimize=True)
    else:
        im.save(p,quality=85)
    after=os.path.getsize(p); n+=1; saved+=before-after
print(n,'files, saved',round(saved/1e6),'MB')
