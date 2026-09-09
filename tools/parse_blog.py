#!/usr/bin/env python3
"""Parse Wix blog posts (raw/single-post__*.html) into src/data/posts.json with cleaned HTML."""
import os, re, json, copy
from bs4 import BeautifulSoup, NavigableString, Tag
RAW='raw'; OUT='/Users/atailor/PROJECTS/ami website/src/data/posts.json'
MEDIA_DIR='/Users/atailor/PROJECTS/ami website/public/media'
KEEP_INLINE={'a','strong','em','u','b','i','br','s','sup','sub','code'}
def media_local(uri):
    fn=uri.replace('~mv2','')
    p=os.path.join(MEDIA_DIR,fn)
    if not os.path.exists(p) or os.path.getsize(p)==0:
        os.system(f'curl -sL -A Mozilla/5.0 -o "{p}" "https://static.wixstatic.com/media/{uri}"')
    return '/media/'+fn
def clean_inline(node, out):
    for ch in node.children:
        if isinstance(ch, NavigableString):
            out.append(str(ch)); continue
        if not isinstance(ch, Tag): continue
        if ch.name in KEEP_INLINE:
            if ch.name=='a':
                href=ch.get('href','')
                href=href.replace('https://www.azmicrocredit.org','')
                inner=[]; clean_inline(ch, inner)
                tgt=' target="_blank" rel="noopener"' if href.startswith('http') else ''
                out.append(f'<a href="{href}"{tgt}>{"".join(inner)}</a>')
            elif ch.name=='br': out.append('<br>')
            else:
                inner=[]; clean_inline(ch, inner)
                # wix uses span with class for bold/italic too
                out.append(f'<{ch.name}>{"".join(inner)}</{ch.name}>')
        elif ch.name=='span':
            cls=' '.join(ch.get('class',[])); st=ch.get('style','')
            inner=[]; clean_inline(ch, inner); txt=''.join(inner)
            if 'font-weight:bold' in st.replace(' ','') or 'bold' in cls.lower(): txt=f'<strong>{txt}</strong>'
            if 'font-style:italic' in st.replace(' ','') or 'italic' in cls.lower(): txt=f'<em>{txt}</em>'
            if 'underline' in st: txt=f'<u>{txt}</u>'
            out.append(txt)
        else:
            clean_inline(ch, out)
def block_html(el):
    """Convert a ricos block element into simplified HTML."""
    name=el.name
    if name in ('p','h1','h2','h3','h4','h5','h6','blockquote'):
        inner=[]; clean_inline(el, inner); t=''.join(inner).strip()
        if not t or t=='​': return ''
        return f'<{name}>{t}</{name}>'
    if name in ('ul','ol'):
        items=[]
        for li in el.find_all('li', recursive=False):
            inner=[]
            for c in li.children:
                if isinstance(c,Tag) and c.name in ('ul','ol'): inner.append(block_html(c))
                elif isinstance(c,Tag) and c.name=='p':
                    ii=[]; clean_inline(c, ii); inner.append(''.join(ii))
                else:
                    ii=[]; clean_inline(c if isinstance(c,Tag) else BeautifulSoup(str(c),'html.parser'), ii); inner.append(''.join(ii))
            items.append(f'<li>{"".join(inner).strip()}</li>')
        return f'<{name}>{"".join(items)}</{name}>'
    if name=='figure' or el.get('data-hook')=='figure-IMAGE':
        wi=el.find('wow-image')
        src=None; alt=''
        if wi and wi.get('data-image-info'):
            info=json.loads(wi['data-image-info']); src=media_local(info['imageData']['uri'])
        im=el.find('img')
        if im:
            alt=im.get('alt','')
            if not src:
                m=re.search(r'media/([^/]+~mv2\.[a-z]+)', im.get('src',''));
                if m: src=media_local(m.group(1))
        cap=el.find('figcaption')
        caph=f'<figcaption>{cap.get_text(" ",strip=True)}</figcaption>' if cap and cap.get_text(strip=True) else ''
        return f'<figure><img src="{src}" alt="{alt}" loading="lazy">{caph}</figure>' if src else ''
    if el.get('data-hook','').startswith('divider'): return '<hr>'
    if el.get('data-hook')=='gap-spacer': return ''
    if el.find('iframe'):
        f=el.find('iframe'); return f'<div class="embed"><iframe src="{f.get("src") or f.get("data-src")}" title="{f.get("title","")}" allowfullscreen loading="lazy"></iframe></div>'
    # container: recurse into children looking for blocks
    parts=[]
    for c in el.find_all(recursive=False):
        parts.append(block_html(c))
    return ''.join(parts)
posts=[]
for f in sorted(os.listdir(RAW)):
    if not f.startswith('single-post__'): continue
    slug=f[len('single-post__'):-5]
    s=BeautifulSoup(open(os.path.join(RAW,f),encoding='utf-8',errors='ignore').read(),'html.parser')
    ld={}
    for sc in s.find_all('script',type='application/ld+json'):
        try:
            d=json.loads(sc.get_text())
            if isinstance(d,dict) and d.get('@type')=='BlogPosting': ld=d
        except Exception: pass
    title_el=s.find(attrs={'data-hook':'post-title'})
    title=title_el.get_text(' ',strip=True) if title_el else ld.get('headline','')
    ttr=s.find(attrs={'data-hook':'time-to-read'})
    cv=s.find(attrs={'data-id':'content-viewer'})
    html=block_html(cv) if cv else ''
    tags=[a.get_text(strip=True) for a in s.select('[data-hook="tag-cloud-root"] a')]
    cats=[(a.get_text(strip=True), a['href'].rsplit('/',1)[-1]) for a in s.select('ul[aria-label="Post categories"] a')]
    img=ld.get('image',{})
    cover=None
    if isinstance(img,dict) and img.get('url'):
        m=re.search(r'media/([^/]+~mv2\.[a-z]+)', img['url'])
        if m: cover=media_local(m.group(1))
    # fallback: first image in content
    if not cover:
        m=re.search(r'<img src="([^"]+)"', html)
        if m: cover=m.group(1)
    posts.append(dict(slug=slug,title=title,description=ld.get('description',''),
        datePublished=ld.get('datePublished'),dateModified=ld.get('dateModified'),
        readTime=ttr.get_text(strip=True) if ttr else '',author=(ld.get('author') or {}).get('name','The AMI Team'),
        cover=cover,tags=tags,categories=[{'name':n,'slug':sl} for n,sl in cats],html=html))
    print(slug, len(html), cover, cats)
json.dump(posts,open(OUT,'w'),indent=1,ensure_ascii=False)
print(len(posts),'posts')
