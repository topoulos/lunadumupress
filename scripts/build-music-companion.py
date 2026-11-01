"""Regenerate Psalms cards after editing data/music-book3.json. No dependencies."""
from pathlib import Path
import json, re, html
ROOT = Path(__file__).resolve().parents[1]
def esc(value): return html.escape(str(value), quote=True)
def render(data):
    tracks = {t['id']: t for t in data['tracks']}
    assert len(tracks) == len(data['tracks']), 'Duplicate track IDs'
    assert len({c['id'] for c in data['cues']}) == len(data['cues']), 'Duplicate cue IDs'
    section_ids = {s['id'] for s in data['sections']}
    for cue in data['cues']:
        assert cue['sectionId'] in section_ids
        assert cue['trackId'] in tracks
        assert cue['spoilerLevel'] == 'book3'
        assert all(s in data['scenes'] for s in cue['sceneIds'])
    cards = []
    for section in data['sections']:
        cards.append(f'<div class="companion-act" id="{esc(section["id"])}"><h2 class="companion-act-label">{esc(section["title"])}</h2></div>')
        for cue in [c for c in data['cues'] if c['sectionId'] == section['id']]:
            track = tracks[cue['trackId']]
            scenes = [data['scenes'][s] for s in cue['sceneIds']]
            numbers = [s['id'].split('-S')[1] for s in scenes]
            anchor = ('Scene ' if len(numbers) == 1 else 'Scenes ') + ' / '.join(numbers) if scenes else cue['label']
            anchor = cue.get('displayLabel') or anchor
            links = []
            for platform, label, cls in [('youtube','▶ YouTube','yt'), ('spotify','Spotify','sp'), ('apple','Apple','ap')]:
                url = track['links'].get(platform)
                if url:
                    assert url.startswith('https://'), f'Invalid URL: {url}'
                    links.append(f'<a class="track-link {cls}" href="{esc(url)}" target="_blank" rel="noopener noreferrer">{label}</a>')
            notes = []
            if scenes:
                notes.append('<ul class="cue-scenes">'+''.join(f'<li><strong>{esc(s["title"])}</strong><small>{esc(s["id"])} · {esc(s["location"])} · {esc(s["date"])} · {esc(s["timeOfDay"])}</small></li>' for s in scenes)+'</ul>')
            if cue.get('sceneAnchor'): notes.append(f'<p class="cue-anchor">{esc(cue["sceneAnchor"])}</p>')
            if cue.get('timing'): notes.append(f'<p><strong>Cue timing:</strong> {esc(cue["timing"])}</p>')
            if cue['commentary']:
                notes.append('<p><strong>Tony’s listening notes</strong></p>')
                notes.extend(f'<p>{esc(p)}</p>' for p in cue['commentary'].split('\n\n'))
            cid = esc(cue['id'])
            detail = ' · '.join(filter(None,[track.get('sourceWork'),track.get('version')]))
            status = '<span class="cc-badge">Original score · in progress</span>' if track['status']=='in-progress' else ''
            cards.append(f'''<article class="track-card" id="{cid}" aria-labelledby="{cid}-title">
  <div class="track-header">
    <div class="track-scene-info"><div class="track-location">Cue {cid.split('-')[1]} · {esc(section['title'].split(' · ')[0])}</div><div class="track-scene-name">{esc(anchor)}</div></div>
    <div class="track-info"><h3 class="track-name" id="{cid}-title">{esc(track['title'])}</h3><div class="track-artist">{esc(track['artist'])}</div>{f'<div class="track-artist">{esc(detail)}</div>' if detail else ''}{status}<div class="track-links">{''.join(links)}</div></div>
  </div>
  <div class="track-notes-section">
    <button type="button" class="track-reveal-btn" aria-expanded="false" aria-controls="{cid}-notes"><em class="reveal-icon" aria-hidden="true">▾</em> Show scenes &amp; notes</button>
    <div class="track-spoiler-content" id="{cid}-notes" hidden>{''.join(notes)}</div>
  </div>
</article>''')
    return '\n'.join(cards)
if __name__ == '__main__':
    data = json.loads((ROOT/'data/music-book3.json').read_text())
    page = ROOT/'music-book3.html'
    body = page.read_text()
    body = re.sub(r'<!-- CUES:START -->.*?<!-- CUES:END -->', lambda _: '<!-- CUES:START -->\n'+render(data)+'\n<!-- CUES:END -->', body, flags=re.S)
    body = re.sub(r"<span>\d+ cues</span><span>\d+ selections</span>", f'<span>{len(data["cues"])} cues</span><span>{len(data["tracks"])} selections</span>', body)
    page.write_text(body)
    print(f'Rendered {len(data["cues"])} cues, {len(data["tracks"])} selections, {len(data["scenes"])} scenes.')
