(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const key = 'essay-room-vocabulary-v1';
  let entries = [], editing = null;
  const status = message => { $('vocab-status').textContent = message; };
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) entries = saved.filter(x => x && typeof x.id === 'string' && typeof x.word === 'string' && typeof x.meaning === 'string');
  } catch { status('Không thể đọc sổ tay đã lưu. Bạn vẫn có thể ghi chú và tải bản sao.'); }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(entries)); status('Đã lưu trên trình duyệt này.'); }
    catch { status('Trình duyệt không cho phép lưu. Hãy tải sổ tay để giữ ghi chú.'); }
    render();
  }
  function reset() { editing = null; $('vocab-form').reset(); $('vocab-submit').textContent = '＋ Lưu từ'; $('vocab-cancel').hidden = true; }
  function render() {
    $('vocab-count').textContent = entries.length;
    const query = $('vocab-search').value.trim().toLocaleLowerCase('vi');
    const list = $('vocab-list'); list.replaceChildren();
    const filtered = entries.filter(x => (x.word + ' ' + x.meaning).toLocaleLowerCase('vi').includes(query));
    if (!filtered.length) { const p = document.createElement('p'); p.className = 'study-muted'; p.textContent = entries.length ? 'Không tìm thấy từ phù hợp.' : 'Sổ tay đang trống. Thêm từ đầu tiên ở trên hoặc lưu từ trong góc đọc.'; list.append(p); }
    filtered.forEach(entry => {
      const article = document.createElement('article'); article.className = 'vocab-entry';
      const title = document.createElement('b'); title.textContent = entry.word;
      const note = document.createElement('p'); note.textContent = entry.meaning;
      const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Sửa'; edit.setAttribute('aria-label', 'Sửa ' + entry.word);
      edit.onclick = () => { editing = entry.id; $('vocab-word').value = entry.word; $('vocab-meaning').value = entry.meaning; $('vocab-submit').textContent = 'Lưu thay đổi'; $('vocab-cancel').hidden = false; $('vocab-word').focus(); };
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Xóa'; remove.setAttribute('aria-label', 'Xóa ' + entry.word);
      remove.onclick = () => { entries = entries.filter(x => x.id !== entry.id); if (editing === entry.id) reset(); persist(); };
      article.append(title,note,edit,remove); list.append(article);
    });
  }
  $('vocab-form').addEventListener('submit', event => {
    event.preventDefault();
    const word = $('vocab-word').value.trim(), meaning = $('vocab-meaning').value.trim();
    if (!word || !meaning) { status('Hãy nhập từ và nghĩa trước khi lưu.'); return; }
    if (editing) entries = entries.map(x => x.id === editing ? {...x,word,meaning} : x);
    else entries.unshift({id:crypto.randomUUID(),word,meaning});
    reset(); persist();
  });
  $('vocab-cancel').onclick = reset;
  $('vocab-search').addEventListener('input',render);
  document.querySelectorAll('[data-save-word]').forEach(button => button.addEventListener('click', () => {
    if (entries.some(x => x.word.toLowerCase() === button.dataset.saveWord.toLowerCase())) { status('Từ này đã có trong sổ tay.'); }
    else { entries.unshift({id:crypto.randomUUID(),word:button.dataset.saveWord,meaning:button.dataset.meaning}); persist(); }
    $('vocabulary').scrollIntoView({behavior:'smooth',block:'start'});
  }));
  $('vocab-export').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(entries,null,2)], {type:'application/json'}));
    const a = document.createElement('a'); a.href = url; a.download = 'essay-room-tu-vung.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
  };
  render();
})();
