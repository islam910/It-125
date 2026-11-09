if ($('admin-list')) {
  let data = { categories: {}, tools: [] };
  let editingId = null; 
 
  const status = $('admin-status');
  const say = (msg, ok = true) => { status.textContent = msg; status.style.color = ok ? 'var(--green)' : '#b64242'; };
  const persist = () => safeSet(STORE_KEY, data);
 
  const TR = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  const slug = (text) => text.toLowerCase().split('').map(ch => TR[ch] ?? ch).join('')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const lines = (text) => text.split('\n').map(s => s.trim()).filter(Boolean);
 
  const renderList = () => {
    const box = $('admin-list'); box.innerHTML = '';
    $('admin-count').textContent = 'Инструментов: ' + data.tools.length;
    if (!data.tools.length) box.append(el('p', 'hint', 'Каталог пуст. Нажмите «Добавить», чтобы создать первый инструмент.'));
    data.tools.forEach(tool => {
      const row = el('div', 'admin-row');
      const info = el('div', 'admin-info');
      info.append(el('strong', '', tool.title), el('small', '', (data.categories[tool.category] || tool.category) + ' · ' + tool.summary));
      const actions = el('div', 'admin-actions');
      const view = Object.assign(el('a', 'button-link light', 'Просмотр'), { href: 'detail.html?id=' + encodeURIComponent(tool.id) });
      const edit = el('button', 'button-light', 'Изменить'); edit.type = 'button';
      edit.addEventListener('click', () => openForm(tool));
      const del = el('button', 'danger', 'Удалить'); del.type = 'button';
      del.addEventListener('click', () => removeTool(tool));
      actions.append(view, edit, del);
      row.append(el('span', 'tool-icon', tool.icon || '★'), info, actions);
      box.append(row);
    });
  };
 
  const F = (name) => $('f-' + name);
  const fillCategories = (selected) => {
    const sel = F('category'); sel.innerHTML = '';
    Object.entries(data.categories).forEach(([key, label]) => {
      const o = el('option', '', label); o.value = key; sel.append(o);
    });
    const n = el('option', '', '＋ Новая категория…'); n.value = '__new'; sel.append(n);
    sel.value = selected && data.categories[selected] ? selected : (Object.keys(data.categories)[0] || '__new');
    F('newcat').hidden = sel.value !== '__new';
  };
 
  const openForm = (tool) => {
    editingId = tool ? tool.id : null;
    $('admin-form-title').textContent = tool ? 'Изменение: ' + tool.title : 'Новый инструмент';
    F('title').value = tool?.title || '';
    F('id').value = tool?.id || '';
    F('id').readOnly = !!tool;          
    F('icon').value = tool?.icon || '';
    F('summary').value = tool?.summary || '';
    F('description').value = tool?.description || '';
    F('features').value = (tool?.features || []).join('\n');
    F('howto').value = (tool?.howto || []).join('\n');
    F('storage').value = tool?.storage || '';
    F('url').value = tool?.url || '';
    F('newcat').value = '';
    fillCategories(tool?.category);
    $('admin-form-error').textContent = '';
    $('admin-form-panel').hidden = false;
    $('admin-form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    F('title').focus();
  };
  const closeForm = () => { $('admin-form-panel').hidden = true; editingId = null; };
 
  F('category').addEventListener('change', () => { F('newcat').hidden = F('category').value !== '__new'; });
  F('title').addEventListener('input', () => { if (editingId === null && !F('id').dataset.touched) F('id').value = slug(F('title').value); });
  F('id').addEventListener('input', () => { F('id').dataset.touched = '1'; });
 
  $('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = (m) => { $('admin-form-error').textContent = m; };
    const title = F('title').value.trim(), id = F('id').value.trim();
    const summary = F('summary').value.trim(), description = F('description').value.trim();
 
    if (!title) return err('Введите название.');
    if (!/^[a-z0-9-]+$/.test(id)) return err('Идентификатор: только латинские буквы, цифры и дефис.');
    if (editingId === null && data.tools.some(t => t.id === id)) return err('Инструмент с таким идентификатором уже есть.');
    if (!summary) return err('Введите краткое описание.');
    if (!description) return err('Введите подробное описание.');
 
    let category = F('category').value;
    if (category === '__new') {
      const name = F('newcat').value.trim();
      if (!name) return err('Введите название новой категории.');
      const existing = Object.entries(data.categories).find(([, v]) => v.toLowerCase() === name.toLowerCase());
      if (existing) category = existing[0];
      else {
        let key = slug(name) || 'cat', n = 2;
        while (data.categories[key]) key = slug(name) + '-' + n++;
        data.categories[key] = name; category = key;
      }
    }
 
    const tool = {
      id, title, icon: F('icon').value.trim() || '★',
      url: F('url').value.trim() || 'detail.html?id=' + encodeURIComponent(id),
      category, summary, description,
      features: lines(F('features').value),
      howto: lines(F('howto').value),
      storage: F('storage').value.trim()
    };
 
    if (editingId === null) { data.tools.push(tool); say('Инструмент «' + title + '» добавлен.'); }
    else {
      data.tools[data.tools.findIndex(t => t.id === editingId)] = tool;
      say('Изменения в «' + title + '» сохранены.');
    }
    persist(); renderList(); closeForm();
  });
 
  const removeTool = (tool) => {
    if (!confirm('Удалить инструмент «' + tool.title + '»?')) return;
    data.tools = data.tools.filter(t => t.id !== tool.id);
    if (editingId === tool.id) closeForm();
    persist(); renderList(); say('Инструмент «' + tool.title + '» удалён.');
  };
 
  $('admin-add').addEventListener('click', () => { delete F('id').dataset.touched; openForm(null); });
  $('admin-cancel').addEventListener('click', closeForm);
 
  $('admin-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'tools.json' });
    document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(a.href);
    say('Файл tools.json скачан.');
  });
 
  $('admin-reset').addEventListener('click', () => {
    if (!confirm('Вернуть каталог к исходному tools.json? Все ваши изменения будут потеряны.')) return;
    try { localStorage.removeItem(STORE_KEY); } catch {}
    init().then(() => say('Каталог сброшен к исходному tools.json.'));
  });
 
  const init = () => loadTools().then(d => { data = d; closeForm(); renderList(); })
    .catch(() => say(LOAD_ERROR, false));
  init();
}
 