# Shared review template

All reviews are rendered by openReview() and renderParagraph() in app.js. Add future essays to window.REVIEWS in data.js and reuse these renderers; do not create separate per-essay layouts.

Preserve the notebook layout, paragraph annotations, sidebar scores, model rewrite and optional relatedDraft. Keep all fonts upright.

Score colors identify criteria, not score levels: overall purple, TR green, CC blue, LR lavender, GRA apricot. Each scores entry must provide its short key (TR, CC, LR, GRA), name, score and note. Labels and numeric scores must remain visible so information does not depend on color alone. The data-criterion attribute provides stable colors even if criteria order changes.

Keep the existing responsive behavior: sidebar beside the essay on desktop and above the essay on mobile. New reviews automatically inherit the shared CSS and rendering template.

## Rewrite assessment
Add modelAssessment: {band: number, range: string, note: string, source: string} after independently assessing the full modelEssay. Never copy the original score or assign a default high score. The model assessment is shown above the full rewrite, separately from original scores. Missing assessment shows 'not yet estimated'. Reassess whenever the model essay changes. Estimates are AI learning feedback, not official exam results.
