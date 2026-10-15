const $ = (id) => document.getElementById(id);
const safeGet = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const safeSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

if ($('calc-display')) {
  const display = $('calc-display');
  let expression = '';
  document.querySelectorAll('.calc-key').forEach(btn => btn.addEventListener('click', () => {
    const action = btn.dataset.action, value = btn.dataset.value;
    if (action === 'clear') expression = '';
    else if (action === 'back') expression = expression.slice(0, -1);
    else if (action === 'equals') {
      try {
        if (!expression || !/^[0-9+*/%.() -]+$/.test(expression)) throw new Error();
        const result = Function('"use strict"; return (' + expression + ')')();
        if (!Number.isFinite(result)) throw new Error();
        expression = String(Math.round((result + Number.EPSILON) * 1e10) / 1e10);
      } catch { expression = ''; display.value = 'Ошибка'; return; }
    } else if (value) expression += value;
    display.value = expression || '0';
  }));
}

if ($('task-form')) {
  let tasks = safeGet('miniToolsTasks', []);
  const render = () => {
    $('task-list').innerHTML = '';
    tasks.forEach((task, i) => {
      const li = document.createElement('li'); if (task.done) li.classList.add('done');
      const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done; check.setAttribute('aria-label', 'Выполнено');
      check.addEventListener('change', () => { tasks[i].done = check.checked; save(); render(); });
      const span = document.createElement('span'); span.textContent = task.text;
      const del = document.createElement('button'); del.className = 'delete-task'; del.textContent = 'Удалить'; del.addEventListener('click', () => { tasks.splice(i, 1); save(); render(); });
      li.append(check, span, del); $('task-list').append(li);
    });
    $('task-count').textContent = `${tasks.length} задач · выполнено ${tasks.filter(t => t.done).length}`;
  };
  const save = () => safeSet('miniToolsTasks', tasks);
  $('task-form').addEventListener('submit', e => { e.preventDefault(); const text = $('task-input').value.trim(); if (text) { tasks.push({text, done:false}); save(); render(); $('task-input').value=''; } });
  $('clear-done').addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); render(); });
  render();
}

if ($('save-note')) {
  let notes = safeGet('miniToolsNotes', []);
  const render = () => {
    const box = $('notes-list'); box.innerHTML = '';
    notes.forEach((note, i) => {
      const card = document.createElement('article'); card.className = 'note-card';
      const h = document.createElement('h3'); h.textContent = note.title || 'Без заголовка';
      const p = document.createElement('p'); p.textContent = note.body;
      const del = document.createElement('button'); del.textContent = 'Удалить'; del.addEventListener('click', () => { notes.splice(i,1); save(); render(); });
      card.append(h,p,del); box.append(card);
    });
  };
  const save = () => safeSet('miniToolsNotes', notes);
  $('save-note').addEventListener('click', () => {
    const body = $('note-body').value.trim(), title = $('note-title').value.trim();
    if (!body && !title) { alert('Введите заголовок или текст заметки.'); return; }
    notes.unshift({title, body}); save(); render(); $('note-title').value=''; $('note-body').value='';
  });
  render();
}

