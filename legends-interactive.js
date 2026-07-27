(() => {
  'use strict';

  const VERSION = 1;
  const STORAGE_KEY = 'legendy.cards.state.v1';
  const BATTLE_RE = /(?:за|в)\s*бой/i;
  const DAY_RE = /(?:за|в)\s*день/i;

  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const slugify = value => clean(value).toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/g, '-').replace(/^-|-$/g, '');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const parseSigned = text => {
    const normalized = clean(text).replace(/−|&minus;/g, '-').replace(/\+/g, '');
    const value = Number.parseInt(normalized, 10);
    return Number.isFinite(value) ? value : 0;
  };
  const formatSigned = value => value >= 0 ? `+${value}` : `−${Math.abs(value)}`;

  function defaultState() {
    return {
      version: VERSION,
      selectedCard: null,
      team: { corruption: 0, coins: 0 },
      cards: {},
      log: []
    };
  }

  function mergeState(raw) {
    const base = defaultState();
    if (!raw || typeof raw !== 'object') return base;
    return {
      ...base,
      ...raw,
      team: {...base.team, ...(raw.team || {})},
      cards: raw.cards || {},
      log: Array.isArray(raw.log) ? raw.log.slice(-30) : []
    };
  }

  function createLocalStateAdapter() {
    let state;
    try { state = mergeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
    catch { state = defaultState(); }
    const listeners = new Set();
    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      listeners.forEach(listener => listener(state));
    };
    return {
      getSnapshot: () => structuredClone(state),
      update(mutator) {
        const draft = structuredClone(state);
        mutator(draft);
        state = mergeState(draft);
        save();
      },
      replace(next) { state = mergeState(next); save(); },
      subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
    };
  }

  // Для второго этапа достаточно определить window.LegendsStateAdapter до загрузки этого файла.
  const adapter = window.LegendsStateAdapter || createLocalStateAdapter();
  let state = adapter.getSnapshot();
  adapter.subscribe(next => { state = next; render(); });

  const style = document.createElement('style');
  style.id = 'legends-interactive-styles';
  style.textContent = `
    :root{--li-safe-bottom:env(safe-area-inset-bottom,0px)}
    body.legends-interactive{padding:70px 0 calc(104px + var(--li-safe-bottom));background:#2a2823}
    body.legends-interactive .howto{display:none}
    body.legends-interactive .card{display:none;margin:12px auto;min-height:auto}
    body.legends-interactive .card.li-active-card{display:flex}
    .li-ui{font-family:var(--util,"Arial Narrow",Arial,sans-serif)}
    .li-topbar{position:fixed;z-index:10000;left:0;right:0;top:0;height:58px;display:flex;align-items:center;gap:8px;padding:8px 10px;background:#0d2b30;color:#efe9dd;border-bottom:1px solid #b08a3e;box-shadow:0 3px 16px rgba(0,0,0,.35)}
    .li-topbar-title{min-width:0;flex:1}.li-topbar-title b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}.li-topbar-title small{color:#cbbd9f;text-transform:uppercase;letter-spacing:.08em}
    .li-icon-btn,.li-action,.li-counter button,.li-modal button,.li-character-option{appearance:none;border:1px solid #b08a3e;background:#17454a;color:#fff;border-radius:0;min-height:40px;font:700 14px var(--util,"Arial Narrow",Arial,sans-serif);cursor:pointer}
    .li-icon-btn{width:42px;padding:0;font-size:20px}.li-icon-btn:active,.li-action:active,.li-counter button:active,.li-modal button:active{transform:translateY(1px)}
    .li-bottombar{position:fixed;z-index:10000;left:0;right:0;bottom:0;padding:6px 8px calc(6px + var(--li-safe-bottom));display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:6px;background:#17181a;border-top:1px solid #b08a3e;box-shadow:0 -4px 18px rgba(0,0,0,.4)}
    .li-counter{display:grid;grid-template-columns:34px 1fr 34px;align-items:stretch;background:#0d2b30;border:1px solid rgba(176,138,62,.55);min-height:64px}
    .li-counter button{border:0;background:transparent;min-height:100%;font-size:23px;color:#b08a3e;padding:0}.li-counter button:disabled{opacity:.25}
    .li-counter-main{display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:0;cursor:pointer}.li-counter-main small{text-transform:uppercase;letter-spacing:.08em;color:#cbbd9f;font-size:10px}.li-counter-main strong{font-family:var(--display,"Arial Narrow",Arial,sans-serif);font-size:23px;line-height:1.05;white-space:nowrap}.li-counter-main em{font-style:normal;font-size:10px;color:#e7d7b4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .hpbox{cursor:pointer;user-select:none}.hpbox.li-half{background:#6d531e}.hpbox.li-zero{background:#681c16;animation:li-pulse 1.4s infinite}.hpbox .num{white-space:nowrap;font-size:25pt!important}.hpbox .li-hp-state{display:block;font:700 7.5pt var(--util,"Arial Narrow",Arial,sans-serif);text-transform:uppercase;letter-spacing:.08em;color:#ffd8d2;margin-top:1mm}
    @keyframes li-pulse{50%{filter:brightness(1.25)}}
    .uses i{cursor:pointer;position:relative;transition:.15s;touch-action:manipulation}.uses i.li-spent{background:#17454a}.uses i.li-spent::after{content:"×";position:absolute;inset:-4px 0 0;text-align:center;color:#efe9dd;font:700 15px Arial}
    .abil.li-clickable{cursor:pointer;padding:2mm;border:1px solid transparent;transition:.15s}.abil.li-clickable:hover{border-color:rgba(23,69,74,.35);background:rgba(23,69,74,.04)}.abil.li-exhausted{opacity:.48;filter:grayscale(.25)}
    .ult{cursor:pointer;transition:.15s}.ult:hover{filter:brightness(1.08)}.ult.li-disabled{cursor:not-allowed;opacity:.48;filter:grayscale(.8)}.ult.li-used{outline:3px solid #b08a3e;outline-offset:-4px}
    .pick.li-selectable{cursor:pointer;position:relative;transition:.15s}.pick.li-selectable::after{content:"Выбрать";position:absolute;right:8px;top:8px;font:700 8px var(--util,"Arial Narrow",Arial,sans-serif);text-transform:uppercase;letter-spacing:.08em;color:#8a6a26}.pick.li-selected{box-shadow:inset 0 0 0 2px #b08a3e;background:rgba(176,138,62,.2)}.pick.li-selected::after{content:"Выбрано"}
    .pick.li-locked{opacity:.34;filter:grayscale(1);pointer-events:none;position:relative}.pick.li-locked::before{content:"Недоступно при текущей порче";position:absolute;inset:0;display:grid;place-items:center;padding:12px;text-align:center;background:rgba(23,24,26,.78);color:#fff;font:700 12px var(--util,"Arial Narrow",Arial,sans-serif);text-transform:uppercase;letter-spacing:.06em;z-index:2}
    .nums .val.li-changed{color:#8a6a26!important;text-shadow:0 0 12px rgba(176,138,62,.25)}
    .li-special{margin:3mm 0;padding:3mm;border:1px solid #7d1f16;background:rgba(125,31,22,.08);font-family:var(--util,"Arial Narrow",Arial,sans-serif)}.li-special b{display:block;text-transform:uppercase;margin-bottom:2mm}.li-special button{width:100%;background:#7d1f16;color:#fff;border:0;padding:10px;font-weight:700;text-transform:uppercase}
    .li-modal-backdrop{position:fixed;z-index:20000;inset:0;background:rgba(0,0,0,.72);display:grid;place-items:end center;padding:18px 12px calc(18px + var(--li-safe-bottom))}.li-modal{width:min(560px,100%);max-height:88vh;overflow:auto;background:#efe9dd;color:#17181a;border:2px solid #b08a3e;padding:18px;box-shadow:0 14px 60px rgba(0,0,0,.55)}.li-modal h2{font-family:var(--display,"Arial Narrow",Arial,sans-serif);text-transform:uppercase;color:#17454a;margin:0 0 12px}.li-modal p{line-height:1.4}.li-modal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.li-modal .li-danger{background:#7d1f16}.li-modal .li-brass{background:#b08a3e;color:#241c10}.li-modal .li-muted{background:#5c5a54}.li-modal input{width:100%;font-size:22px;padding:10px;margin:10px 0;border:1px solid #17454a;background:#fff}.li-modal-actions{display:flex;gap:8px;margin-top:14px}.li-modal-actions>*{flex:1}
    .li-character-list{display:grid;gap:8px}.li-character-option{text-align:left;padding:10px 12px;background:#17454a}.li-character-option small{display:block;color:#d8d2c4;font-weight:400;margin-top:3px}.li-character-option.li-current{background:#b08a3e;color:#241c10}.li-character-option.li-current small{color:#493918}
    .li-toast{position:fixed;z-index:30000;left:50%;bottom:calc(112px + var(--li-safe-bottom));transform:translateX(-50%);max-width:min(92vw,520px);background:#17181a;color:#fff;border-left:4px solid #b08a3e;padding:11px 14px;box-shadow:0 6px 24px rgba(0,0,0,.45);font:700 13px var(--util,"Arial Narrow",Arial,sans-serif);animation:li-toast 2.8s forwards}.li-toast.li-error{border-color:#7d1f16}.li-toast.li-good{border-color:#4d7b58}@keyframes li-toast{0%{opacity:0;transform:translate(-50%,12px)}10%,82%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-7px)}}
    @media(max-width:820px){body.legends-interactive .card{width:100%;padding:16px 14px 24px}.head{flex-direction:row!important;align-items:flex-start}.head .titles{min-width:0}.head h1{font-size:25pt}.hpbox{align-self:flex-start!important;min-width:92px}.body2{gap:5mm}.li-topbar{height:58px}.li-bottombar{grid-template-columns:1.2fr 1fr 1fr}.li-counter{grid-template-columns:30px 1fr 30px}.li-counter-main strong{font-size:20px}}
    @media(max-width:420px){.li-counter{grid-template-columns:28px 1fr 28px}.li-counter-main strong{font-size:18px}.li-counter-main small{font-size:8px}.head h1{font-size:22pt}.hpbox{min-width:84px}.hpbox .num{font-size:21pt!important}}
    @media print{body.legends-interactive{padding:0;background:#fff}.li-ui,.li-hp-state,.li-special{display:none!important}body.legends-interactive .card{display:flex!important;margin:0!important;min-height:297mm!important}.uses i.li-spent{background:transparent!important}.uses i.li-spent::after{display:none!important}.pick.li-selected{box-shadow:none!important;background:rgba(176,138,62,.10)!important}.pick.li-locked{opacity:1!important;filter:none!important;pointer-events:auto!important}.pick.li-locked::before,.pick.li-selectable::after{display:none!important}.abil.li-exhausted,.ult.li-disabled{opacity:1!important;filter:none!important}.ult.li-used{outline:0!important}.nums .val.li-changed{color:inherit!important;text-shadow:none!important}}
  `;
  document.head.appendChild(style);
  document.body.classList.add('legends-interactive');

  const cards = [];
  const cardById = new Map();
  const cardElements = [...document.querySelectorAll('section.card')];

  cardElements.forEach((el, index) => {
    const eyebrow = clean(el.querySelector('.eyebrow')?.textContent) || `Карточка ${index + 1}`;
    const title = clean(el.querySelector('h1')?.textContent) || eyebrow;
    const id = slugify(eyebrow) || `card-${index + 1}`;
    const hpNode = el.querySelector('.hpbox .num');
    const maxHp = Number.parseInt(clean(hpNode?.textContent), 10) || 1;
    const statNodes = [...el.querySelectorAll('.nums .val')];
    const baseStats = statNodes.map(node => parseSigned(node.textContent));
    const card = {id, index, eyebrow, title, el, hpNode, maxHp, statNodes, baseStats};
    el.dataset.cardId = id;
    cards.push(card);
    cardById.set(id, card);

    if (!state.cards[id]) {
      adapter.update(draft => {
        draft.cards[id] = {hp:maxHp, charges:{}, selections:{}, sisterDamage:0, sisterFallenRewarded:false, ults:0};
      });
      state = adapter.getSnapshot();
    } else if (!Number.isFinite(state.cards[id].hp)) {
      adapter.update(draft => { draft.cards[id].hp = maxHp; });
      state = adapter.getSnapshot();
    }
  });

  if (!cards.length) return;
  if (!state.selectedCard || !cardById.has(state.selectedCard)) {
    adapter.update(draft => { draft.selectedCard = null; });
    state = adapter.getSnapshot();
  }

  function cardState(id) {
    return state.cards[id] || {hp:cardById.get(id)?.maxHp || 1, charges:{}, selections:{}};
  }

  function log(message) {
    adapter.update(draft => {
      draft.log = [...(draft.log || []), {time:Date.now(), message}].slice(-30);
    });
  }

  function toast(message, kind='') {
    document.querySelectorAll('.li-toast').forEach(node => node.remove());
    const node = document.createElement('div');
    node.className = `li-ui li-toast ${kind ? `li-${kind}` : ''}`;
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2900);
  }

  function modal(contentBuilder) {
    const backdrop = document.createElement('div');
    backdrop.className = 'li-ui li-modal-backdrop';
    const box = document.createElement('div');
    box.className = 'li-modal';
    backdrop.appendChild(box);
    const close = () => backdrop.remove();
    backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
    contentBuilder(box, close);
    document.body.appendChild(backdrop);
    return {backdrop, box, close};
  }

  function confirmAction(title, text, onConfirm, confirmLabel='Подтвердить') {
    modal((box, close) => {
      box.innerHTML = `<h2>${title}</h2><p>${text}</p>`;
      const actions = document.createElement('div');
      actions.className = 'li-modal-actions';
      const cancel = document.createElement('button');
      cancel.className = 'li-muted'; cancel.textContent = 'Отмена'; cancel.onclick = close;
      const ok = document.createElement('button');
      ok.className = 'li-danger'; ok.textContent = confirmLabel; ok.onclick = () => { close(); onConfirm(); };
      actions.append(cancel, ok); box.appendChild(actions);
    });
  }

  function updateTeam(field, delta, reason='') {
    adapter.update(draft => {
      draft.team[field] = Math.max(0, (draft.team[field] || 0) + delta);
    });
    if (reason) log(reason);
  }

  function setTeam(field, value, reason='') {
    adapter.update(draft => { draft.team[field] = Math.max(0, Number(value) || 0); });
    if (reason) log(reason);
  }

  function spendCoins(amount, reason, options={}) {
    if ((state.team.coins || 0) < amount) {
      toast(`Не хватает монет: нужно ${amount}, есть ${state.team.coins || 0}.`, 'error');
      return false;
    }
    adapter.update(draft => { draft.team.coins -= amount; });
    if (!options.warpPayment) triggerPriestCoinHealHint();
    log(`${reason}: −${amount} мон.`);
    toast(`${reason}: потрачено ${amount} мон.`, 'good');
    return true;
  }

  function triggerPriestCoinHealHint() {
    if ((state.team.corruption || 0) < 3) toast('Покаяние активно: жрец может исцелить видимого союзника на 1 здоровье.');
  }

  function getSelectedCard() { return cardById.get(state.selectedCard) || cards[0]; }

  function applyDamage(card, rawAmount) {
    let amount = Math.max(0, Number(rawAmount) || 0);
    if (!amount) return;
    const cs = cardState(card.id);
    const oldHp = cs.hp;

    const isNeophyte = /неофит/i.test(card.eyebrow);
    const selected = clean(cs.selections?.primary || '').toLowerCase();
    if (isNeophyte && selected.includes('проклят') && (state.team.corruption || 0) > 0) {
      const reduced = Math.floor(amount / 2);
      toast(`Проклятое основание: урон ${amount} → ${reduced}.`);
      amount = reduced;
    }

    adapter.update(draft => {
      const target = draft.cards[card.id];
      target.hp = clamp((target.hp ?? card.maxHp) - amount, 0, card.maxHp);
      if (/сестра/i.test(card.eyebrow)) {
        target.sisterDamage = (target.sisterDamage || 0) + amount;
        const earned = Math.floor(target.sisterDamage / 5);
        if (earned > 0) {
          target.sisterDamage %= 5;
          draft.team.coins = (draft.team.coins || 0) + earned;
        }
        if (oldHp > 0 && target.hp === 0 && !target.sisterFallenRewarded) {
          target.sisterFallenRewarded = true;
          draft.team.coins = (draft.team.coins || 0) + 5;
        }
      }
    });

    const next = cardState(card.id);
    if (/сестра/i.test(card.eyebrow)) {
      const earnedByDamage = Math.floor(((cs.sisterDamage || 0) + amount) / 5);
      if (earnedByDamage > 0) toast(`Мученица Императора: команда получает ${earnedByDamage} мон.`, 'good');
      if (oldHp > 0 && next.hp === 0 && !cs.sisterFallenRewarded) toast('Сестра пала: команда получает ещё 5 монет.', 'good');
    }
    if (next.hp === 0 && oldHp > 0) toast(`${card.title}: выведен из строя.`, 'error');
    log(`${card.title}: урон ${amount}, здоровье ${next.hp}/${card.maxHp}.`);
  }

  function heal(card, amount) {
    amount = Math.max(0, Number(amount) || 0);
    if (!amount) return;
    adapter.update(draft => {
      const target = draft.cards[card.id];
      target.hp = clamp((target.hp ?? card.maxHp) + amount, 0, card.maxHp);
    });
    const next = cardState(card.id);
    log(`${card.title}: лечение ${amount}, здоровье ${next.hp}/${card.maxHp}.`);
  }

  function openHpModal(card) {
    modal((box, close) => {
      const cs = cardState(card.id);
      box.innerHTML = `<h2>${card.title}</h2><p>Здоровье: <b>${cs.hp} / ${card.maxHp}</b></p>`;
      const custom = document.createElement('input');
      custom.type = 'number'; custom.min = '0'; custom.inputMode = 'numeric'; custom.placeholder = 'Другое значение';
      box.appendChild(custom);

      const damageTitle = document.createElement('p'); damageTitle.innerHTML = '<b>Нанести урон</b>'; box.appendChild(damageTitle);
      const damageGrid = document.createElement('div'); damageGrid.className = 'li-modal-grid';
      [1,5,10].forEach(value => { const b=document.createElement('button'); b.className='li-danger'; b.textContent=`−${value}`; b.onclick=()=>{applyDamage(card,value);close();}; damageGrid.appendChild(b); });
      box.appendChild(damageGrid);

      const healTitle = document.createElement('p'); healTitle.innerHTML = '<b>Лечить</b>'; box.appendChild(healTitle);
      const healGrid = document.createElement('div'); healGrid.className = 'li-modal-grid';
      [1,5,10].forEach(value => { const b=document.createElement('button'); b.className='li-brass'; b.textContent=`+${value}`; b.onclick=()=>{heal(card,value);close();}; healGrid.appendChild(b); });
      box.appendChild(healGrid);

      const actions = document.createElement('div'); actions.className = 'li-modal-actions';
      const damageCustom=document.createElement('button'); damageCustom.className='li-danger'; damageCustom.textContent='Урон: своё'; damageCustom.onclick=()=>{applyDamage(card,custom.value);close();};
      const healCustom=document.createElement('button'); healCustom.className='li-brass'; healCustom.textContent='Лечение: своё'; healCustom.onclick=()=>{heal(card,custom.value);close();};
      const cancel=document.createElement('button'); cancel.className='li-muted'; cancel.textContent='Закрыть'; cancel.onclick=close;
      actions.append(damageCustom,healCustom,cancel); box.appendChild(actions);
    });
  }

  function openTeamValueModal(field, title) {
    modal((box, close) => {
      box.innerHTML = `<h2>${title}</h2><p>Текущее значение: <b>${state.team[field] || 0}</b></p>`;
      const input=document.createElement('input'); input.type='number'; input.min='0'; input.inputMode='numeric'; input.value=state.team[field] || 0; box.appendChild(input);
      const actions=document.createElement('div'); actions.className='li-modal-actions';
      const save=document.createElement('button'); save.className='li-brass'; save.textContent='Установить'; save.onclick=()=>{setTeam(field,input.value,`${title}: ${input.value}`);close();};
      const cancel=document.createElement('button'); cancel.className='li-muted'; cancel.textContent='Закрыть'; cancel.onclick=close;
      actions.append(save,cancel); box.appendChild(actions);
    });
  }

  function newBattle() {
    confirmAction('Новый бой', 'Восстановить все заряды «за бой» и снять боевые отметки? Здоровье, порча и монеты сохранятся.', () => {
      adapter.update(draft => {
        cards.forEach(card => {
          const target = draft.cards[card.id];
          Object.keys(target.charges || {}).forEach(key => { if (key.startsWith('battle:')) delete target.charges[key]; });
          target.ults = 0;
          if (/гвардеец/i.test(card.eyebrow)) target.selections.primary = null;
        });
      });
      log('Начат новый бой.'); toast('Боевые заряды восстановлены.', 'good');
    }, 'Начать бой');
  }

  function newDay() {
    confirmAction('Новый день', 'Восстановить все дневные и боевые заряды, а здоровье вернуть к максимуму? Порча и монеты сохранятся.', () => {
      adapter.update(draft => {
        cards.forEach(card => {
          const target = draft.cards[card.id];
          target.hp = card.maxHp;
          target.charges = {};
          target.ults = 0;
          target.sisterDamage = 0;
        });
      });
      log('Начат новый день.'); toast('Здоровье и заряды восстановлены.', 'good');
    }, 'Начать день');
  }

  function resetAll() {
    confirmAction('Сбросить всё', 'Удалить здоровье, заряды, выборы, порчу, монеты и награду сестры за падение? Это начало совершенно новой игры.', () => {
      const fresh = defaultState();
      cards.forEach(card => { fresh.cards[card.id] = {hp:card.maxHp,charges:{},selections:{},sisterDamage:0,sisterFallenRewarded:false,ults:0}; });
      fresh.selectedCard = state.selectedCard;
      adapter.replace(fresh);
      toast('Всё состояние сброшено.', 'good');
    }, 'Сбросить');
  }

  function openCharacterPicker(firstRun=false) {
    modal((box, close) => {
      box.innerHTML = `<h2>${firstRun ? 'Выберите персонажа' : 'Сменить персонажа'}</h2><p>${firstRun ? 'Выбор сохранится на этом телефоне.' : 'Состояние остальных карточек не потеряется.'}</p>`;
      const list=document.createElement('div'); list.className='li-character-list';
      cards.forEach(card => {
        const button=document.createElement('button'); button.className=`li-character-option ${state.selectedCard===card.id?'li-current':''}`;
        button.innerHTML=`${card.title}<small>${card.eyebrow} · здоровье ${card.maxHp}</small>`;
        button.onclick=()=>{adapter.update(draft=>{draft.selectedCard=card.id;});close();window.scrollTo({top:0,behavior:'instant'});};
        list.appendChild(button);
      });
      box.appendChild(list);
      if (!firstRun) {
        const actions=document.createElement('div'); actions.className='li-modal-actions';
        const reset=document.createElement('button'); reset.className='li-danger'; reset.textContent='Сбросить всё'; reset.onclick=()=>{close();resetAll();};
        const cancel=document.createElement('button'); cancel.className='li-muted'; cancel.textContent='Закрыть'; cancel.onclick=close;
        actions.append(reset,cancel); box.appendChild(actions);
      }
    });
  }

  function setupUi() {
    const top=document.createElement('header'); top.className='li-ui li-topbar';
    top.innerHTML=`<button class="li-icon-btn" data-action="character" aria-label="Сменить персонажа">☰</button><div class="li-topbar-title"><small>Легенды подземелий</small><b data-role="character-title"></b></div><button class="li-icon-btn" data-action="battle" aria-label="Новый бой">⚔</button><button class="li-icon-btn" data-action="day" aria-label="Новый день">☀</button>`;
    document.body.prepend(top);
    top.querySelector('[data-action="character"]').onclick=()=>openCharacterPicker(false);
    top.querySelector('[data-action="battle"]').onclick=newBattle;
    top.querySelector('[data-action="day"]').onclick=newDay;

    const bottom=document.createElement('footer'); bottom.className='li-ui li-bottombar';
    bottom.innerHTML=`
      <div class="li-counter" data-counter="hp"><button data-delta="-1" aria-label="Нанести 1 урон">−</button><div class="li-counter-main"><small>Здоровье</small><strong></strong><em></em></div><button data-delta="1" aria-label="Вылечить 1">+</button></div>
      <div class="li-counter" data-counter="corruption"><button data-delta="-1" aria-label="Уменьшить порчу">−</button><div class="li-counter-main"><small>Порча</small><strong></strong><em>вручную</em></div><button data-delta="1" aria-label="Увеличить порчу">+</button></div>
      <div class="li-counter" data-counter="coins"><button data-delta="-1" aria-label="Уменьшить монеты">−</button><div class="li-counter-main"><small>Монеты</small><strong></strong><em>кошелёк</em></div><button data-delta="1" aria-label="Увеличить монеты">+</button></div>`;
    document.body.appendChild(bottom);

    const hp=bottom.querySelector('[data-counter="hp"]');
    hp.querySelector('[data-delta="-1"]').onclick=()=>applyDamage(getSelectedCard(),1);
    hp.querySelector('[data-delta="1"]').onclick=()=>heal(getSelectedCard(),1);
    hp.querySelector('.li-counter-main').onclick=()=>openHpModal(getSelectedCard());

    ['corruption','coins'].forEach(field=>{
      const node=bottom.querySelector(`[data-counter="${field}"]`);
      node.querySelector('[data-delta="-1"]').onclick=()=>updateTeam(field,-1,`${field==='corruption'?'Порча':'Монеты'}: −1`);
      node.querySelector('[data-delta="1"]').onclick=()=>updateTeam(field,1,`${field==='corruption'?'Порча':'Монеты'}: +1`);
      node.querySelector('.li-counter-main').onclick=()=>openTeamValueModal(field,field==='corruption'?'Порча команды':'Монеты команды');
    });
  }

  function abilityKey(card, ability, index) {
    const title=clean(ability.querySelector('h3')?.textContent) || `Способность ${index+1}`;
    const uses=clean(ability.querySelector('.uses')?.textContent);
    const scope=DAY_RE.test(uses)?'day':BATTLE_RE.test(uses)?'battle':'other';
    return `${scope}:${slugify(title)}:${index}`;
  }

  function setupCards() {
    cards.forEach(card => {
      card.el.querySelector('.hpbox')?.addEventListener('click',()=>openHpModal(card));

      [...card.el.querySelectorAll('.abil')].forEach((ability,index)=>{
        const uses=ability.querySelector('.uses');
        const boxes=[...(uses?.querySelectorAll('i') || [])];
        if (!boxes.length) return;
        const key=abilityKey(card,ability,index);
        ability.dataset.chargeKey=key;
        ability.classList.add('li-clickable');
        boxes.forEach((box,boxIndex)=>{
          box.dataset.chargeIndex=boxIndex;
          box.addEventListener('click',event=>{
            event.stopPropagation();
            adapter.update(draft=>{
              const spent=new Set(draft.cards[card.id].charges[key] || []);
              spent.has(boxIndex)?spent.delete(boxIndex):spent.add(boxIndex);
              draft.cards[card.id].charges[key]=[...spent].sort((a,b)=>a-b);
            });
          });
        });
        ability.addEventListener('click',event=>{
          if (event.target.closest('i')) return;
          const spent=new Set(cardState(card.id).charges[key] || []);
          const next=boxes.findIndex((_,i)=>!spent.has(i));
          if (next<0){toast('Заряды закончились. Нажмите на зачёркнутый квадрат, чтобы отменить ошибку.','error');return;}
          adapter.update(draft=>{
            const set=new Set(draft.cards[card.id].charges[key] || []); set.add(next); draft.cards[card.id].charges[key]=[...set].sort((a,b)=>a-b);
          });
          toast(`${clean(ability.querySelector('h3')?.textContent)}: заряд потрачен.`);
        });
      });

      const firstHeading=clean(card.el.querySelector('.body2 > div:first-child .snum h2')?.textContent).toLowerCase();
      if (/тактика боя|пакты|наследие его/.test(firstHeading)) {
        const picks=[...card.el.querySelectorAll('.body2 > div:first-child .pick')];
        picks.forEach(pick=>{
          pick.classList.add('li-selectable');
          pick.addEventListener('click',()=>{
            const choice=clean(pick.querySelector('h3')?.textContent);
            adapter.update(draft=>{draft.cards[card.id].selections.primary=choice;});
            toast(`${choice}: выбрано.`,'good');
          });
        });
      }

      const ult=card.el.querySelector('.ult');
      if (ult) {
        const cost=Number.parseInt(clean(ult.querySelector('.price')?.textContent),10)||0;
        const name=clean(ult.querySelector('h3')?.textContent)||'Ультимейт';
        ult.dataset.cost=cost;
        ult.addEventListener('click',()=>{
          if ((state.team.coins||0)<cost){toast(`Для «${name}» нужно ${cost} монет.`,'error');return;}
          confirmAction(name,`Потратить ${cost} монет и активировать ультимейт?`,()=>{
            if (!spendCoins(cost,name)) return;
            adapter.update(draft=>{
              draft.cards[card.id].ults=(draft.cards[card.id].ults||0)+1;
              if (/апофеоз/i.test(name)) draft.team.corruption=0;
            });
            if (/апофеоз/i.test(name)) toast('Апофеоз завершает действие со сбросом всей порчи.','good');
          },'Активировать');
        });
      }
    });

    const psyker=cards.find(card=>/псайкер/i.test(card.eyebrow));
    if (psyker) {
      const target=psyker.el.querySelector('.body2 > div:first-child');
      if (target) {
        const block=document.createElement('div'); block.className='li-ui li-special';
        block.innerHTML='<b>Опасность варпа</b><button type="button">Крит-провал: заплатить 3 монеты</button>';
        block.querySelector('button').onclick=()=>{
          if (!spendCoins(3,'Крит-провал псайкера',{warpPayment:true})) {
            toast('Платить нечем. Примените урон или иное последствие из правила карточки.','error');
          }
        };
        target.appendChild(block);
      }
    }
  }

  function render() {
    const selected=getSelectedCard();
    cards.forEach(card=>card.el.classList.toggle('li-active-card',card.id===selected.id));
    document.querySelector('[data-role="character-title"]')?.replaceChildren(document.createTextNode(selected.title));

    const selectedState=cardState(selected.id);
    const hpCounter=document.querySelector('[data-counter="hp"]');
    if (hpCounter) {
      hpCounter.querySelector('strong').textContent=`${selectedState.hp} / ${selected.maxHp}`;
      hpCounter.querySelector('em').textContent=selectedState.hp===0?'выведен из строя':selectedState.hp<=selected.maxHp/2?'меньше половины':'в строю';
      hpCounter.querySelector('[data-delta="-1"]').disabled=selectedState.hp<=0;
      hpCounter.querySelector('[data-delta="1"]').disabled=selectedState.hp>=selected.maxHp;
    }
    ['corruption','coins'].forEach(field=>{
      const node=document.querySelector(`[data-counter="${field}"]`); if(!node)return;
      node.querySelector('strong').textContent=state.team[field]||0;
      node.querySelector('[data-delta="-1"]').disabled=(state.team[field]||0)<=0;
    });

    cards.forEach(card=>{
      const cs=cardState(card.id);
      const hp=clamp(cs.hp??card.maxHp,0,card.maxHp);
      if (card.hpNode) card.hpNode.textContent=`${hp} / ${card.maxHp}`;
      const hpbox=card.el.querySelector('.hpbox');
      hpbox?.classList.toggle('li-half',hp>0&&hp<=card.maxHp/2);
      hpbox?.classList.toggle('li-zero',hp===0);
      let stateNode=hpbox?.querySelector('.li-hp-state');
      if (!stateNode&&hpbox){stateNode=document.createElement('span');stateNode.className='li-ui li-hp-state';hpbox.appendChild(stateNode);}
      if(stateNode)stateNode.textContent=hp===0?'Выведен из строя':hp<=card.maxHp/2?'Ранен':'В строю';

      [...card.el.querySelectorAll('.abil[data-charge-key]')].forEach(ability=>{
        const key=ability.dataset.chargeKey; const spent=new Set(cs.charges?.[key]||[]); const boxes=[...ability.querySelectorAll('.uses i')];
        boxes.forEach((box,index)=>box.classList.toggle('li-spent',spent.has(index)));
        ability.classList.toggle('li-exhausted',boxes.length>0&&spent.size>=boxes.length);
      });

      [...card.el.querySelectorAll('.pick.li-selectable')].forEach(pick=>{
        const choice=clean(pick.querySelector('h3')?.textContent);
        pick.classList.toggle('li-selected',choice===cs.selections?.primary);
      });

      const ult=card.el.querySelector('.ult');
      if (ult) {
        const cost=Number(ult.dataset.cost||0);
        ult.classList.toggle('li-disabled',(state.team.coins||0)<cost);
        ult.classList.toggle('li-used',(cs.ults||0)>0);
      }

      if (/еретик/i.test(card.eyebrow)) {
        const corruption=state.team.corruption||0;
        card.statNodes.forEach((node,index)=>{
          const value=(card.baseStats[index]||0)+corruption;
          node.textContent=formatSigned(value);
          node.classList.toggle('neg',value<0);
          node.classList.toggle('li-changed',corruption>0);
        });
      }

      if (/жрец/i.test(card.eyebrow)&&!/техно/i.test(card.eyebrow)) {
        const thresholds={'святой лик':1,'чистая вера':2,'покаяние':3};
        [...card.el.querySelectorAll('.pick')].forEach(pick=>{
          const name=clean(pick.querySelector('h3')?.textContent).toLowerCase();
          if (thresholds[name]) pick.classList.toggle('li-locked',(state.team.corruption||0)>=thresholds[name]);
        });
      }
    });
  }

  window.addEventListener('beforeprint',()=>{
    cards.forEach(card=>{
      if(card.hpNode)card.hpNode.textContent=String(card.maxHp);
      card.statNodes.forEach((node,index)=>{node.textContent=formatSigned(card.baseStats[index]||0);node.classList.toggle('neg',(card.baseStats[index]||0)<0);});
    });
  });
  window.addEventListener('afterprint',render);

  setupUi();
  setupCards();
  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Service worker:',error));
  }

  if (!state.selectedCard) setTimeout(()=>openCharacterPicker(true),80);
})();
