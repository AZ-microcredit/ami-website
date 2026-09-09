#!/usr/bin/env python3
"""Parse Wix event pages into src/data/events.js"""
import os, re, json
from bs4 import BeautifulSoup
RAW='raw'; OUT='/Users/atailor/PROJECTS/ami website/src/data/events.js'
MEDIA_DIR='/Users/atailor/PROJECTS/ami website/public/media'
def media_local(url):
    m=re.search(r'media/([^/]+~mv2\.[a-z]+)', url or '')
    if not m: return None
    uri=m.group(1); fn=uri.replace('~mv2','')
    p=os.path.join(MEDIA_DIR,fn)
    if not os.path.exists(p) or os.path.getsize(p)==0:
        os.system(f'curl -sL -A Mozilla/5.0 -o "{p}" "https://static.wixstatic.com/media/{uri}"')
    return '/media/'+fn
events=[]
for f in sorted(os.listdir(RAW)):
    if not f.startswith('event-details-registration__') or f.endswith('__form.html'): continue
    slug=f[len('event-details-registration__'):-5]
    s=BeautifulSoup(open(os.path.join(RAW,f),encoding='utf-8',errors='ignore').read(),'html.parser')
    ld={}
    for sc in s.find_all('script',type='application/ld+json'):
        try:
            d=json.loads(sc.get_text())
            if isinstance(d,dict) and d.get('@type')=='Event': ld=d
        except Exception: pass
    g=lambda hk: (s.find(attrs={'data-hook':hk}) or BeautifulSoup('','html.parser')).get_text(' ',strip=True)
    title=g('event-title') or ld.get('name','')
    about=s.find(attrs={'data-hook':'about-section'})
    paras=[]
    if about:
        for p in about.find_all(['p','li','h2','h3','h4']):
            t=p.get_text(' ',strip=True)
            if t and t!='About the event': paras.append(t)
    # links inside about
    links=[(a.get_text(' ',strip=True),a.get('href')) for a in (about.find_all('a') if about else []) if a.get('href')]
    closed=s.find(attrs={'data-hook':'closed-registration'}) is not None
    rsvp=s.find(attrs={'data-hook':'RSVP_INFO_BUTTON'}) or s.find(attrs={'data-hook':'rsvp-button'})
    rsvp_href=rsvp.get('href') if rsvp and rsvp.name=='a' else None
    rsvp_label=rsvp.get_text(' ',strip=True) if rsvp else None
    loc=ld.get('location',{}) or {}
    img=ld.get('image',{}) or {}
    image=media_local(img.get('url') if isinstance(img,dict) else None)
    if not image:
        ie=s.find(attrs={'data-hook':'event-image'}); im=ie.find('img') if ie else None
        image=media_local(im.get('src')) if im else None
    cats=[]
    if re.search(r'business builder', title, re.I): cats.append('business-builders-program')
    ext=None
    for t,h in links:
        if h and ('forms.gle' in h or 'docs.google.com/forms' in h or 'eventbrite' in h or 'zoom.us' in h or 'lu.ma' in h): ext=h; break
    events.append(dict(slug=slug,title=title,start=ld.get('startDate'),end=ld.get('endDate'),
        shortDate=g('event-short-date'),shortLocation=g('event-short-location'),
        fullDate=g('event-full-date'),fullLocation=g('event-full-location'),
        locationName=loc.get('name'),address=loc.get('address') if isinstance(loc.get('address'),str) else (loc.get('address') or {}).get('streetAddress'),
        online=('Online' in str(ld.get('eventAttendanceMode',''))),
        image=image,description=paras,links=links,registrationClosed=closed,rsvpLabel=rsvp_label,rsvpHref=rsvp_href,registrationUrl=ext,categories=cats))
    print(slug,'|',title,'|',ld.get('startDate'),'|',closed,rsvp_label,rsvp_href,'|',len(paras),'paras', image)
events.sort(key=lambda e: e['start'] or '', reverse=True)
with open(OUT,'w') as fh:
    fh.write('// Generated from the live Wix Events pages. Edit freely; keep the shape.\n')
    fh.write('// start/end are ISO strings; description is an array of paragraphs.\n')
    fh.write('export const events = '+json.dumps(events,indent=1,ensure_ascii=False)+';\n')
print(len(events),'events')
