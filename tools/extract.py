#!/usr/bin/env python3
"""Extract readable content (headings, text, links, images, buttons, iframes) from Wix SSR HTML in DOM order."""
import sys, os, re, json
from bs4 import BeautifulSoup, NavigableString, Tag

SKIP_TAGS = {'script','style','noscript','svg','template'}

def img_src(img):
    for a in ('src','data-src'):
        v = img.get(a)
        if v and v.startswith('http'): return v
    ss = img.get('srcset') or img.get('data-srcset')
    if ss:
        return ss.split(',')[0].strip().split(' ')[0]
    return None

def clean_wix_url(u):
    # strip wix transform to get original media
    m = re.match(r'(https://static\.wixstatic\.com/media/[^/]+)', u)
    return m.group(1) if m else u

def walk(node, out, depth=0):
    for ch in node.children:
        if isinstance(ch, NavigableString):
            continue
        if not isinstance(ch, Tag): continue
        if ch.name in SKIP_TAGS: continue
        # hidden data-testid mesh containers etc are fine
        if ch.name in ('h1','h2','h3','h4','h5','h6'):
            t = ch.get_text(' ', strip=True)
            if t: out.append(f"{'#'*int(ch.name[1])} {t}")
            # links inside heading
            for a in ch.find_all('a', href=True):
                out.append(f"  [link in heading] {a.get_text(' ',strip=True)} -> {a['href']}")
            continue
        if ch.name in ('p','li','blockquote','figcaption','td','th','label','summary','dt','dd'):
            t = ch.get_text(' ', strip=True)
            if t:
                # style hints
                st = ''
                fs = re.search(r'font-size:\s*([\d.]+px)', str(ch))
                if fs: st = f" {{{fs.group(1)}}}"
                out.append(f"{ch.name}: {t}{st}")
            for a in ch.find_all('a', href=True):
                out.append(f"  [link] {a.get_text(' ',strip=True)} -> {a['href']}")
            for im in ch.find_all('img'):
                s = img_src(im)
                if s: out.append(f"  [img] alt='{im.get('alt','')}' {clean_wix_url(s)}")
            continue
        if ch.name == 'img':
            s = img_src(ch)
            if s: out.append(f"[img] alt='{ch.get('alt','')}' {clean_wix_url(s)}")
            continue
        if ch.name == 'a' and ch.get('href'):
            t = ch.get_text(' ', strip=True)
            imgs = ch.find_all('img')
            if imgs:
                for im in imgs:
                    s = img_src(im)
                    if s: out.append(f"[img-link] alt='{im.get('alt','')}' {clean_wix_url(s)} -> {ch['href']}")
            if t and not ch.find(['p','h1','h2','h3','h4','h5','h6','li']):
                out.append(f"[a] {t} -> {ch['href']}" + (f" (aria: {ch.get('aria-label')})" if ch.get('aria-label') else ''))
                continue
            elif not t and not imgs:
                out.append(f"[a] (icon/empty) -> {ch['href']}" + (f" (aria: {ch.get('aria-label')})" if ch.get('aria-label') else ''))
                continue
        if ch.name == 'button':
            t = ch.get_text(' ', strip=True)
            out.append(f"[button] {t or ch.get('aria-label','')}")
            continue
        if ch.name == 'iframe':
            out.append(f"[iframe] src={ch.get('src') or ch.get('data-src')} title={ch.get('title')}")
            continue
        if ch.name in ('input','textarea','select'):
            out.append(f"[{ch.name}] name={ch.get('name')} placeholder={ch.get('placeholder')} type={ch.get('type')} aria={ch.get('aria-label')}")
            continue
        if ch.name == 'video' or ch.name == 'source':
            out.append(f"[{ch.name}] src={ch.get('src')} poster={ch.get('poster')}")
        # background images on divs
        style = ch.get('style','')
        m = re.search(r'background-image:\s*url\(([^)]+)\)', style)
        if m:
            u = m.group(1).strip().strip('"').strip("'")
            out.append(f"[bg] {clean_wix_url(u)}")
        # section markers
        if ch.name == 'section' or (ch.get('data-testid') in ('section','columns','column') ):
            cid = ch.get('id','')
            bg = ''
            out.append(f"--- <{ch.name} id={cid} data-testid={ch.get('data-testid')}>")
        if ch.name == 'main' or ch.name=='header' or ch.name=='footer':
            out.append(f"===== <{ch.name.upper()}> =====")
        walk(ch, out, depth+1)
        # text directly inside spans/divs not in p (Wix rich text sometimes uses span in div)
        if ch.name in ('span','div') and not ch.find(['p','h1','h2','h3','h4','h5','h6','li','a','img','button','div']):
            t = ch.get_text(' ', strip=True)
            if t and len(t) > 1:
                out.append(f"text: {t}")

def extract(path):
    html = open(path, encoding='utf-8', errors='ignore').read()
    s = BeautifulSoup(html, 'html.parser')
    out = []
    title = s.title.get_text(strip=True) if s.title else ''
    desc = s.find('meta', attrs={'name':'description'})
    out.append(f"TITLE: {title}")
    if desc: out.append(f"DESC: {desc.get('content')}")
    body = s.body
    walk(body, out)
    # dedupe consecutive duplicates
    res=[]
    for l in out:
        if res and res[-1]==l: continue
        res.append(l)
    return '\n'.join(res)

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if not f.endswith('.html'): continue
        try:
            txt = extract(os.path.join(src,f))
        except Exception as e:
            txt = f"ERROR {e}"
        open(os.path.join(dst, f[:-5]+'.txt'),'w').write(txt)
    print('ok')
