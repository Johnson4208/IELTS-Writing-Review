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
        <div class="card-bottom"><span class="word-meta">${escapeHtml(String(review.wordCount))} từ <i>·</i> ${escapeHtml(review.paragraphs.length + ' đoạn được nhận xét')}</span><button class="open-review" data-open="${escapeHtml(review.id)}" aria-label="Mở bài: ${escapeHtml(review.title)}">Mở bài <span>↗</span></button></div>
      </article>`).join('');
    empty.hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
    document.querySelector('#total-reviews').textContent = String(reviews.length).padStart(2, '0');
    document.querySelector('#nav-count').textContent = reviews.length;
    document.querySelector('#heading-count').textContent = reviews.length;
    const average = reviews.length ? reviews.reduce((sum, item) => sum + Number(item.band), 0) / reviews.length : null;
    document.querySelector('#average-band').textContent = average ? band(average) : '—';
  }

  function highlightOriginal(text, annotations) {
    let out = escapeHtml(text);
    const sorted = [...annotations].sort((a, b) => b.quote.length - a.quote.length);
    sorted.forEach((annotation, index) => {
      const escapedQuote = escapeHtml(annotation.quote);
      const escapedQuoteRegex = escapedQuote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const expression = new RegExp(escapedQuoteRegex, 'i');
      out = out.replace(expression, match => `<mark class="annotated-word" data-annotation="${index}" title="${escapeHtml(annotation.title)}">${match}<sup>${index + 1}</sup></mark>`);
    });
    return out;
  }

  function renderAnnotations(annotations) {
    return annotations.map((item, index) => `<article class="annotation-item" id="annotation-${index}">
      <div class="annotation-number ${escapeHtml(item.kind)}">${index + 1}</div>
      <div class="annotation-body"><div class="annotation-heading"><span class="annotation-tag ${escapeHtml(item.kind)}">${escapeHtml(({grammar:'NGỮ PHÁP',style:'DIỄN ĐẠT',task:'BÁM SÁT ĐỀ',evidence:'LẬP LUẬN',development:'PHÁT TRIỂN Ý',vocabulary:'TỪ VỰNG',collocation:'KẾT HỢP TỪ'})[item.kind] || 'GỢI Ý')}</span><b>${escapeHtml(item.title)}</b></div><p>${escapeHtml(item.body)}</p><div class="suggestion"><span>GỢI Ý SỬA</span><code>${escapeHtml(item.fix)}</code></div></div>
    </article>`).join('');
  }

  function openReview(id) {
    const review = reviews.find(item => item.id === id) || reviews[0];
    if (!review) return;
    previousFocus = document.activeElement;
    const rubric = review.scores.map(item => `<div class="rubric-item"><span class="rubric-badge ${escapeHtml(item.color)}">${escapeHtml(item.short)}</span><div class="rubric-copy"><div><b>${escapeHtml(item.name)}</b><strong>${band(item.score)}</strong></div><p>${escapeHtml(item.note)}</p></div></div>`).join('');
    const paragraphs = review.paragraphs.map((paragraph, index) => `<section class="paragraph-review" id="paragraph-${index}">
      <div class="paragraph-header"><span class="paragraph-index">0${index + 1}</span><div><div class="paragraph-label">${escapeHtml(paragraph.label)}</div><h3>${escapeHtml(paragraph.summary)}</h3></div></div>
      <div class="original-block"><div class="block-label"><span class="block-dot coral"></span>BÀI GỐC <span class="hint">Nhấn vào phần được đánh dấu để đến nhận xét</span></div><p>${highlightOriginal(paragraph.original, paragraph.annotations)}</p></div>
      <div class="annotation-list">${renderAnnotations(paragraph.annotations)}</div>
      <div class="rewrite-block"><div class="block-label"><span class="block-dot green"></span>GỢI Ý VIẾT LẠI</div><p>${escapeHtml(paragraph.rewrite)}</p></div>
    </section>`).join('');
    const modelParagraphs = review.modelEssay.map((paragraph, index) => `<p><span class="model-paragraph-number">0${index + 1}</span>${escapeHtml(paragraph)}</p>`).join('');
    const takeaways = review.takeaways.map(item => `<li>${escapeHtml(item)}</li>`).join('');

    detail.innerHTML = `
      <div class="detail-hero"><div class="detail-eyebrow"><span>${escapeHtml(review.typeLabel)}</span><span>•</span><span>${escapeHtml(review.topic)}</span></div><h1 id="detail-title">${escapeHtml(review.title)}</h1><p class="detail-prompt">${escapeHtml(review.prompt)}</p><div class="detail-meta"><span>◷ ${escapeHtml(review.duration)}</span><span>▤ ${escapeHtml(String(review.wordCount))} từ</span><span>▧ ${escapeHtml(review.date)}</span></div></div>
      <div class="detail-layout"><div class="detail-main">
        <section class="verdict-card"><div class="verdict-icon">✦</div><div><div class="panel-eyebrow">NHẬN XÉT TỔNG QUAN</div><p>${escapeHtml(review.verdict)}</p></div><div class="overall-score"><strong>${band(review.band)}</strong><span>Band ước lượng</span></div></section>
        <section class="detail-section score-section"><div class="detail-section-heading"><div><div class="panel-eyebrow">ĐÁNH GIÁ THEO TIÊU CHÍ</div><h2>Điểm mạnh & điểm cần cải thiện</h2></div><span class="estimate-note">Điểm tham khảo</span></div><div class="rubric-grid">${rubric}</div></section>
        <section class="detail-section"><div class="detail-section-heading"><div><div class="panel-eyebrow">NHẬN XÉT CHI TIẾT</div><h2>Đi qua từng đoạn viết</h2></div><span class="detail-count">${review.paragraphs.length} ĐOẠN</span></div>${paragraphs}</section>
        <section class="model-card"><div class="model-heading"><div><div class="panel-eyebrow">BÀI MẪU THAM KHẢO</div><h2>Sample answer · Band 8.0</h2></div><span class="model-star">✳</span></div><div class="model-essay">${modelParagraphs}</div><div class="takeaway-box"><b>Điều nên học từ bài mẫu</b><ul>${takeaways}</ul></div></section>
      </div><aside class="detail-aside"><div class="sticky-card"><div class="panel-eyebrow">THÔNG TIN BÀI VIẾT</div><div class="aside-score"><strong>${band(review.band)}</strong><span>Band tổng ước lượng</span></div><div class="aside-divider"></div><div class="aside-stat"><span>Loại bài</span><b>${escapeHtml(review.typeLabel)}</b></div><div class="aside-stat"><span>Số từ</span><b>${escapeHtml(String(review.wordCount))}</b></div><div class="aside-stat"><span>Số đoạn nhận xét</span><b>${escapeHtml(String(review.paragraphs.length))}</b></div><div class="aside-divider"></div><p class="aside-note">Điểm số và nhận xét là tài liệu tham khảo học tập, không phải kết quả chính thức của IELTS.</p><button class="back-to-library" id="aside-back">← Quay lại thư viện</button></div></aside></div>`;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    overlay.scrollTop = 0;
    document.querySelector('#close-detail').focus();
    history.replaceState(null, '', `#review-detail/${encodeURIComponent(id)}`);
  }

  function closeReview() {
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
    history.replaceState(null, '', location.pathname + location.search + '#reviews');
    if (previousFocus?.focus) previousFocus.focus();
  }

  document.addEventListener('click', event => {
    const openButton = event.target.closest('[data-open]');
    if (openButton) return openReview(openButton.dataset.open);
    if (event.target.closest('#sample-link')) { event.preventDefault(); openReview(reviews[0]?.id); }
    if (event.target.closest('#close-detail') || event.target.closest('#back-button') || event.target.closest('#aside-back')) closeReview();
    const marker = event.target.closest('.annotated-word');
    if (marker) document.querySelector(`#annotation-${marker.dataset.annotation}`)?.scrollIntoView({behavior:'smooth', block:'center'});
  });

  document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
    document.querySelector('.filter-chip.selected')?.classList.remove('selected');
    button.classList.add('selected');
    activeFilter = button.dataset.filter;
    renderCards();
  }));
  search.addEventListener('input', renderCards);
  document.querySelector('#view-all').addEventListener('click', event => { event.preventDefault(); activeFilter = 'all'; search.value = ''; document.querySelector('.filter-chip.selected')?.classList.remove('selected'); document.querySelector('[data-filter="all"]').classList.add('selected'); renderCards(); search.focus(); });
  document.querySelector('#mobile-menu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('sidebar-open'));
  overlay.addEventListener('click', event => { if (event.target === overlay) closeReview(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) closeReview(); });
  renderCards();

  const route = location.hash.match(/^#review-detail\/([^/]+)/);
  if (route) openReview(decodeURIComponent(route[1]));
})();
