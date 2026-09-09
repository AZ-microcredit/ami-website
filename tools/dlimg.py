#!/usr/bin/env python3
"""Collect all wixstatic media URLs from content dumps and download originals into project public/media/"""
import os,re,sys,subprocess,hashlib,json
from concurrent.futures import ThreadPoolExecutor
src='content'; dst='/Users/atailor/PROJECTS/ami website/public/media'
os.makedirs(dst,exist_ok=True)
urls=set()
for f in os.listdir(src):
    for u in re.findall(r'https://static\.wixstatic\.com/media/[A-Za-z0-9_~.%-]+', open(os.path.join(src,f)).read()):
        urls.add(u)
mapping={}
def name_for(u):
    fn=u.rsplit('/',1)[1].replace('~mv2','')
    return fn
def dl(u):
    fn=name_for(u); p=os.path.join(dst,fn)
    if not os.path.exists(p) or os.path.getsize(p)==0:
        # original: append /v1/fill/w_2000,h_2000,al_c,q_90/ for jpg to limit size? just fetch raw url
        r=subprocess.run(['curl','-sL','-A','Mozilla/5.0','-o',p,u])
    return u,fn
with ThreadPoolExecutor(8) as ex:
    for u,fn in ex.map(dl,sorted(urls)): mapping[u]=fn
json.dump(mapping,open('media_map.json','w'),indent=1)
print(len(urls),'images')
