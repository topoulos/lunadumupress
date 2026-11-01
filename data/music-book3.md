# Psalms listening companion

Edit `music-book3.json`, then run `python3 scripts/build-music-companion.py` from the repository root. Serve the root with `python3 -m http.server 8000` and open `/music-book3.html`. No package installation or build service required. Generated HTML remains readable without JavaScript; spoiler content stays hidden.

- `tracks`: reusable musical selections, artist, optional source work/version, nullable platform links and selection status. Repeated music shares a track ID.
- `scenes`: source scene IDs and short orientation metadata. No manuscript summaries are shipped.
- `cues`: ordered placements, track reference, explicit ordered scene IDs, Tony's lightly edited commentary, optional `sceneAnchor` and timing, and required spoiler level. Non-scene interlude/end-title cues use a label.
- `sections`: five acts, the Growing Up interlude, and Afterwards.

The source is Tony's uploaded `Pasted text(20261031-095628).txt`. 88 placements cover 115 source scenes (one scene has two cues), including an untitled commissioned sequence. All scene IDs are preserved; gaps are intentional, not invitations to invent cues for unscored scenes. Commentary was shortened where it retold action; no BEGIN_SUMMARY prose was imported.

Special cases: Winged Serpent covers S183's action; To the Stars begins at that scene's departure and continues through S184. Elijah's original composition covers S165–S169 and has no invented title or listening link. Vampire's Touch retains the approximately 2:27 cutoff. Skyward and Tall Grass use Tony’s corrected YouTube links. Verified Apple Music and Spotify matches render through the existing platform buttons; unresolved links remain null and are omitted. See `music-book3-links.json` for catalog evidence and unresolved selections.

Book 3 uses the site's `spoilerLevel` preference and per-cue Show/Hide interaction. Scene numbers and music metadata stay public; scene titles, locations, timing notes, and commentary require Book 3 plus an explicit per-cue reveal. Lowering the level closes all notes. No-JS defaults closed.

Catalog matching corrected “Vorex” to “Vortex,” “The Immoralist” to “The Immortalist,” and “After Initiation” to “Afterlife Initiation.” “Night” explicitly identifies the Zola Jesus & Dean Hurley remix from the supplied YouTube selection. “Philimelagram” and “The Spirit Within” match the soundtrack catalogs. Alternate catalog credits (for example inola / Young Collective for Glacier) are retained in the link audit. The audit records metadata matching, not audio fingerprint verification; unresolved entries do not establish that a recording is unavailable.

`music-companion.css` derives from Ember's companion style with wrapping/accessibility additions for long titles. Existing Vow and Ember pages are unchanged. The hub links to Psalms; there is no publication step in this phase.

Scene anchors are optional single-sentence orientation, separate from Tony’s musical commentary. Use them only where scene titles or existing notes do not already place the listener. For grouped cues, describe the stretch as a whole; omit outcomes, explanations, and plot recaps. They render inside the same closed spoiler region as the scene details.

`displayLabel` is Tony’s reader-facing name for a cue or grouped scenes. It replaces the public scene-number label without changing source IDs, grouping, or gated commentary. Cues awaiting a name retain their existing labels.