if ($('timer-display')) {
  let remaining = 300, interval = null;
  const show = () => { $('timer-display').textContent = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`; };
  const read = () => Math.max(0, Math.min(10800, Number($('timer-minutes').value||0)*60 + Number($('timer-seconds').value||0)));
  $('timer-start').addEventListener('click', () => {
    if (interval) return;
    if (remaining <= 0) remaining = read();
    if (remaining <= 0) { $('timer-message').textContent = 'Укажите время больше нуля.'; return; }
    $('timer-message').textContent = 'Таймер запущен.';
    interval = setInterval(() => { remaining--; show(); if (remaining <= 0) { clearInterval(interval); interval = null; $('timer-message').textContent = 'Время вышло!'; } }, 1000);
  });
  $('timer-pause').addEventListener('click', () => { clearInterval(interval); interval = null; $('timer-message').textContent = 'Таймер на паузе.'; });
  $('timer-reset').addEventListener('click', () => { clearInterval(interval); interval = null; remaining = read(); show(); $('timer-message').textContent = 'Таймер сброшен.'; });
  $('timer-minutes').addEventListener('change', () => { if (!interval) { remaining=read(); show(); } });
  $('timer-seconds').addEventListener('change', () => { if (!interval) { remaining=read(); show(); } });
  show();
}

if ($('convert-type')) {
  const units = {
    length: {m: ['метры',1], km:['километры',1000], cm:['сантиметры',.01], mm:['миллиметры',.001], mi:['мили',1609.344], ft:['футы',.3048]},
    weight: {kg:['килограммы',1], g:['граммы',.001], mg:['миллиграммы',.000001], lb:['фунты',.45359237], t:['тонны',1000]},
    temperature: {C:['°C'], F:['°F'], K:['K']}
  };
  const fill = () => {
    const type=$('convert-type').value, entries=Object.entries(units[type]);
    ['convert-from','convert-to'].forEach(id => { const el=$(id); el.innerHTML=''; entries.forEach(([key,info]) => { const op=document.createElement('option'); op.value=key; op.textContent=info[0]; el.append(op); }); });
    if(type==='length') $('convert-to').value='km'; if(type==='weight') $('convert-to').value='g'; if(type==='temperature') $('convert-to').value='F';
  };
  const convert = () => {
    const type=$('convert-type').value, value=Number($('convert-value').value), from=$('convert-from').value, to=$('convert-to').value;
    if (!Number.isFinite(value)) { $('convert-result').textContent='Введите число.'; return; }
    let result;
    if(type==='temperature') {
      const c = from==='C'?value:from==='F'?(value-32)*5/9:value-273.15;
      result = to==='C'?c:to==='F'?c*9/5+32:c+273.15;
    } else result = value*units[type][from][1]/units[type][to][1];
    $('convert-result').textContent = `${value} ${units[type][from][0]} = ${Number(result.toFixed(6))} ${units[type][to][0]}`;
  };
  $('convert-type').addEventListener('change', () => {fill();convert();});
  $('convert-button').addEventListener('click', convert);
  $('convert-value').addEventListener('input', convert);
  $('convert-from').addEventListener('change', convert); $('convert-to').addEventListener('change', convert);
  fill(); convert();
}

if ($('new-quote')) {
  const quotes = [
    ['Большие дела начинаются с маленьких шагов.','Народная мудрость'],
    ['Учиться никогда не поздно.','Народная мудрость'],
    ['Порядок экономит время.','Пословица'],
    ['Лучший способ начать — перестать говорить и начать делать.','Уолт Дисней'],
    ['Успех — это сумма небольших усилий, повторяемых каждый день.','Роберт Кольер'],
    ['Не ошибается тот, кто ничего не делает.','Народная мудрость']
  ];
  $('new-quote').addEventListener('click', () => {
    let item = quotes[Math.floor(Math.random()*quotes.length)];
    $('quote-text').textContent = item[0]; $('quote-author').textContent = '— ' + item[1];
  });
}

if ($('new-color')) {
  const make = () => {
    const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0').toUpperCase();
    $('color-preview').style.backgroundColor=hex; $('color-code').textContent=hex; $('color-message').textContent='';
  };
  $('new-color').addEventListener('click', make);
  $('copy-color').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('color-code').textContent); $('color-message').textContent='Код скопирован.'; }
    catch { $('color-message').textContent='Выделите код и скопируйте его вручную.'; }
  });
  make();
}

if ($('generate-password')) {
  const chars = {lower:'abcdefghijklmnopqrstuvwxyz', upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numbers:'0123456789', symbols:'!@#$%^&*()-_=+?'};
  $('password-length').addEventListener('input', () => $('length-label').textContent=$('password-length').value);
  $('generate-password').addEventListener('click', () => {
    let pool=chars.lower;
    if($('include-upper').checked) pool+=chars.upper;
    if($('include-numbers').checked) pool+=chars.numbers;
    if($('include-symbols').checked) pool+=chars.symbols;
    let result=''; const length=Number($('password-length').value);
    for(let i=0;i<length;i++) result+=pool[Math.floor(Math.random()*pool.length)];
    $('password-result').value=result; $('password-message').textContent='Пароль создан. Для важных аккаунтов используйте менеджер паролей.';
  });
  $('copy-password').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('password-result').value); $('password-message').textContent='Пароль скопирован.'; }
    catch { $('password-message').textContent='Выделите пароль и скопируйте его вручную.'; }
  });
}

if ($('contact-form')) $('contact-form').addEventListener('submit', e => {
  e.preventDefault(); $('contact-status').textContent='Форма проверена. Для реальной отправки нужен сервер или сервис форм.';
  e.target.reset();
});
