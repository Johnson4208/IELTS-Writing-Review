(() => {
  const reviews = window.REVIEWS || [];
  const grid = document.querySelector('#review-grid');
  const search = document.querySelector('#search');
  const empty = document.querySelector('#empty-state');
  const overlay = document.querySelector('#detail-overlay');
  const detail = document.querySelector('#detail-content');
  let activeFilter = 'all';
  let previousFocus = null;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const band = score => Number(score).toFixed(1);
  const clampTitle = text => text.length > 55 ? `${text.slice(0, 52)}…` : text;

  function renderWelcome() {
    const notes = reviews.flatMap(review => [...review.paragraphs, ...(review.relatedDraft?.paragraphs || [])].flatMap(paragraph => paragraph.annotations || []));
    document.querySelector('#total-notes').textContent = notes.length;
    const featuredReview = reviews[0];
    const featuredNote = featuredReview?.paragraphs.flatMap(paragraph => paragraph.annotations || [])
      .find(note => note.quote && note.fix && note.quote !== note.fix);
    const primary = document.querySelector('#welcome-open');

    if (!featuredReview) {
      primary.hidden = true;
      return;
    }
    primary.dataset.open = featuredReview.id;
    primary.href = '#review-detail/' + encodeURIComponent(featuredReview.id);
    if (!featuredNote) return;
    document.querySelector('#preview-title').textContent = featuredReview.title;
    document.querySelector('#preview-task').textContent = featuredReview.typeLabel;
    document.querySelector('#preview-quote').textContent = featuredNote.quote;
    document.querySelector('#preview-fix').textContent = featuredNote.fix;
    document.querySelector('#welcome-preview').hidden = false;
  }

  function renderCards() {
    const query = search.value.trim().toLocaleLowerCase('vi');
    const filtered = reviews.filter(review => {
      const categoryMatch = activeFilter === 'all' || review.type === activeFilter;
      const queryMatch = !query || `${review.title} ${review.prompt} ${review.topic}`.toLocaleLowerCase('vi').includes(query);
      return categoryMatch && queryMatch;
    });
    grid.innerHTML = filtered.map((review, index) => `
      <article class="review-card" style="--card-delay:${index * 60}ms">
        <div class="card-topline"><span class="type-label">${escapeHtml(review.typeLabel)}</span><span class="band-pill">Band <b>${band(review.band)}</b></span></div>
        <div class="topic-line">${escapeHtml(review.topic)} <span>·</span> ${escapeHtml(review.date)}</div>
        <h3>${escapeHtml(clampTitle(review.title))}</h3>
        <p class="prompt-preview">${escapeHtml(review.prompt)}</p>
        <div class="card-bottom"><span class="word-meta">${escapeHtml(String(review.wordCount))} từ <i>·</i> ${escapeHtml(review.paragraphs.length + ' đoạn được nhận xét')}</span><button class="open-review" data-open="${escapeHtml(review.id)}" aria-label="Mở bài: ${escapeHtml(review.title)}">Mở bài <i class="bi bi-arrow-up-right" aria-hidden="true"></i></button></div>
      </article>`).join('');
    empty.hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
    document.querySelector('#sample-link').hidden = !reviews.some(review => review.modelEssay?.length);
    document.querySelector('#total-reviews').textContent = String(reviews.length).padStart(2, '0');
    document.querySelector('#heading-count').textContent = reviews.length;
    const average = reviews.length ? reviews.reduce((sum, item) => sum + Number(item.band), 0) / reviews.length : null;
    document.querySelector('#average-band').textContent = average ? band(average) : '—';
  }


  const shell = document.querySelector('.app-shell');
  const icon = name => '<i class="bi bi-' + name + '" aria-hidden="true"></i>';
  const kinds = {grammar:'Ngữ pháp',style:'Diễn đạt',task:'Bám sát đề',evidence:'Lập luận',development:'Phát triển ý',vocabulary:'Từ vựng',collocation:'Kết hợp từ'};

  function highlightOriginal(original, annotations, paragraphIndex) {
    const ranges = [];
    annotations.forEach(({quote, quotes, sentence}, index) => {
      const sentenceStart = sentence ? original.indexOf(sentence) : 0;
      if (sentenceStart < 0) return;
      const limit = sentence ? sentenceStart + sentence.length : original.length;
      for (const excerpt of quotes || [quote]) {
        if (!excerpt) continue;
        const start = original.toLowerCase().indexOf(excerpt.toLowerCase(), sentenceStart);
        const end = start + excerpt.length;
        if (start < 0 || end > limit) continue;
        if (ranges.some(range => start < range.end && end > range.start)) continue;
        ranges.push({start, end, index});
      }
    });
    let cursor = 0;
    let html = '';
    ranges.sort((a,b) => a.start - b.start).forEach(({start,end,index}) => {
      html += escapeHtml(original.slice(cursor,start))
        + '<span role="button" tabindex="0" class="ink-mark" data-note="' + index + '" aria-controls="note-' + paragraphIndex + '-' + index
        + '" aria-expanded="false">' + escapeHtml(original.slice(start,end)) + '<sup>' + (index + 1) + '</sup></span>';
      cursor = end;
    });
    return html + escapeHtml(original.slice(cursor));
  }

  function selectNote(row, index, reveal) {
    row.querySelectorAll('[data-note]').forEach(button => {
      const selected = Number(button.dataset.note) === index;
      button.setAttribute('aria-expanded', String(selected && (reveal || window.matchMedia('(min-width: 1031px)').matches)));
      button.classList.toggle('ink-selected', selected);
    });
    row.querySelectorAll('.margin-note').forEach(note => { note.hidden = Number(note.dataset.index) !== index; });
    if (reveal) row.classList.add('note-open');
  }

  function renderParagraph(paragraph, p, namespace = '') {
    const paragraphKey = namespace + p;
    const notes = paragraph.annotations || [];
    const noteButtons = notes.map((note,i) => '<button type="button" data-note="' + i + '" aria-controls="note-' + paragraphKey + '-' + i
      + '" aria-expanded="false" aria-label="Nhận xét ' + (i + 1) + '">' + (i + 1) + '</button>').join('');
    const noteCards = notes.map((note,i) => '<article class="margin-note" id="note-' + paragraphKey + '-' + i + '" data-index="' + i + '"'
      + (i ? ' hidden' : '') + '><b>' + escapeHtml(kinds[note.kind] || 'Gợi ý') + ' · ' + escapeHtml(note.title)
      + '</b><p>' + escapeHtml(note.body) + '</p><div class="note-fix"><strong>Gợi ý sửa</strong> ' + escapeHtml(note.fix) + '</div></article>').join('');
    return '<section class="notebook-row" id="paragraph-' + paragraphKey + '"><div class="paper-label"><b>P' + (p + 1)
      + '</b><span>' + escapeHtml(paragraph.label) + '</span></div><div class="paper-writing"><p lang="en">'
      + highlightOriginal(paragraph.original,notes,paragraphKey) + '</p>' + (paragraph.summary ? '<details><summary>Nhận xét đoạn</summary><p>' + escapeHtml(paragraph.summary) + '</p></details>' : '')
      + '</div>' + (notes.length ? '<div class="paper-comments"><div class="note-choices" aria-label="Nhận xét đoạn ' + (p + 1) + '">'
      + noteButtons + '</div><div class="note-content" aria-live="polite">' + noteCards + '</div></div>' : '') + '</section>';
  }

  function openReview(id, destination) {
    const review = reviews.find(item => item.id === id);
    if (!review) return;
    previousFocus = document.activeElement;
    const rubric = review.scores.map(item => '<div class="rubric-line" data-criterion="' + escapeHtml(item.short || '') + '"><div><b>' + escapeHtml(item.name) + '</b><strong>'
      + band(item.score) + '</strong></div><p>' + escapeHtml(item.note) + '</p></div>').join('');
    const model = (review.modelEssay || []).map(p => '<p lang="en">' + escapeHtml(p) + '</p>').join('');
    const assessment = review.modelAssessment;
    const modelScore = assessment && typeof assessment.band === 'number' && Number.isFinite(assessment.band)
      ? '<section class="model-assessment" aria-label="Điểm ước lượng bản viết lại"><div><span>BẢN VIẾT LẠI</span><strong>Band ' + band(assessment.band) + '</strong>'
        + (assessment.range ? '<small>Khoảng tham khảo: ' + escapeHtml(assessment.range) + '</small>' : '')
        + '</div><div><b>Điểm ước lượng riêng cho bài viết lại</b><p>' + escapeHtml(assessment.note || '')
        + '</p><small>Đánh giá tham khảo bằng AI, không phải điểm thi chính thức.</small></div></section>'
      : '<p class="model-score-pending">Bản viết lại chưa có điểm ước lượng.</p>';
    const takeaways = (review.takeaways || []).map(p => '<li>' + escapeHtml(p) + '</li>').join('');
    const rewrites = review.paragraphs.filter(p => p.rewrite).map(p => '<article><h3>' + escapeHtml(p.label) + '</h3><p lang="en">'
      + escapeHtml(p.rewrite) + '</p></article>').join('');
    const draft = review.relatedDraft;
    const draftPanel = draft ? '<details class="notebook-model" id="review-draft"><summary>' + icon('journal-text')
      + '<span><b>' + escapeHtml(draft.title) + '</b></span><strong>Mở phần chữa bài</strong></summary><div class="notebook-paper">'
      + '<p class="paper-instruction">' + escapeHtml(draft.summary) + '</p>'
      + draft.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index, 'draft-')).join('') + '</div></details>' : '';
    const totalNotes = review.paragraphs.reduce((sum,p) => sum + (p.annotations || []).length,0);
    detail.innerHTML = '<header class="review-heading"><div><div class="review-task">' + escapeHtml(review.typeLabel)
      + '</div><h1 id="detail-title" tabindex="-1">' + escapeHtml(review.title) + '</h1></div><span>' + icon('calendar3') + ' '
      + escapeHtml(review.date) + '</span></header><div class="review-sheet-layout"><div class="review-sheet-main"><section class="prompt-strip"><b>Đề bài</b><p lang="en">'
      + escapeHtml(review.prompt) + '</p></section><section id="review-errors" class="notebook-paper" tabindex="-1"><h2>Bài viết gốc của bạn</h2>'
      + '<p class="paper-instruction">Bấm vào cụm từ được tô màu hoặc số ghi chú để xem giải thích.</p>' + review.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index)).join('')
      + '</section></div><aside class="review-sidebar"><section class="notebook-score"><h2>Điểm ước lượng</h2><div class="score-display"><strong>'
      + band(review.band) + '</strong><div>' + rubric + '</div></div><details><summary>Nhận xét tổng quan</summary><p>' + escapeHtml(review.verdict)
      + '</p></details></section><nav class="review-jumps" aria-label="Nội dung bài chữa"><button type="button" data-jump="review-errors">'
      + icon('search') + '<span><b>Xem lỗi</b><small>' + totalNotes + ' nhận xét trong bài</small></span>' + icon('arrow-right') + '</button>'
      + (rewrites ? '<button type="button" data-jump="review-rewrites">' + icon('lightbulb') + '<span><b>Câu gợi ý</b><small>Đọc bản viết lại theo đoạn</small></span>' + icon('arrow-right') + '</button>' : '')
      + (model ? '<button type="button" data-jump="review-model">' + icon('book') + '<span><b>Bài mẫu</b><small>Tham khảo cách triển khai ý</small></span>' + icon('arrow-right') + '</button>' : '')
      + (draft ? '<button type="button" data-jump="review-draft">' + icon('journal-text') + '<span><b>Bài 1</b><small>Xem phần chữa bài lạc đề</small></span>' + icon('arrow-right') + '</button>' : '')
      + '</nav></aside></div>'
      + (model ? '<details class="notebook-model" id="review-model"><summary>' + icon('book') + '<span><b>' + escapeHtml(review.modelLabel || 'Bài mẫu tham khảo') + '</b><small lang="en">' + escapeHtml(review.modelEssay[0]) + '</small></span><strong>Xem bài mẫu đầy đủ</strong></summary><div class="model-body">' + modelScore + model + (takeaways ? '<h3>Điểm nên học</h3><ul>' + takeaways + '</ul>' : '') + '</div></details>' : '')
      + draftPanel
      + (rewrites ? '<section class="notebook-rewrites" id="review-rewrites" tabindex="-1"><h2>Câu gợi ý theo từng đoạn</h2>' + rewrites + '</section>' : '');
    if (window.matchMedia('(min-width: 1031px)').matches) {
      detail.querySelectorAll('.notebook-row').forEach(row => selectNote(row, 0, false));
    }
    overlay.hidden = false;
    shell.inert = true;
    document.body.classList.add('modal-open');
    overlay.scrollTop = 0;
    document.querySelector('#detail-title').focus({preventScroll:true});
    history.replaceState(null, '', '#review-detail/' + encodeURIComponent(id));
    if (destination) jumpTo(destination);
  }

  function jumpTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (target instanceof HTMLDetailsElement) target.open = true;
    (target.querySelector('summary') || target).focus({preventScroll:true});
    target.scrollIntoView({block: id === 'review-draft' ? 'center' : 'start'});
  }

  function closeReview() {
    overlay.hidden = true;
    shell.inert = false;
    document.body.classList.remove('modal-open');
    history.replaceState(null, '', location.pathname + location.search + '#reviews');
    if (shell.contains(previousFocus)) previousFocus.focus();
    else search.focus();
  }

  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open]');
    if (opener) {
      event.preventDefault();
      return openReview(opener.dataset.open);
    }
    if (event.target.closest('#sample-link')) {
      event.preventDefault();
      const review = reviews.find(item => item.modelEssay?.length);
      if (review) openReview(review.id,'review-model');
    }
    if (event.target.closest('#close-detail, #back-button')) closeReview();
    if (event.target.closest('[data-library-search]')) search.focus();
    const marker = event.target.closest('[data-note]');
    if (marker) {
      const row = marker.closest('.notebook-row');
      selectNote(row, Number(marker.dataset.note), true);
      const note = document.getElementById(marker.getAttribute('aria-controls'));
      if (note.getBoundingClientRect().bottom > window.innerHeight) note.scrollIntoView({block:'nearest'});
    }
    const jump = event.target.closest('[data-jump]');
    if (jump) jumpTo(jump.dataset.jump);
  });
  document.addEventListener('keydown', event => {
    const marker = event.target.closest('.ink-mark[role="button"]');
    if (marker && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      marker.click();
    }
  });
  document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
    document.querySelector('.filter-chip.selected')?.classList.remove('selected');
    button.classList.add('selected');
    activeFilter = button.dataset.filter;
    renderCards();
  }));
  search.addEventListener('input', renderCards);
  document.querySelector('#view-all').addEventListener('click', event => { event.preventDefault(); activeFilter = 'all'; search.value = ''; document.querySelector('.filter-chip.selected')?.classList.remove('selected'); document.querySelector('[data-filter="all"]').classList.add('selected'); renderCards(); search.focus(); });
  overlay.addEventListener('click', event => { if (event.target === overlay) closeReview(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) closeReview(); });
  renderCards();
  renderWelcome();

  const route = location.hash.match(/^#review-detail\/([^/]+)/);
  if (route) {
    try { openReview(decodeURIComponent(route[1])); } catch (error) {
      if (!(error instanceof URIError)) throw error;
    }
  }
})();
