#!/bin/bash
u="$1"
slug=$(echo "$u" | sed -E 's#https://www.azmicrocredit.org/?##'); [ -z "$slug" ] && slug=index
slug=$(python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]))" "$slug" | sed -E 's#[/:?&|]#__#g; s/[^A-Za-z0-9._-]/_/g')
[ -s "raw/$slug.html" ] || curl -sL -A "Mozilla/5.0" "$u" -o "raw/$slug.html"
if [ ! -s "shots/$slug.png" ]; then
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,6000 --virtual-time-budget=12000 --screenshot="shots/$slug.png" "$u" >/dev/null 2>&1
fi
echo "done $slug"
