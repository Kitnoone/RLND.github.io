(() => {
  'use strict';

  const STORAGE_KEY = 'sapphire-race-engine-v4';
  const VIEW_KEY = 'sapphire-race-view';

  const RACERS = {
    player: { name: 'Кара', short: 'К', color: '#f2ca72' },
    aegon: { name: 'Аэгон', short: 'А', color: '#d56b7f' },
    saira: { name: 'Сайра', short: 'С', color: '#ff9f62' },
    pello: { name: 'Пелло', short: 'П', color: '#66d6ce' },
    mael: { name: 'Маэль', short: 'М', color: '#9c91ec' },
    ordis: { name: 'Ордис', short: 'О', color: '#69b9ff' }
  };

  const TRACK = { positionsPerArc: 10, arcsPerLap: 9, positionsPerLap: 90 };

  const RIVAL_PROFILES = {
    aegon: {
      name: 'Аэгон Адаран', title: 'Чёрный гонщик', archetype: 'дроу, воин 8 уровня', proficiency: 3,
      abilities: { str: 14, dex: 18, con: 16, int: 13, wis: 15, cha: 12 },
      racer: { ac: 17, hp: 68 },
      chariot: { name: '«Нагльфар»', mount: 'Тирайя, двуглавая гидра', ac: 17, integrity: 36 },
      control: 7, attack: 7, saveDc: 15,
      saves: 'Ловкость +7, Телосложение +6, Мудрость +5',
      skills: 'Управление +7, Внимательность +5, Атлетика +5, Запугивание +4',
      skillBonuses: { control: 7, perception: 5, athletics: 5, intimidation: 4 },
      resource: 'Реакция «Срезать путь», 1 раз на этап; заряды арок',
      features: [
        ['Изломанный поворот', 'Не получает помеху из-за крутых поворотов и тесных проходов.'],
        ['Заточенная кромка', 'После Арки Меча: состязание Управления с ближайшей колесницей впереди; 2к8 + 4 урона и обгон.'],
        ['Срезать путь', 'После Арки Щита: реакцией сравнивает Управление с результатом обгоняющего; ничья остаётся за Аэгоном.']
      ]
    },
    saira: {
      name: 'Сайра Эстеваль', title: 'Хозяйка Белого Солнца', archetype: 'человек, следопыт 7 уровня', proficiency: 3,
      abilities: { str: 13, dex: 17, con: 16, int: 14, wis: 16, cha: 14 },
      racer: { ac: 16, hp: 59 },
      chariot: { name: '«Белое Солнце»', mount: 'Рассвет и Полдень, огненные пегасы', ac: 16, integrity: 32 },
      control: 6, attack: 6, saveDc: 15,
      saves: 'Ловкость +6, Мудрость +6',
      skills: 'Управление +6, Акробатика +6, Внимательность +6, Уход за животными +6',
      skillBonuses: { control: 6, acrobatics: 6, perception: 6, animalHandling: 6 },
      resource: 'Жар 0–5; обычный ход даёт 1к3 Жара',
      features: [
        ['Медные каналы', 'Обычный ход или таран даёт 1к3 Жара. При 3/4/5 Жарах проверка перегрева проходит против Сл 14/16/18.'],
        ['Солнечный рывок', 'После Платиновой звезды расходует 2 Жара: Управление против Сл этапа +5; успех даёт четыре позиции.'],
        ['Тепловая завеса', 'После Арки Меча расходует 1 Жар; экипажи позади проходят Мудрость Сл 15. Провал: помеха, Жар и 2к10 огненного урона пилоту.']
      ]
    },
    pello: {
      name: 'Пелло Никс', title: 'Чертёжник коротких дорог', archetype: 'гном, изобретатель 7 уровня', proficiency: 3,
      abilities: { str: 8, dex: 16, con: 14, int: 18, wis: 15, cha: 12 },
      racer: { ac: 15, hp: 45 },
      chariot: { name: '«Короткий путь»', mount: 'Тут и Там, телепортирующиеся ящеры', ac: 15, integrity: 24 },
      control: 7, attack: 5, saveDc: 15,
      saves: 'Телосложение +5, Интеллект +7',
      skills: 'Управление +7, Магия +7, Расследование +7, Инструменты +7',
      skillBonuses: { control: 7, arcana: 7, investigation: 7, tools: 7 },
      resource: 'Короткий путь 1 раз за круг; аварийный скачок — перезарядка 3 этапа',
      features: [
        ['Координатный обмен', 'После Арки Меча выбирает любую цель впереди: Магия против Сл 14 + расстояние в позициях.'],
        ['Короткий путь', 'После Платиновой звезды: Магия Сл 16, одна попытка на круг; +2 позиции. Подготовка даёт +2 к броску.'],
        ['Аварийный скачок', 'После Арки Щита открывается до конца гонки. Реакция отменяет урон атаки и перезаряжается 3 этапа.'],
        ['Злобный смех', 'Возница цели на том же этапе: Мудрость Сл 15; при провале пропуск хода и 3к6 психического урона экипажу.']
      ]
    },
    mael: {
      name: 'Маэль Тарвен', title: 'Настройщик Стеклянного хора', archetype: 'эльф, бард 7 уровня', proficiency: 3,
      abilities: { str: 10, dex: 16, con: 14, int: 16, wis: 18, cha: 16 },
      racer: { ac: 15, hp: 52 },
      chariot: { name: '«Стеклянный хор»', mount: 'Грань и Эхо, склокуны', ac: 15, integrity: 28 },
      control: 7, attack: 6, saveDc: 15,
      saves: 'Ловкость +6, Харизма +6',
      skills: 'Управление +7, Внимательность +7, Выступление +6',
      skillBonuses: { control: 7, perception: 7, performance: 6 },
      resource: 'Резонанс 0–3',
      features: [
        ['Считать ритм', 'Следуя за лидером, копит Резонанс. На трёх зарядах совершает идеальный обгон.'],
        ['Направленная волна', 'После Арки Меча расходует 1 Резонанс: цель впереди проходит спасбросок Мудрости Сл 15.'],
        ['Противофаза', 'После Арки Щита отражает направленное действие: Выступление Маэля против результата атаки.']
      ]
    },
    ordis: {
      name: 'Ордис Крааг', title: 'Механик Девятого грома', archetype: 'дворф, изобретатель 8 уровня', proficiency: 3,
      abilities: { str: 16, dex: 12, con: 18, int: 16, wis: 14, cha: 10 },
      racer: { ac: 18, hp: 76 },
      chariot: { name: '«Девятый гром»', mount: 'Керн и Варра, молниеходы', ac: 18, integrity: 42 },
      control: 5, attack: 6, saveDc: 15,
      saves: 'Телосложение +7, Интеллект +6',
      skills: 'Управление +5, Атлетика +6, Магия +6, Инструменты +6',
      skillBonuses: { control: 5, athletics: 6, arcana: 6, tools: 6 },
      resource: 'Заряд 0–4; на 4 разряд обязателен',
      features: [
        ['Грозовой накопитель', 'Инструменты Сл 22; к броску добавляется каждая потерянная единица Целостности. Молния даёт ещё Заряд.'],
        ['Девятый гром', 'После Платиновой звезды при 3–4 Зарядах таранит экипажи впереди один за другим.'],
        ['Заземление', 'После Арки Щита при попадании расходует Заряд: следующий успешный таран наносит ещё 1к8 + 3.']
      ]
    }
  };

  const RIVAL_BASE_INTEGRITY = Object.fromEntries(Object.entries(RIVAL_PROFILES).map(([id, profile]) => [id, profile.chariot.integrity]));

  const LAPS = [
    { name: 'Наземный заезд', tone: 'earth', controlDc: 14 },
    { name: 'Морской заезд', tone: 'water', controlDc: 15 },
    { name: 'Воздушный заезд', tone: 'air', controlDc: 16 }
  ];

  const STAGES = [
    {
      lap: 0, trial: 'Живой лабиринт', name: 'Пробуждение стен', dc: 13, type: 'РАЗГОН И ДВИЖУЩИЙСЯ КАМЕНЬ', damage: [1, 6],
      text: "Стартовая дорожка поднимается каменными рёбрами. Между экипажами вырастают стены, разделяющие их на узкие коридоры.",
      failure: "колесница врезается в поднимающуюся плиту и теряет темп. -1",
      sabotage: "стена выходит раньше сигнала; предусмотрена помеха на Управление.",
      rivals: ['pello', 'aegon'], arcs: ['shield', 'star']
    },
    {
      lap: 0, trial: 'Живой лабиринт', name: 'Каменные зубы', dc: 14, type: 'ТЕСНЫЙ ПРОХОД И БОКОВЫЕ УДАРЫ', damage: [1, 6, 2],
      text: "Коридор сужается. Из стен попеременно выдвигаются каменные блоки, вынуждая менять линию движения и сталкивая соседние колесницы.",
      failure: "блок ударяет в ступицу и бросает колесницу к соседнему экипажу. Колесницы провалившие обязаны пройти тест тарана друг против друга.",
      sabotage: "левый ряд блоков работает без пауз; предусмотрено повышение Сл на 2.",
      rivals: ['aegon', 'ordis'], arcs: ['shield', 'sword']
    },
    {
      lap: 0, trial: 'Живой лабиринт', name: 'Сердце лабиринта', dc: 15, type: 'ЛОЖНЫЕ ВЫХОДЫ И СМЫКАЮЩИЕСЯ СТЕНЫ', damage: [2, 6],
      text: "Открываются пять похожих выходов. Четыре ведут в закрывающиеся тупики; настоящий проход можно определить по движению сапфировой пыли.",
      failure: "выбранный проход закрывается, колесница пробивает сужающийся просвет.",
      sabotage: "сапфировая пыль указывает на ложный выход; предусмотрено −2 к Управлению.",
      rivals: ['pello', 'mael'], arcs: ['star', 'wing']
    },
    {
      lap: 0, trial: 'Мёртвая петля', name: 'Вертикальный разгон', dc: 14, type: 'ПОДЪЁМ И ПЕРЕГРУЗКА', damage: [1, 6, 3],
      text: "Дорожка становится почти вертикальной. Тяжёлые колесницы начинают сползать вниз, угрожая экипажам позади.",
      failure: "скорости недостаточно, колесницу тянет вниз по стене петли. -2 позиции",
      sabotage: "руна тяги колесницы гаснет на половине подъёма. Спасбросок ловкости – 10 или выпал из колесницы.",
      rivals: ['ordis', 'saira'], arcs: ['star', 'shield']
    },
    {
      lap: 0, trial: 'Мёртвая петля', name: 'Потолок под колёсами', dc: 15, type: 'ПЕРЕВОРОТ И УДЕРЖАНИЕ УПРЯЖИ', damage: [2, 6],
      text: "Экипажи проходят верхнюю часть петли вверх колёсами. Пассажиров удерживают ремни, незакреплённые предметы выпадают.",
      failure: "колесница отрывается от дорожки и падает на внешний ограничитель. Проверка починки инструменты кузнеца 15 или пропуск хода",
      sabotage: "прижимная пластина раскрывается поздно; предусмотрено ещё 1к6 урона при провале.",
      rivals: ['aegon', 'mael'], arcs: ['wing', 'shield']
    },
    {
      lap: 0, trial: 'Мёртвая петля', name: 'Слепой выход', dc: 16, type: 'ПАДЕНИЕ И РЕЗКИЙ ПОВОРОТ', damage: [2, 6, 2],
      text: "За спуском скрывается резкий поворот. Дорожку закрывает пыль, поднятая предыдущими экипажами.",
      failure: "колесница проскакивает поворот и ударяется о внешний барьер.",
      sabotage: "ось выхода смещена; предусмотрена помеха на Управление.",
      rivals: ['aegon', 'saira'], arcs: ['wing', 'sword']
    },
    {
      lap: 0, trial: 'Закрывающиеся ворота', name: 'Три створки', dc: 14, type: 'ВЫБОР ЛИНИИ И РЫВОК', damage: [1, 6, 2],
      text: "Три огромные створки опускаются с разной скоростью. Боковые проходы безопаснее, центральный путь короче.",
      failure: "выбранная створка опускается перед упряжью. -5 к управлению в следующем эпизоде",
      sabotage: "центральная створка падает без предупредительного сигнала. Кара в панике и единственное доступное действие – успокить кару",
      rivals: ['pello', 'ordis'], arcs: ['star', 'shield']
    },
    {
      lap: 0, trial: 'Закрывающиеся ворота', name: 'Коридор гильотин', dc: 16, type: 'РИТМ И ПОСЛЕДОВАТЕЛЬНЫЕ ЗАТВОРЫ', damage: [2, 6],
      text: "Последовательность затворов перекрывает дорожку. Нужно поймать ритм их движения; «Стеклянный хор» может менять этот ритм.",
      failure: "затвор срезает обшивку и разворачивает колесницу боком. -2 позиции",
      sabotage: "один затвор движется вне общего ритма; предусмотрено повышение Сл на 2.",
      rivals: ['mael', 'aegon'], arcs: ['sword', 'wing']
    },
    {
      lap: 0, trial: 'Закрывающиеся ворота', name: 'Каменный финиш', dc: 16, type: 'ОБРУШЕНИЕ И ФИНИШНЫЙ СПРИНТ', damage: [2, 10, 3],
      text: "Позади экипажей рушится наземный механизм. Волна камня и обломков преследует гонщиков до финиша первого заезда.",
      failure: "обломки накрывают заднюю площадку и выбивают колесницу из потока. -3 позиции",
      sabotage: "финишная арка подаёт ложный сигнал ускорения; предусмотрено ещё -3 к управлению",
      rivals: ['aegon', 'ordis'], arcs: ['shield', 'star']
    },
    {
      lap: 1, trial: 'Встречное цунами', name: 'Затопление чаши', dc: 14, type: 'ПЕРЕХОД В ВОДУ И ПОТЕРЯ СЦЕПЛЕНИЯ', damage: [1, 6, 2],
      text: 'Каменная чаша арены раскалывается, и через решётки в неё врывается море. Колёса ещё цепляются за дно, но вода уже поднимает лёгкие экипажи.',
      failure: 'Поток разворачивает колесницу поперёк заполняющегося канала.',
      sabotage: 'Золотая колесница входит в воду с незакрытым нижним клапаном.',
      rivals: ['pello', 'ordis'], arcs: ['shield', 'wing']
    },
    {
      lap: 1, trial: 'Встречное цунами', name: 'Лобовая волна', dc: 15, type: 'УДАРНАЯ ВОЛНА И УДЕРЖАНИЕ ЭКИПАЖА', damage: [2, 6, 3],
      text: 'В дальнем конце арены поднимается сплошная стена воды. На одно мгновение в ней видны тени морских существ, затем волна обрушивается на гонщиков.',
      failure: 'Вода ударяет в корпус и пытается сорвать пассажиров с площадки.',
      sabotage: 'За первой волной без паузы приходит вторая: ещё 1к6 урона.',
      rivals: ['saira', 'aegon'], arcs: ['shield', 'wing']
    },
    {
      lap: 1, trial: 'Встречное цунами', name: 'Пенный тоннель', dc: 15, type: 'НУЛЕВАЯ ВИДИМОСТЬ И ПЛАВАЮЩИЕ ОБЛОМКИ', damage: [2, 6],
      text: 'После удара экипажи оказываются внутри белого пенного тоннеля. Видимость исчезает, а в воде вращаются сорванные ограждения и части чужих колёс.',
      failure: 'Скрытый обломок входит под днище и подбрасывает колесницу.',
      sabotage: 'Сигнальные огни под водой показывают ложную безопасную линию.',
      rivals: ['pello', 'mael'], arcs: ['star', 'shield']
    },
    {
      lap: 1, trial: 'Водоворот и спрут', name: 'Край воронки', dc: 15, type: 'БОКОВОЕ ТЕЧЕНИЕ И СРЫВ ТРАЕКТОРИИ', damage: [1, 6, 3],
      text: 'Вода начинает вращаться вокруг тёмного центра. Чем ближе колесница к внутренней линии, тем короче путь и тем сильнее течение тянет её вниз.',
      failure: 'Колесница соскальзывает на внутренний виток водоворота.',
      sabotage: 'Подводные руны усиливают течение возле Кары.',
      rivals: ['ordis', 'saira'], arcs: ['star', 'wing']
    },
    {
      lap: 1, trial: 'Водоворот и спрут', name: 'Лес щупалец', dc: 16, type: 'ЗАХВАТ И РАЗРЫВ УПРЯЖИ', damage: [2, 6],
      text: 'Из воронки поднимаются щупальца. Одни бьют по воде, другие ощупывают днища и хватают оси, а самое крупное уже тянется к упряжи Кары.',
      failure: 'Щупальце обвивается вокруг колеса и рвёт колесницу в сторону центра.',
      sabotage: 'Защитные руны не отгоняют спрута от золотого корпуса.',
      rivals: ['aegon', 'mael'], arcs: ['sword', 'shield']
    },
    {
      lap: 1, trial: 'Водоворот и спрут', name: 'Глаз водоворота', dc: 17, type: 'ПАДЕНИЕ В ВОРОНКУ И ВЫХОД ПРОТИВ ТЕЧЕНИЯ', damage: [2, 6, 3],
      text: 'Трасса ныряет в неподвижный глаз воронки. Внизу царит короткая тишина, затем вода меняет направление и выбрасывает экипажи вверх.',
      failure: 'Колесница входит в восходящий поток боком и принимает удар всей рамой.',
      sabotage: 'Поток меняет направление на мгновение раньше расчёта.',
      rivals: ['pello', 'ordis'], arcs: ['wing', 'star']
    },
    {
      lap: 1, trial: 'Туманный риф', name: 'Голоса в тумане', dc: 15, type: 'ПЕСНЯ СИРЕН И ЛОЖНЫЕ ОГНИ', damage: [1, 6, 2],
      text: 'Над водой ложится серебряный туман. В нём звучат голоса знакомых людей, а огни безопасного фарватера медленно уходят в сторону чёрных скал.',
      failure: 'Упряжь следует за ложным голосом и теряет правильную линию.',
      sabotage: 'Один из служебных маяков повторяет голос Дюрана: помеха на Управление.',
      rivals: ['mael', 'saira'], arcs: ['shield', 'wing']
    },
    {
      lap: 1, trial: 'Туманный риф', name: 'Чёрный риф', dc: 16, type: 'СКРЫТЫЕ СКАЛЫ И УЗКИЙ ФАРВАТЕР', damage: [2, 6, 2],
      text: 'Туман рвётся клочьями, открывая рифы всего на несколько ударов сердца. Между ними остаётся проход шириной с одну колесницу.',
      failure: 'Днище налетает на зубчатый край рифа.',
      sabotage: 'Отмеченный безопасный риф оказывается подвижным: Сл повышается на 2.',
      rivals: ['pello', 'aegon'], arcs: ['sword', 'star']
    },
    {
      lap: 1, trial: 'Туманный риф', name: 'Подъёмный шлюз', dc: 17, type: 'ВЕРТИКАЛЬНЫЙ ПОТОК И ВОДНЫЙ ФИНИШ', damage: [2, 6, 3],
      text: 'Фарватер заканчивается стеной. Затем весь объём воды взлетает вверх, превращаясь в гигантский шлюз, который должен выбросить гонщиков обратно на арену.',
      failure: 'Колесница выпадает из водяного столба и бьётся о край шлюза.',
      sabotage: 'Восходящий поток под Карой слабеет на середине подъёма.',
      rivals: ['ordis', 'mael'], arcs: ['wing', 'shield']
    },
    {
      lap: 2, trial: 'Иглы башен', name: 'Сброс балласта', dc: 15, type: 'ВЗЛЁТ И ПЕРЕСТРОЕНИЕ КОРПУСА', damage: [1, 6, 2],
      text: 'Водяной столб лопается над ареной. Боковые пластины колесниц раскрываются, животные расправляют крылья, и земля проваливается далеко вниз.',
      failure: 'Колесница не успевает облегчить корпус и цепляет край стартовой башни.',
      sabotage: 'Один замок крыла не раскрывается с первого раза.',
      rivals: ['saira', 'ordis'], arcs: ['wing', 'star']
    },
    {
      lap: 2, trial: 'Иглы башен', name: 'Иглы Даркстоуна', dc: 16, type: 'УЗКИЕ ПРОЛЁТЫ И КАМЕННЫЕ ШПИЛИ', damage: [2, 6],
      text: 'Маршрут проходит между верхушками башен. Каменные иглы мелькают по обе стороны, а некоторые пролёты рассчитаны только на сложенные крылья.',
      failure: 'Корпус задевает шпиль и входит в воздушный занос.',
      sabotage: 'Сигнальный флаг указывает на уже закрывающийся пролёт.',
      rivals: ['saira', 'aegon'], arcs: ['wing', 'shield']
    },
    {
      lap: 2, trial: 'Иглы башен', name: 'Огненный след', dc: 16, type: 'РАСКАЛЁННЫЙ ВОЗДУХ И БОРЬБА ЗА ВЫСОТУ', damage: [2, 6],
      text: 'Рассвет и Полдень оставляют в небе дрожащий огненный след. Воздух над ним подбрасывает колесницы, под ним обжигает крылья и ремни.',
      failure: 'Поток переворачивает колесницу и швыряет её к стене башни.',
      sabotage: 'Охлаждающая руна на левом борту не срабатывает.',
      rivals: ['saira', 'mael'], arcs: ['shield', 'sword']
    },
    {
      lap: 2, trial: 'Нырок над Агисом', name: 'Ломаный ветер', dc: 15, type: 'БОКОВЫЕ ПОРЫВЫ И ПОТЕРЯ ВЫСОТЫ', damage: [1, 6, 3],
      text: 'За внешней стеной арены ветер идёт слоями в разные стороны. Верхний поток тормозит, нижний рвёт вперёд, а граница между ними ломает крылья резким ударом.',
      failure: 'Колесницу выбрасывает из выбранного воздушного слоя.',
      sabotage: 'Направление нижнего потока меняется после начала манёвра.',
      rivals: ['mael', 'pello'], arcs: ['wing', 'star']
    },
    {
      lap: 2, trial: 'Нырок над Агисом', name: 'Грозовой разрез', dc: 16, type: 'МОЛНИИ И НАКОПЛЕНИЕ ЗАРЯДА', damage: [2, 6, 2],
      text: 'Трасса входит в узкую грозовую полосу. Молнии перескакивают между колесницами, и «Девятый гром» начинает светиться изнутри.',
      failure: 'Разряд проходит через раму и на мгновение парализует упряжь.',
      sabotage: 'Молниеотвод золотой колесницы перенаправляет заряд внутрь корпуса.',
      rivals: ['ordis', 'aegon'], arcs: ['shield', 'sword']
    },
    {
      lap: 2, trial: 'Нырок над Агисом', name: 'Нырок над Агисом', dc: 17, type: 'ПИКИРОВАНИЕ И ВЫХОД НАД ВОДОЙ', damage: [2, 6, 3],
      text: 'Дорожка света обрывается вниз. Экипажи падают к Агису почти отвесно; низкая линия проходит под мостом и даёт шанс на обгон, но оставляет считаные футы для выхода.',
      failure: 'Колесница выходит из пике слишком поздно и касается воды на полной скорости.',
      sabotage: 'Нижний маяк загорается на несколько мгновений позже.',
      rivals: ['ordis', 'saira'], arcs: ['wing', 'sword']
    },
    {
      lap: 2, trial: 'Сапфировые врата', name: 'Обломки в небе', dc: 16, type: 'ПАДАЮЩИЕ ПЛАТФОРМЫ И СВОБОДНЫЙ МАНЁВР', damage: [2, 6],
      text: 'Над ареной рушатся временные мосты. Каменные плиты и металлические фермы падают между гонщиками, на мгновение образуя проходы, которых секунду назад не существовало.',
      failure: 'Обломок срезает высоту и ударяет в край колесницы.',
      sabotage: 'Одна платформа освобождается раньше команды Друселии.',
      rivals: ['pello', 'mael'], arcs: ['star', 'wing']
    },
    {
      lap: 2, trial: 'Сапфировые врата', name: 'Сходящиеся линии', dc: 17, type: 'ПЕРЕСЕЧЕНИЕ ТРАЕКТОРИЙ И БОРЬБА ЗА КОРИДОР', damage: [2, 6, 2],
      text: 'Четыре световые дорожки сходятся в одну. Экипажи летят навстречу друг другу под разными углами, и уступивший сейчас уже не вернётся в лидирующую группу.',
      failure: 'Колесницу выдавливают наружу, где поток гасит скорость.',
      sabotage: 'Линия Кары сдвигается прямо под траекторию «Нагльфара».',
      rivals: ['aegon', 'saira'], arcs: ['shield', 'sword']
    },
    {
      lap: 2, trial: 'Сапфировые врата', name: 'Сапфировые врата', dc: 18, type: 'ФИНАЛЬНЫЙ ПРОЛЁТ', damage: [3, 6],
      text: 'Все звуки арены сливаются в один гул. Впереди остаётся единственный сияющий проём, створки уже движутся, а «Нагльфар» идёт на последний таран рядом с золотой колесницей.',
      failure: 'Створки ударяют по колеснице на полной скорости и выбрасывают её из финишного коридора.',
      sabotage: 'Правая створка закрывается раньше расчёта: Сл повышается на 2.',
      rivals: ['aegon', 'ordis'], arcs: ['star', 'sword']
    }
  ];

  const TAG_LABELS = {
    tight: 'тесный проход', turn: 'крутой поворот', visibility: 'плохая видимость', moving: 'движущаяся трасса',
    collision: 'столкновение', falseRoute: 'ложный маршрут', climb: 'подъём', straight: 'прямая', inversion: 'переворот',
    fork: 'развилка', rhythm: 'ритм', debris: 'обломки', water: 'вода', impact: 'ударная волна', current: 'течение',
    grapple: 'захват', vertical: 'вертикаль', mental: 'ментальная угроза', air: 'воздух', heat: 'жар',
    turbulence: 'турбулентность', lightning: 'молния', dive: 'пике', closing: 'закрывающиеся врата'
  };

  const STAGE_TAGS = [
    ['tight','moving'], ['tight','collision'], ['falseRoute','tight'], ['climb','straight'], ['inversion','vertical'],
    ['turn','visibility'], ['fork','tight'], ['tight','rhythm'], ['straight','debris'],
    ['water'], ['water','impact'], ['visibility','debris'], ['water','current'], ['grapple','tight'], ['water','vertical'],
    ['visibility','mental'], ['visibility','tight'], ['water','vertical'],
    ['air','climb'], ['turn','tight','air'], ['heat','turbulence','air'], ['air','current'], ['air','lightning'],
    ['dive','tight','air'], ['air','debris','visibility'], ['collision','tight','air'], ['straight','closing','air']
  ];
  STAGES.forEach((stage, index) => { stage.tags = STAGE_TAGS[index]; });

  const ARCS = {
    shield: {
      name: 'Арка Щита', sigil: 'Щ',
      chariot: '10 временной Целостности; первая потеря позиции от столкновения отменяется.',
      kara: 'Заряжает «Свет пегаса».', ability: 'light'
    },
    sword: {
      name: 'Арка Меча', sigil: 'М',
      chariot: 'Следующая атака по колеснице наносит 2к6 + 6 и игнорирует первые 5 защиты.',
      kara: 'Оставляет Боевой знак. После пробуждения трёх аспектов он открывает ультимативную способность.', ability: 'ultimate'
    },
    star: {
      name: 'Платиновая звезда', sigil: 'З',
      chariot: 'Немедленно +1 позиция и +5 к следующему Управлению.',
      kara: 'Заряжает «Быстрее ветра».', ability: 'speed'
    },
    wing: {
      name: 'Серебряное крыло', sigil: 'К',
      chariot: 'Преимущество на следующую проверку и отмена первого осложнения.',
      kara: 'Заряжает «Небесный шаг».', ability: 'flight'
    }
  };

  const RIVAL_ARC_ABILITIES = {
    aegon: {
      shield: ['Срезать путь', 'Реакция мастера против обгоняющего, 1/этап.'], sword: ['Заточенная кромка', 'Таран ближайшей цели впереди.'],
      star: ['Чёрная охота', 'Рискованный рывок на две позиции.'], wing: ['Невозможный угол', 'Манёвр с преимуществом через поворот или теснину.']
    },
    saira: {
      shield: ['Керамический кокон', 'Защита корпуса от следующего перегрева.'], sword: ['Тепловая завеса', 'Спасброски Мудрости экипажей позади: помеха, Жар и урон пилоту.'],
      star: ['Солнечный рывок', 'Четыре позиции ценой 2 Жара; Сл участка +5.'], wing: ['Восходящий поток', 'Преимущество; Жар можно потратить после броска по +2.']
    },
    pello: {
      shield: ['Аварийный скачок', 'Открывает защитную реакцию с перезарядкой 3 этапа.'], sword: ['Координатный обмен', 'Меняется местами с целью впереди.'],
      star: ['Короткий путь', 'Магия Сл 16; +2 позиции, одна попытка на круг.'], wing: ['Чистая точка выхода', 'Автоуспех, +2 позиции, все теги и реакции игнорируются.']
    },
    mael: {
      shield: ['Противофаза', 'Отражает направленную атаку.'], sword: ['Направленная волна', 'Спасбросок Мудрости цели Сл 15.'],
      star: ['Идеальный интервал', 'На 3 Резонансах спорит с лидером за первое место.'], wing: ['Подхват ритма', 'Преимущество на чтении лидера.']
    },
    ordis: {
      shield: ['Заземление', 'Заряд превращается в +1к8 + 3 к следующему тарану.'], sword: ['Громовой таран', 'Следующий таран наносит ещё 1к8 + 3.'],
      star: ['Девятый гром', 'Цепь таранов через строй впереди.'], wing: ['Грозовой воздухозаборник', 'Преимущество на накоплении Заряда.']
    }
  };

  const ABILITIES = {
    speed: {
      name: 'Быстрее ветра', source: 'Платиновая звезда',
      text: '+5 к Управлению. При успехе Кара получает ещё одну позицию, и её нельзя заблокировать.',
      timing: 'До броска Управления'
    },
    flight: {
      name: 'Небесный шаг', source: 'Серебряное крыло',
      text: 'Кара перелетает препятствие. Результат считается обычным успехом; урон и потеря позиции отменяются.',
      timing: 'До броска Управления'
    },
    light: {
      name: 'Свет пегаса', source: 'Арка Щита',
      text: '12 временной Целостности на этот этап. Экипаж нельзя выбросить, паника и испуг снимаются. Свет рассеивает плохую видимость, ложный маршрут и ментальную угрозу; защищает от жара и молнии.',
      timing: 'В начале этапа'
    },
    ultimate: {
      name: 'Последний полёт Дюрана', source: 'Боевой знак и три аспекта',
      text: 'Автоматический критический успех, +2 позиции, полная защита на этап. Соседние соперники получают 2к6 и теряют позицию.',
      timing: 'Один раз за гонку'
    }
  };

  const SUPPORT_ACTIONS = {
    scout: { name: 'Разведать путь', formula: 'Внимательность, Расследование или Выживание', dc: 'stage', text: 'Успех даёт +1к4 к Управлению; успех на 5 и более даёт преимущество.' },
    calm: { name: 'Успокоить Кару', formula: 'Уход за животными', dc: 14, text: 'Успех даёт +2 к Управлению и снимает панику.' },
    brace: { name: 'Удержать корпус', formula: 'Атлетика или Акробатика', dc: 14, text: 'Успех уменьшает следующий урон на 1к6 + 3.' },
    repair: { name: 'Провести ремонт', formula: 'Интеллект или Ловкость с инструментами', dc: 14, text: 'Успех восстанавливает 1к6 + 3 Целостности; результат 20+ восстанавливает 2к6 + 3.' },
    ram: { name: 'Пойти на таран', formula: 'Управление', dc: 0, text: 'Ближайшая колесница впереди; если цели нет — преграда трассы против базовой Сл участка. Управление против Управления; ничья остаётся за защищающимся. Успех наносит 1к6 + 3 и меняет экипажи местами.' },
    guard: { name: 'Защитить экипаж', formula: 'Интеллект (Магия), Сл 14', dc: 14, text: 'До следующего этапа экипаж получает защиту от выброса, а следующий урон уменьшается на 1к6.' }
  };


  const TAG_DESCRIPTIONS = {"tight": "Мало места для манёвра, обгона и движения рядом", "turn": "Резкая смена направления", "visibility": "Гонщик поздно замечает маршрут, препятствия и соперников", "moving": "Стены или поверхность меняют положение во время движения", "collision": "Участок сводит экипажи или бросает их друг на друга", "falseRoute": "Есть обманные выходы, указатели или безопасные линии", "climb": "Нужно набрать высоту или преодолеть крутой склон", "straight": "Участок позволяет разгоняться без резких поворотов", "inversion": "Колесница проходит участок в перевёрнутом положении", "fork": "Несколько разных линий прохождения", "rhythm": "Успех зависит от попадания в последовательность движений", "debris": "На пути находятся или падают части сооружений", "water": "Движение по затопленной трассе", "impact": "Мощный фронт воды ударяет по экипажу", "current": "Поток воды или воздуха смещает траекторию", "grapple": "Препятствие может удержать колесницу или упряжь", "vertical": "Почти отвесное движение вверх или вниз", "mental": "Голоса, иллюзии или другое воздействие на восприятие", "air": "Участок проходит в полёте", "heat": "Горячий воздух или огонь угрожают экипажу", "turbulence": "Нестабильные воздушные потоки", "lightning": "Электрические разряды на трассе", "dive": "Быстрый спуск с необходимостью вовремя выйти из него", "closing": "Проход постепенно или резко перекрывается"};
  const SUPPORT_CANCELS = {"scout": ["turn", "visibility", "falseRoute", "straight", "inversion", "fork", "debris", "water", "mental", "lightning", "closing"], "calm": ["tight", "moving", "rhythm", "impact", "mental", "heat", "lightning"], "brace": ["turn", "collision", "climb", "inversion", "impact", "current", "vertical", "turbulence", "dive"], "repair": ["moving", "debris", "water", "grapple", "heat", "lightning"], "ram": ["tight", "collision", "debris", "grapple", "closing"], "guard": ["collision", "inversion", "debris", "impact", "vertical", "heat", "lightning", "dive"]};
  const ABILITY_CANCELS = {"speed": ["tight", "moving", "collision", "straight", "fork", "rhythm", "grapple", "closing"], "flight": ["tight", "turn", "moving", "collision", "climb", "inversion", "debris", "water", "impact", "grapple", "vertical", "closing"], "light": ["visibility", "falseRoute", "mental", "heat", "lightning"], "ultimate": "all"};

  const PACE = {
    careful: { name: 'Осторожный', mod: 2, text: '+2 к Управлению, урон меньше на 1к6, но обычный успех не даёт позицию.' },
    race: { name: 'Гоночный', mod: 0, text: 'Без дополнительных преимуществ и штрафов.' },
    limit: { name: 'Предельный', mod: -2, text: '−2 к Управлению. Любой успех даёт ещё +1 позицию; провал наносит ещё 1к6.' }
  };

  const rivalChargeSet = () => Object.fromEntries(Object.keys(RIVAL_PROFILES).map(id => [id, { shield: false, sword: false, star: false, wing: false }]));
  const rivalEffectSet = () => Object.fromEntries(Object.keys(RIVAL_PROFILES).map(id => [id, { tempIntegrity: 0, positionGuard: false, controlBonus: 0, advantage: false, disadvantage: false, attackBonus: false }]));

  const defaultState = () => ({
    version: 4,
    crew: {driver:null,helper:null,hp:{},tempHp:{},ammo:{},checks:{}}, helperAction:'none', helperDone:false, pendingRoadLanes:{}, laneRevision:18, crewDamageShare:0.33,
    started: false,
    finished: false,
    eliminated: false,
    stageIndex: 0,
    phase: 'setup',
    standings: ['player', 'aegon', 'saira', 'pello', 'mael', 'ordis'],
    distance: { player: 0, aegon: 0, saira: 0, pello: 0, mael: 0, ordis: 0 }, distanceStage: -1, lastCueDistances: { player:0,aegon:0,saira:0,pello:0,mael:0,ordis:0 }, crowdEvents: [], distanceRevision: 11,
    integrity: 30,
    tempIntegrity: 0,
    rivalIntegrity: { ...RIVAL_BASE_INTEGRITY },
    controlBonus: 5,
    supportBonus: 5,
    saveBonus: 4,
    attackBonus: 5,
    rollMode: 'auto',
    lapControl: { lap: -1, status: null, successes: 0, failures: 0, usedSkills: [] },
    sabotageTokens: 0,
    rulesRevision: 22, cancelledTags: { stage: -1, tags: [] }, stageFailures: [], pendingRuleChecks: [], ruleLastResult: null, collisionChecksStage: -1, skipStages: {}, delayedControl: {}, karaPanic: false, riderOut: {},
    selection: { pace: 'race', support: 'scout', arc: null, arcMode: 'chariot', ability: null },
    activeArc: null,
    nextControlBonus: 0,
    nextAdvantage: false,
    nextDisadvantage: false,
    swordBoost: false,
    shieldPositionGuard: false,
    damageReduction: 0,
    ejectionGuard: false,
    lightProtection: false,
    supportControlBonus: 0,
    controlAdvantage: false,
    charges: { speed: false, flight: false, light: false, ultimate: false },
    awakened: { speed: false, flight: false, light: false },
    battleMark: false,
    ultimateUsed: false,
    selectedAbilityApplied: false,
    lastControl: null,
    lastSupport: null,
    stageSnapshot: null,
    rivalTurnDone: false,
    rivalTurnResults: [],
    masterTurnStage: -1,
    masterTurnOrder: [],
    masterTurnIndex: 0,
    masterAction: null,
    masterLastResult: null,
    stageRolls: {},
    rivalRoutes: {},
    trackLanes: {},
    roadLanes: Object.fromEntries(Object.keys(RACERS).map((id,i)=>[id,i])),
    lastCueRoadLanes: Object.fromEntries(Object.keys(RACERS).map((id,i)=>[id,i])),
    lastCueBranches: {},
    rivalArcModes: {},
    routeEligible: { player: false },
    arcClaims: [],
    rivalCharges: rivalChargeSet(),
    rivalArcEffects: rivalEffectSet(),
    gmRollMode: 'auto',
    rivalUsage: {
      aegonReactionLaps: [], aegonReactionStage: -1,
      sairaHeat: 0, sairaShieldLaps: [], sairaCeramicGuard: false,
      pelloTeleports: [], pelloBlinkLaps: [], pelloPrepared: false, pelloEmergencyUnlocked: false, pelloEmergencyReadyAt: 0,
      maelResonance: 0, maelCounterLaps: [],
      ordisCharge: 0, ordisPanic: false, ordisGroundingBonus: false
    },
    log: [{ label: 'Арена', text: 'Экипажи занимают стартовые коридоры. Сигнальные кристаллы пока темны.' }]
  });

  let state = loadState();
  let pendingRoll = null;
  let viewMode = loadViewMode();
  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sapphire-race-engine-v4') : null;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const playArea = $('#playArea');

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (parsed?.version === 4) { if (parsed.selection?.support === 'attack') parsed.selection.support = 'ram'; return ensureDistanceState(parsed); }
    } catch (_) {}
    return defaultState();
  }

  function loadViewMode() {
    try {
      if (location.hash === '#master') return 'master';
      if (location.hash === '#player') return 'player';
      return sessionStorage.getItem(VIEW_KEY) === 'master' ? 'master' : 'player';
    } catch (_) {
      return 'player';
    }
  }

  function sceneCue(actor, key, label, details = {}) {
    if(actor!=='player'&&state.rivalRoutes[actor])rememberTrackLane(actor,state.rivalRoutes[actor]);
    const prior = details.beforeDistances || state.lastCueDistances || {...state.distance};
    reconcileRoadLanes();
    const beforeRoadLanes={...(state.lastCueRoadLanes||state.roadLanes)};
    const beforeBranches={...(state.lastCueBranches||{})};
    const travels=Object.keys(RACERS).some(id=>state.distance[id]!==prior[id]);
    const cue = { beforeRoadLanes,afterRoadLanes:{...state.roadLanes},beforeBranches,afterBranches:travels?{...state.trackLanes}:beforeBranches, beforeDistances: {...prior}, afterDistances: {...state.distance}, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, actor, key, label, stage: state.stageIndex, after: [...state.standings], ...details };
    state.sceneEvents = [...(state.sceneEvents || []), cue].slice(-40);
    state.lastCueDistances = {...state.distance};
    state.lastCueRoadLanes={...cue.afterRoadLanes};state.lastCueBranches={...cue.afterBranches};
    const crossed = Object.keys(RACERS).some(id => id !== actor && prior[actor] <= prior[id] && state.distance[actor] > state.distance[id]);
    if(crossed && details.success !== false) crowdCue('cheer',actor);
    else if(details.success === false) crowdCue('disappointed',actor);
  }

  window.SapphireRace = { snapshot: () => ({track: TRACK, ranks:Object.fromEntries(Object.keys(RACERS).map(id=>[id,racerPosition(id)])), activeActor: state.phase==='rivals'&&!state.rivalTurnDone?state.masterTurnOrder[state.masterTurnIndex]||'player':'player', state: JSON.parse(JSON.stringify(state)), stages: STAGES, racers: RACERS, arcs: ARCS, abilities: ABILITIES, tagRules: { descriptions: TAG_DESCRIPTIONS, support: SUPPORT_CANCELS, abilities: ABILITY_CANCELS }, viewMode}), animate: () => window.SapphireScene?.run(false) || Promise.resolve() };

  function saveState() {
    ensureDistanceState();reconcileRoadLanes();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncChannel?.postMessage(state);
  }

  function setViewMode(mode) {
    viewMode = mode === 'master' ? 'master' : 'player';
    try {
      sessionStorage.setItem(VIEW_KEY, viewMode);
      history.replaceState(null, '', viewMode === 'master' ? '#master' : '#player');
    } catch (_) {}
    render();
  }

  function crewRoster(){try{const custom=JSON.parse(localStorage.getItem('sapphire-crew-roster-v18')||'[]');return window.SapphireCrew?[window.SapphireCrew.seed,...custom.filter(a=>a.id!==window.SapphireCrew.seed.id),...custom.filter(a=>a.id===window.SapphireCrew.seed.id)].filter((a,i,list)=>list.findLastIndex(b=>b.id===a.id)===i):[];}catch(_){return window.SapphireCrew?[window.SapphireCrew.seed]:[];}}
  function saveRosterActor(actor){const roster=crewRoster().filter(a=>a.id!==actor.id);roster.push(actor);localStorage.setItem('sapphire-crew-roster-v18',JSON.stringify(roster));}
  function ensureCrew(){if(!window.SapphireCrew)return;state.crew ||= {driver:null,helper:null,hp:{},tempHp:{},ammo:{},checks:{}};const c=state.crew;c.hp ||= {};c.tempHp ||= {};c.ammo ||= {};c.checks ||= {};c.driver ||= window.SapphireCrew.seed.id;const roster=crewRoster();if(!roster.some(a=>a.id===c.driver))c.driver=window.SapphireCrew.seed.id;if(!roster.some(a=>a.id===c.helper)||c.helper===c.driver)c.helper=null;for(const actor of roster){c.hp[actor.id]??=actor.hp;c.tempHp[actor.id]??=actor.tempHp;for(const w of actor.ranged)c.ammo[actor.id+':'+w.id]??=w.ammo;}const driver=crewActor('driver');state.controlBonus=driver.tools.land.bonus;state.saveBonus=driver.abilities.dex.save;state.attackBonus=driver.ranged[0]?.bonus??driver.abilities.dex.mod;}
  function crewActor(role){return crewRoster().find(a=>a.id===state.crew?.[role]);}
  function crewMembers(){return ['driver','helper'].map(role=>({role,actor:crewActor(role)})).filter(r=>r.actor);}
  function crewHp(role){const actor=crewActor(role);return actor?state.crew.hp[actor.id]:0;}
  function crewCheck(role,action){const actor=crewActor(role);if(!actor)return {label:action==='drive'||action==='ram'?'Управление':'Проверка навыка',bonus:action==='drive'||action==='ram'?state.controlBonus:state.supportBonus};const checks=window.SapphireCrew.options(actor,action);const key=role+':'+action;const ix=state.crew.checks[key]??checks.reduce((best,c,i)=>c.bonus>checks[best].bonus?i:best,0);return checks[ix]||checks[0]||{label:'Ловкость',bonus:actor.abilities.dex.mod};}
  function checkPickerHtml(role,action){const a=crewActor(role);if(!a)return '';const checks=window.SapphireCrew.options(a,action);if(checks.length<2)return `<p class="crew-formula">${escapeHtml(a.name)} · ${crewCheck(role,action).label} ${signed(crewCheck(role,action).bonus)}</p>`;const selected=crewCheck(role,action);return `<label class="field">Какую проверку делает ${escapeHtml(a.name)}?<select data-crew-check="${role}:${action}">${checks.map((c,i)=>`<option value="${i}" ${c===selected?'selected':''}>${c.label} ${signed(c.bonus)}</option>`).join('')}</select></label>`;}
  function bindCheckPicker(role,action,rerender){const input=$(`[data-crew-check="${role}:${action}"]`);input?.addEventListener('change',()=>{state.crew.checks[role+':'+action]=Number(input.value);saveState();rerender();});}
  function crewStatusHtml(){if(!window.SapphireCrew)return '';return `<div class="crew-status">${crewMembers().map(r=>`<article class="crew-member">${r.actor.portrait?`<img src="${escapeHtml(r.actor.portrait)}" alt="${escapeHtml(r.actor.name)}">`:'<span class="crew-placeholder" aria-label="Портрет не загружен">♟</span>'}<div><small>${r.role==='driver'?'Водитель':'Помощник'}</small><b>${escapeHtml(r.actor.name)}</b><span>ОЗ ${crewHp(r.role)}/${r.actor.hpMax}${state.crew.tempHp[r.actor.id]?' +'+state.crew.tempHp[r.actor.id]+' врем.':''} · КД ${r.actor.ac}${crewHp(r.role)<=0?' · без сознания':''}</span></div></article>`).join('')}</div>`;}
  function damageCrew(role,incoming,type='bludgeoning'){const a=crewActor(role);if(!a)return 0;if(state.crewProtected){state.crewProtected=false;addLog('Руны','Удар по экипажу поглощён.');return 0;}let n=a.immunities.includes(type)?0:a.resistances.includes(type)?Math.floor(incoming/2):a.vulnerabilities.includes(type)?incoming*2:incoming;const temp=Math.min(n,state.crew.tempHp[a.id]||0);state.crew.tempHp[a.id]-=temp;n-=temp;const old=crewHp(role);state.crew.hp[a.id]=Math.max(0,old-n);addLog(a.name,`${n} урона (${type}). ОЗ ${state.crew.hp[a.id]}/${a.hpMax}.${state.crew.hp[a.id]===0?' Персонаж без сознания, действия недоступны.':''}`);return old-state.crew.hp[a.id];}
  const HELPER_ACTIONS={none:['Без действия','Сохранить внимание на гонке.'],help:['Помочь водителю','Преимущество на следующий бросок Управления.'],scout:['Разведать путь','Своя проверка навыка; помогает выбрать траекторию.'],calm:['Успокоить Кару','Своя проверка Ухода за животными.'],brace:['Удержать корпус','Атлетика или Акробатика помощника.'],repair:['Провести ремонт','Свои характеристики и владение инструментами.'],guard:['Защитить экипаж','Магия Сл 14: активировать защитные руны.'],ranged:['Дальнобойная атака','Оружие из чарника; цель на той же позиции, в соседней полосе.']};
  function helperChoiceHtml(){if(!crewActor('helper'))return '';return `<div class="section-label"><h3>Действие помощника</h3><span>${escapeHtml(crewActor('helper').name)}</span></div><div class="choice-grid">${Object.entries(HELPER_ACTIONS).map(([key,[name,text]])=>`<button class="choice-card ${state.helperAction===key?'selected':''}" data-helper-action="${key}" ${crewHp('helper')<=0&&key!=='none'?'disabled':''}><b>${name}</b><span>${text}</span></button>`).join('')}</div>`;}
  function bindHelperChoice(){$$('[data-helper-action]').forEach(b=>b.addEventListener('click',()=>{state.helperAction=b.dataset.helperAction;saveState();renderChoice();}));}
  function helperTargets(){return Object.keys(RIVAL_PROFILES).filter(id=>alive(id)&&Math.abs(distanceOf(id)-distanceOf('player'))<.001&&Math.abs(state.roadLanes[id]-state.roadLanes.player)===1);}
  function finishHelper(){state.helperDone=true;saveState();setPhase('support');}
  function renderHelperTurn(){ensureCrew();const actor=crewActor('helper'),action=state.helperAction;if(!actor||crewHp('helper')<=0||!HELPER_ACTIONS[action]||action==='none'){finishHelper();return;}if(action==='help'){playArea.innerHTML=`${crewStatusHtml()}<h2 class="scene-title">Помочь водителю</h2><p class="scene-copy">${escapeHtml(actor.name)} помогает ${escapeHtml(crewActor('driver').name)}: преимущество на следующий бросок Управления. Это расходует действие помощника.</p><button class="primary-button" id="helperApply">Помочь</button>`;$('#helperApply').addEventListener('click',()=>{state.controlAdvantage=true;addLog(actor.name,'Помощь водителю: преимущество на Управление.');sceneCue('player','scout','Помощь водителю',{success:true});finishHelper();});return;}if(action==='ranged'){renderHelperRanged();return;}const check=crewCheck('helper',action),dc=SUPPORT_ACTIONS[action].dc==='stage'?effectiveStageDc('neutral'):SUPPORT_ACTIONS[action].dc;playArea.innerHTML=`${crewStatusHtml()}<span class="overline">Отдельное действие помощника</span><h2 class="scene-title">${SUPPORT_ACTIONS[action].name}</h2><p class="scene-copy">${SUPPORT_ACTIONS[action].text}</p>${checkPickerHtml('helper',action)}${rollWidget({id:'helperRoll',label:actor.name,formula:`${check.label}: к20 ${signed(check.bonus)}`,dc,bonus:check.bonus})}`;bindCheckPicker('helper',action,renderHelperTurn);bindRollWidget('helperRoll',check.bonus,result=>resolveHelper(result,dc));}
  function resolveHelper(result,dc){const action=state.helperAction,actor=crewActor('helper');if(!actor||action==='ram'||action==='drive'){finishHelper();return;}const success=result.total>=dc;let text='Не удалось.';if(success){if(action==='scout'){if(result.total>=dc+5)state.controlAdvantage=true;else state.supportControlBonus+=rollDie(4);text='Маршрут разведан.';}if(action==='calm'){state.karaPanic=false;state.nextDisadvantage=false;state.supportControlBonus+=2;text='+2 к Управлению.';}if(action==='brace'){state.damageReduction+=rollDie(6)+3;state.ejectionGuard=true;text='Корпус удержан.';}if(action==='repair'){const hp=result.total>=20?rollDice(2,6)+3:rollDie(6)+3;state.integrity=Math.min(30,state.integrity+hp);text='Ремонт: +'+hp+' Целостности.';}if(action==='guard'){state.damageReduction+=rollDie(6);state.ejectionGuard=true;state.crewProtected=true;text='Защитные руны активированы.';}state.cancelledTags.tags=[...new Set([...state.cancelledTags.tags,...raceTags('player').filter(t=>(SUPPORT_CANCELS[action]||[]).includes(t))])];}if(action==='repair'&&result.raw===1)applyDamage(rollDie(4));addLog(actor.name,`${SUPPORT_ACTIONS[action].name}: ${rollText(result,dc)}. ${text}`);sceneCue('player',action,SUPPORT_ACTIONS[action].name,{success});finishHelper();}
  function renderHelperRanged(){const actor=crewActor('helper'),weapons=actor.ranged.filter(w=>!w.unsupported),targets=helperTargets();if(!weapons.length||!targets.length){playArea.innerHTML=`${crewStatusHtml()}<h2 class="scene-title">Выстрел недоступен</h2><p class="scene-copy">${weapons.length?'На той же позиции нет живой колесницы в соседней полосе.':'В чарнике нет поддерживаемого дальнобойного оружия.'}</p><button class="primary-button" id="helperSkip">Продолжить без выстрела</button>`;$('#helperSkip').addEventListener('click',finishHelper);return;}state.helperWeapon=weapons.some(w=>w.id===state.helperWeapon)?state.helperWeapon:weapons[0].id;state.helperTarget=targets.includes(state.helperTarget)?state.helperTarget:targets[0];const w=weapons.find(w=>w.id===state.helperWeapon),target=state.helperTarget,dc=RIVAL_PROFILES[target].chariot.ac,ammo=state.crew.ammo[actor.id+':'+w.id],disadvantage=true;playArea.innerHTML=`${crewStatusHtml()}<h2 class="scene-title">Дальнобойная атака</h2><label class="field">Оружие<select id="helperWeapon">${weapons.map(w=>`<option value="${escapeHtml(w.id)}" ${w.id===state.helperWeapon?'selected':''}>${escapeHtml(w.name)} ${signed(w.bonus)}</option>`).join('')}</select></label><label class="field">Цель<select id="helperTarget">${targets.map(id=>`<option value="${id}" ${target===id?'selected':''}>${RACERS[id].name} · полоса ${state.roadLanes[id]+1} · КД ${RIVAL_PROFILES[id].chariot.ac}</option>`).join('')}</select></label><p class="scene-copy">Соседняя полоса считается 5 футами. Враг рядом: помеха на дальнобойную атаку. Атак в действии: ${w.loading?1:actor.attacks||1}; выполнено ${state.helperShots||0}${w.loading?' (перезарядка)':''}; урон ${w.damageDice[0]}к${w.damageDice[1]} ${signed(w.damageBonus)}. Боеприпасы: ${w.ammoGenerated?'создаются магически':ammo??'в экспорте не указаны'}.</p>${ammo===0?'<p class="rule-alert">Боеприпасы закончились.</p>':rollWidget({id:'helperShot',label:w.name,formula:`к20 ${signed(w.bonus)}`,bonus:w.bonus,dc,disadvantage})}<button class="secondary-button" id="helperSkip">Отказаться от выстрела</button>`;$('#helperWeapon').addEventListener('change',e=>{state.helperWeapon=e.target.value;saveState();renderHelperRanged();});$('#helperTarget').addEventListener('change',e=>{state.helperTarget=e.target.value;saveState();renderHelperRanged();});$('#helperSkip').addEventListener('click',finishHelper);if(ammo!==0)bindRollWidget('helperShot',w.bonus,result=>resolveHelperShot(result),{disadvantage});}
  function resolveHelperShot(result){const actor=crewActor('helper'),w=actor?.ranged.find(w=>w.id===state.helperWeapon),target=state.helperTarget;if(!w||!helperTargets().includes(target)){toast('Цель больше не доступна.');renderHelperRanged();return;}const key=actor.id+':'+w.id;if(state.crew.ammo[key]===0)return;if(state.crew.ammo[key]!==null)state.crew.ammo[key]=Math.max(0,state.crew.ammo[key]-1);const success=result.raw===20||(result.raw!==1&&result.total>=RIVAL_PROFILES[target].chariot.ac),damage=success?Math.max(0,rollDice(w.damageDice[0]*(result.raw===20?2:1),w.damageDice[1])+w.damageBonus):0;if(damage)applyDamageToRival(target,damage,{sourceId:'player',attackTotal:result.total});addLog(actor.name,`${w.name}: ${rollText(result,RIVAL_PROFILES[target].chariot.ac)}. ${success?'Попадание: '+damage+' урона.':'Промах.'}`);sceneCue('player','light','Выстрел: '+w.name,{target,success});state.helperShots=(state.helperShots||0)+1;if(state.helperShots<(w.loading?1:actor.attacks||1)){saveState();renderHelperRanged();}else finishHelper();}

  function renderCrewIncapacitated(){playArea.innerHTML=`${crewStatusHtml()}<h2 class="scene-title">Водитель без сознания</h2><p class="scene-copy">Управление и таран недоступны до восстановления ОЗ или смены водителя.</p>${crewActor('helper')&&crewHp('helper')>0?'<button class="primary-button" id="takeReins">Помощник берёт вожжи</button>':''}<div id="crewRecoveryControls"></div>`;$('#takeReins')?.addEventListener('click',()=>{[state.crew.driver,state.crew.helper]=[state.crew.helper,state.crew.driver];ensureCrew();addLog('Экипаж',crewActor('driver').name+' берёт вожжи.');saveState();render();});if(viewMode==='master')renderCrewDamageControls();else{const el=$('#crewRecoveryControls');el.innerHTML='<button class="secondary-button" id="recoverMaster">Открыть пульт мастера</button>';$('#recoverMaster').addEventListener('click',()=>setViewMode('master'));}}
  function renderCrewDamageControls(){if(!crewMembers().length||!playArea.insertAdjacentHTML)return;playArea.insertAdjacentHTML('beforeend',`<details class="crew-checks"><summary>Урон и лечение экипажа · мастер</summary>${crewStatusHtml()}<label class="field">Персонаж<select id="crewDamageRole">${crewMembers().map(r=>`<option value="${r.role}">${escapeHtml(r.actor.name)}</option>`).join('')}</select></label><label class="field">Количество<input id="crewDamageValue" type="number" min="0" max="999" value="1"></label><label class="field">Тип урона<select id="crewDamageType">${['bludgeoning','piercing','slashing','fire','lightning','poison','psychic','cold'].map(k=>`<option value="${k}">${({bludgeoning:'Дробящий',piercing:'Колющий',slashing:'Рубящий',fire:'Огонь',lightning:'Молния',poison:'Яд',psychic:'Психический',cold:'Холод'})[k]}</option>`).join('')}</select></label><div class="action-bar"><button class="secondary-button" id="crewTakeDamage">Нанести урон</button><button class="secondary-button" id="crewHeal">Восстановить ОЗ</button></div><p class="scene-copy">Для прямых атак по пассажиру используйте его КД, показанный выше. Эти кнопки учитывают сопротивления, временные ОЗ и руны.</p></details>`);$('#crewTakeDamage').addEventListener('click',()=>{damageCrew($('#crewDamageRole').value,clamp(Number($('#crewDamageValue').value)||0,0,999),$('#crewDamageType').value);saveState();render();});$('#crewHeal').addEventListener('click',()=>{const role=$('#crewDamageRole').value,a=crewActor(role);state.crew.hp[a.id]=Math.min(a.hpMax,crewHp(role)+clamp(Number($('#crewDamageValue').value)||0,0,999));addLog(a.name,'Лечение: ОЗ '+crewHp(role)+'/'+a.hpMax);saveState();render();});}
  function currentStage() { return STAGES[state.stageIndex]; }
  function currentLap() { return currentStage() ? LAPS[currentStage().lap] : LAPS[2]; }
  function ensureDistanceState(value = state) {
    if (!value.distance) {
      const distance=value.started ? (value.stageIndex + (value.lastControl ? 1 : 0))*10 : 0;
      value.distance=Object.fromEntries(Object.keys(RACERS).map(id=>[id,distance]));
      value.distanceStage=value.lastControl?value.stageIndex:value.stageIndex-1;
      value.sceneEvents=[];value.lastCueDistances={...value.distance};
      if(value.started)value.log.unshift({label:'Дистанция',text:'Этот заезд сохранён до учёта расстояния. Всем экипажам назначена общая дистанция текущего этапа; для общего старта с нуля начните новую гонку.'});
    }
    value.trackLanes ||= {};
    value.roadLanes ||= Object.fromEntries(Object.keys(RACERS).map((id,i)=>[id,i]));
    value.lastCueRoadLanes ||= {...value.roadLanes};value.lastCueBranches ||= {...value.trackLanes};
    value.pendingRoadLanes ||= {};if(value.laneRevision!==18){value.lastCueRoadLanes={...value.roadLanes};value.laneRevision=18;}
    value.crowdEvents ||= [];value.distanceRevision=11;return value;
  }
  function roadOffset(lane){return (lane-2.5)*36;}
  function laneClear(id,lane,value=state){return Object.keys(RACERS).every(other=>{if(other===id||(other==='player'?value.eliminated:value.rivalIntegrity[other]<=0))return true;const gap=Math.abs((value.distance[id]-value.distance[other])%90);return Math.min(gap,90-gap)>=1||lane!==value.roadLanes[other];});}
  function reconcileRoadLanes(value=state){value.roadLanes ||= Object.fromEntries(Object.keys(RACERS).map((id,i)=>[id,i]));for(const id of Object.keys(RACERS)){if(!Number.isInteger(value.roadLanes[id])||value.roadLanes[id]<0||value.roadLanes[id]>5)value.roadLanes[id]=Object.keys(RACERS).indexOf(id);}}
  function chooseRoadLane(id,lane){ensureDistanceState();if(!Number.isInteger(lane)||lane<0||lane>5)return false;state.pendingRoadLanes ||= {};state.pendingRoadLanes[id]=lane;const arc=currentStage().arcs[lane<3?0:1];if(id==='player')state.selection.arc=arc;else state.rivalRoutes[id]=arc;saveState();return true;}
  function commitRoadLane(id,success){if(!success)return;const wanted=state.pendingRoadLanes?.[id]??state.roadLanes[id];const group=wanted<3?[0,1,2]:[3,4,5],available=[wanted,...group.filter(l=>l!==wanted)].find(l=>laneClear(id,l));if(available===undefined){addLog('Полоса','Выбранный проход занят на этой позиции. Полоса сохранена; награда другой арки не выдаётся.');if(id==='player')state.selection.arc=currentStage().arcs[state.roadLanes[id]<3?0:1];else state.rivalRoutes[id]=currentStage().arcs[state.roadLanes[id]<3?0:1];}else state.roadLanes[id]=available;delete state.pendingRoadLanes[id];state.trackLanes[id]=state.roadLanes[id]<3?-1:1;}
  function roadLanePicker(id){ensureDistanceState();const planned=state.pendingRoadLanes?.[id]??state.roadLanes[id];return `<div class="road-lane-picker"><span>После Управления</span>${Array.from({length:6},(_,lane)=>`<button data-road-racer="${id}" data-road-lane="${lane}" class="${planned===lane?'selected':''}" title="${lane<3?'Внутренняя арка':'Внешняя арка'} · ${lane===0?'у центра':lane===5?'у трибун':'полоса '+(lane+1)}">${lane+1}</button>`).join('')}<small>Сейчас ${state.roadLanes[id]+1}; выбрана ${planned+1}. 1–3: центр · 4–6: трибуны</small></div>`;}
  function bindRoadLanePicker(){ $$('[data-road-lane]').forEach(button=>button.addEventListener('click',()=>{if(chooseRoadLane(button.dataset.roadRacer,Number(button.dataset.roadLane)))render();}));}
  function rememberTrackLane(id,arc){ensureDistanceState();const branch=currentStage().arcs.indexOf(arc);if(branch<0)return;state.pendingRoadLanes ||= {};const planned=state.pendingRoadLanes[id]??state.roadLanes[id];if((planned<3?0:1)!==branch)state.pendingRoadLanes[id]=branch===0?Math.min(2,state.roadLanes[id]):Math.max(3,state.roadLanes[id]);}
  function alive(id){return id==='player'?!state.eliminated:state.rivalIntegrity[id]>0}
  function distanceOf(id){ensureDistanceState();return state.distance[id]||0}
  function sortStandings(){state.standings.sort((a,b)=>Number(alive(b))-Number(alive(a))||distanceOf(b)-distanceOf(a));}
  function playerPosition(){return racerPosition('player')}
  function racerPosition(id){return 1+Object.keys(RACERS).filter(other=>other!==id&&alive(other)&&(!alive(id)||distanceOf(other)>distanceOf(id))).length}
  function distanceLabel(id){const distance=distanceOf(id);return `${distance} поз. · круг ${Math.min(3,Math.floor(distance/90)+1)} · ${distance%90}/90`}
  function gapLabel(id){const lead=Math.max(...Object.keys(RACERS).filter(alive).map(distanceOf));const gap=lead-distanceOf(id);return gap?`−${gap} поз. до лидера`:'общая дистанция лидера'}
  function crowdCue(kind,actor){const events=state.crowdEvents;const last=events.at(-1);if(last&&last.actor===actor&&last.kind===kind&&Date.now()-last.time<700)return;events.push({id:`crowd-${Date.now()}-${Math.random()}`,kind,actor,time:Date.now()});state.crowdEvents=events.slice(-30)}
  function advanceField(){ensureDistanceState();if(state.distanceStage===state.stageIndex)return;for(const id of Object.keys(RACERS))if(alive(id)&&state.skipStages[id]!==state.stageIndex&&!state.riderOut[id])state.distance[id]+=10;state.distanceStage=state.stageIndex;sortStandings();}
  function moveRacer(id,gain){if(!(id in RACERS)||!gain)return;state.distance[id]=Math.max(0,distanceOf(id)+gain);sortStandings();}
  function swapRacers(firstId,secondId){if(!(firstId in RACERS)||!(secondId in RACERS))return;const first=distanceOf(firstId);state.distance[firstId]=distanceOf(secondId);state.distance[secondId]=first;sortStandings();}

  function raceTags(id='player') {return [...new Set([...currentStage().tags,...Object.entries(state.npcTags?.[id]||{}).filter(([,until])=>until>=state.stageIndex).map(([tag])=>tag)])];}
  function addNpcTag(id,tag){state.npcTags||={};state.npcTags[id]||={};state.npcTags[id][tag]=state.stageIndex+1;addLog(RACERS[id].name,`Получен тег «${TAG_LABELS[tag]}» до конца следующего этапа.`);}
  function canonWisSave(id){const profile=RIVAL_PROFILES[id],explicit=profile?.saves.match(/Мудрость\s*([+-]\d+)/);return checkRoll(id==='player'?(crewActor('driver')?.abilities.wis.save??state.saveBonus):explicit?Number(explicit[1]):Math.floor((profile.abilities.wis-10)/2));}
  function damagePilots(id,n,type){
    if(id==='player'){const riders=crewMembers();if(!riders.length){addLog('Экипаж',`${n} урона (${type}) экипажу: персонаж не выбран, примените вручную.`);return;}riders.forEach(r=>damageCrew(r.role,n,type));return;}
    state.npcHp||={};const old=state.npcHp[id]??RIVAL_PROFILES[id].racer.hp;state.npcHp[id]=Math.max(0,old-n);addLog(RIVAL_PROFILES[id].name,`${n} урона (${type}) пилоту. ОЗ ${state.npcHp[id]}/${RIVAL_PROFILES[id].racer.hp}.`);
  }
  function legalCanonTargets(id,key){const targets=state.standings.filter(t=>t!==id&&alive(t)&&(key==='pello_laugh'?Math.floor(distanceOf(t)/10)===Math.floor(distanceOf(id)/10):key==='aegon_blade'?distanceOf(t)>=distanceOf(id):distanceOf(t)>distanceOf(id)));if(key==='aegon_blade'){const closest=Math.min(...targets.filter(t=>distanceOf(t)>distanceOf(id)).map(distanceOf));return targets.filter(t=>distanceOf(t)===distanceOf(id)||distanceOf(t)===closest);}return targets;}
  function canonTargetPicker(id,action){if(!action||!['pello_swap','pello_laugh','aegon_blade'].includes(action.id))return '';const targets=legalCanonTargets(id,action.id);return `<label class="field">Цель способности<select id="canonTarget">${targets.map(t=>`<option value="${t}" ${action.targetId===t?'selected':''}>${RACERS[t].name} · ${distanceOf(t)} поз.</option>`).join('')}</select></label>`;}
  function renderCanonReaction(){
    if(!playArea.insertAdjacentHTML)return;
    if(state.canonReactionResult){playArea.insertAdjacentHTML('beforeend',`<details open><summary>Реакция Эйгона</summary><p>${escapeHtml(state.canonReactionResult)}</p><button id="canonReactionClose" class="secondary-button">Закрыть результат</button></details>`);$('#canonReactionClose').addEventListener('click',()=>{state.canonReactionResult=null;saveState();render();});return;}
    if(!canAegonCutoff())return;
    const target=aegonCutoffTarget(),dc=controlResultFor(target),bonus=RIVAL_PROFILES.aegon.control;
    playArea.insertAdjacentHTML('beforeend',`<details><summary>Эйгон: доступна реакция «Срезать путь» против ${RACERS[target].name}</summary><p>1/этап, расходует Щит. Ничья в пользу Эйгона.</p>${rollWidget({id:'canonReaction',label:'Срезать путь',formula:'Управление: к20 +7',dc,bonus,mode:state.gmRollMode})}</details>`);
    bindRollWidget('canonReaction',bonus,roll=>{if(!canAegonCutoff())return;const before=[...state.standings];spendRivalCharge('aegon','shield');state.rivalUsage.aegonReactionStage=state.stageIndex;const success=roll.total>=dc;if(success)swapRacers('aegon',target);state.canonReactionResult=`${rollText(roll,dc)}. ${success?'Обгон отменён.':'Соперник удержал линию.'}`;addLog('Эйгон',state.canonReactionResult);sceneCue('aegon','aegon_cutoff','Срезать путь',{before,target,success});saveState();render();});
  }
  function renderCanonPending(){
    const p=state.canonPending,{action,roll}=p,heat=state.rivalUsage.sairaHeat;
    const ram=action.id==='universal_ram'&&roll.raw!==1&&roll.total>action.dc;
    const need=action.id==='saira_updraft'?Math.max(1,Math.ceil((action.dc-roll.total)/2)):0;
    playArea.innerHTML=`<span class="overline">Сайра · решение после броска</span><h2 class="scene-title">${action.name}</h2><p class="scene-copy">${rollText(roll,action.dc)}. Жар: ${heat}/5. ${ram?'Добавить +3 урона за каждую потраченную единицу Жара?':'Можно потратить 1 Жар на переброс. Новый результат заменяет старый.'}</p><div class="action-bar">${!ram?'<button class="primary-button" id="canonReroll">Перебросить · −1 Жар</button>':''}${!ram&&need&&need<=heat?`<button class="primary-button" id="canonBoost">Добавить +${need*2} · −${need} Жара</button>`:''}</div>${ram?`<label class="field">Расход Жара<select id="canonHeat">${Array.from({length:heat+1},(_,i)=>`<option value="${i}">${i} · +${i*3} урона</option>`).join('')}</select></label>`:''}<button class="secondary-button" id="canonAccept">${ram?'Применить выбранный урон':'Оставить результат'}</button><p class="scene-copy">Тестовая трактовка канона: переброс стоит 1 Жар; усиление расходует Жар. Для тарана базовый урон 1к6, +3 за потраченную единицу Жара.</p>`;
    const accept=()=>{state.canonPending=null;executeMasterAction(p.id,action,{...roll,canonDecided:true});};
    $('#canonAccept').addEventListener('click',()=>{if(ram){const n=Number($('#canonHeat').value);state.rivalUsage.sairaHeat-=n;roll.heatSpent=n;}accept();});
    $('#canonBoost')?.addEventListener('click',()=>{state.rivalUsage.sairaHeat-=need;roll.total+=need*2;addLog('Сайра',`Восходящий поток: потрачено ${need} Жара, +${need*2} к результату.`);accept();});
    $('#canonReroll')?.addEventListener('click',()=>{state.rivalUsage.sairaHeat-=1;const bonus=roll.total-roll.raw;const fresh=checkRoll(bonus,roll.rollOptions||{advantage:action.advantage,disadvantage:action.disadvantage});fresh.rollOptions=roll.rollOptions;p.roll=fresh;addLog('Сайра',`Переброс за 1 Жар: ${rollText(fresh,action.dc)}.`);state.canonPending=null;executeMasterAction(p.id,action,fresh);});
  }

  function frontTarget(id) {
    const distance=distanceOf(id);
    return state.standings.filter(target=>target!==id&&alive(target)&&distanceOf(target)>=distance).sort((a,b)=>distanceOf(a)-distanceOf(b))[0]||null;
  }

  function controlResultFor(id) {
    if (id === 'player') return state.lastControl?.total || 10 + state.controlBonus;
    return state.stageRolls[id] || 10 + RIVAL_PROFILES[id].control;
  }

  function stageTagsHtml() {
    const tagRacer=viewMode==='master'&&state.phase==='rivals'?state.masterTurnOrder[state.masterTurnIndex]:'player';const cancelled=cancelledTags(tagRacer,state.phase==='choice');
    return raceTags(tagRacer).map(tag => `<details class="stage-tag ${cancelled.includes(tag) ? 'cancelled' : ''}"><summary>${TAG_LABELS[tag]}${cancelled.includes(tag) ? ' · −2' : ''}</summary><div><b>${TAG_DESCRIPTIONS[tag]}</b><p>${cancelled.includes(tag) ? 'Негативный эффект отменён для Кары. Сложность снижена на 2.' : 'Тег действует.'}</p><p>Отменяют: ${Object.entries(SUPPORT_CANCELS).filter(([,tags]) => tags.includes(tag)).map(([id]) => SUPPORT_ACTIONS[id].name).concat(Object.entries(ABILITY_CANCELS).filter(([,tags]) => tags === 'all' || tags.includes(tag)).map(([id]) => ABILITIES[id].name)).join(', ')}.</p></div></details>`).join('');
  }

  function hasRivalCharge(id, arc) { return Boolean(state.rivalCharges[id]?.[arc]); }
  function spendRivalCharge(id, arc) {
    if (!hasRivalCharge(id, arc)) return false;
    state.rivalCharges[id][arc] = false;
    return true;
  }

  function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }
  function rollDice(count, sides) { return Array.from({ length: count }, () => rollDie(sides)).reduce((a, b) => a + b, 0); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function addLog(label, text) {
    state.log.unshift({ label, text });
    state.log = state.log.slice(0, 30);
  }

  function toast(text) {
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = text;
    $('#toastRegion').append(node);
    setTimeout(() => node.remove(), 3100);
  }

  function setPhase(phase) {
    state.phase = phase;
    saveState();
    render();
  }

  function integrityPenalty() {
    if (state.integrity <= 10) return -4;
    if (state.integrity <= 20) return -2;
    return 0;
  }

  function ensureRuleState() {
    state.cancelledTags ||= { stage: -1, tags: [] };
    state.stageFailures ||= []; state.pendingRuleChecks ||= []; state.skipStages ||= {};
    state.delayedControl ||= {}; state.riderOut ||= {}; state.npcTags ||= {}; state.npcCancelled ||= {}; state.npcHp ||= {}; state.unblockable ||= {};
  }
  function selectionCancelledTags() {
    const support = SUPPORT_CANCELS[state.selection.support] || [];
    const ability = state.charges[state.selection.ability] ? ABILITY_CANCELS[state.selection.ability] || [] : [];
    return raceTags('player').filter(tag => support.includes(tag) || ability === 'all' || ability.includes(tag));
  }
  function cancelledTags(id = 'player', preview = false) {
    if (id !== 'player') return state.npcCancelled?.[id]?.stage===state.stageIndex ? state.npcCancelled[id].tags : [];
    if (preview) return selectionCancelledTags();
    return state.cancelledTags?.stage === state.stageIndex ? state.cancelledTags.tags : [];
  }
  function tagActive(tag, id = 'player') { return raceTags(id).includes(tag) && !cancelledTags(id).includes(tag); }
  function sabotageActive(id = 'player') {
    if (id !== 'player' || state.lapControl.lap !== currentStage().lap || state.lapControl.status !== 'failure') return false;
    const tag = ['moving','tight','falseRoute','climb','inversion','turn','tight','rhythm','straight'][state.stageIndex];
    return !tag || tagActive(tag, id);
  }
  function effectiveStageDc(id = 'player', preview = false) {
    const stage = currentStage(); let dc = stage.dc;
    if (state.lapControl.lap === stage.lap && state.lapControl.status === 'success') dc -= 2;
    if (sabotageActive(id) && (stage.lap === 0 ? [1,7].includes(state.stageIndex) : /Сл.*(?:повыш|на 2)|Сл повышается на 2/.test(stage.sabotage))) dc += 2;
    return dc - cancelledTags(id, preview).length * 2;
  }
  function cancellationNote(preview = false) {
    const tags = cancelledTags('player', preview);
    return `<div class="tag-rule-summary"><b>${preview ? 'После подтверждения' : 'Отменённые теги'}: ${tags.length ? tags.map(t => TAG_LABELS[t]).join(', ') : 'нет'}</b><span>Сл участка ${currentStage().dc}; итоговая Сл ${effectiveStageDc('player', preview)}${tags.length ? ` · −${tags.length * 2} за теги` : ''}. Один тег учитывается один раз.</span></div>`;
  }
  function cancellationHelp(tags) { return `Отменяет: ${tags === 'all' ? 'все теги участка' : tags.map(t => TAG_LABELS[t]).join(', ')}. Каждый отменённый тег: −2 к Сл Управления.`; }

  function groundFailureGain(index, id = 'player') {
    const tag = ['moving','collision','tight','climb','inversion','turn','tight','rhythm','debris'][index];
    if (tag && !tagActive(tag, id)) return 0;
    return ({0:-1,3:-2,7:-2,8:-3})[index] || 0;
  }
  function stageBaseDamage() { const [count,sides,flat=0]=currentStage().damage; return rollDice(count,sides)+flat; }
  function applyGroundFailure(id) {
    ensureRuleState();
    if (!state.stageFailures.includes(id)) state.stageFailures.push(id);
    if (state.stageIndex === 4 && tagActive('inversion',id)) state.pendingRuleChecks.push({type:'repair',racer:id,dc:15});
    if (state.stageIndex === 6 && tagActive('tight',id)) state.delayedControl[id]={stage:state.stageIndex+1,value:-5};
  }
  function prepareCollisionChecks() {
    ensureRuleState();
    if (state.stageIndex !== 1 || state.collisionChecksStage === state.stageIndex) return;
    state.collisionChecksStage=state.stageIndex;
    const order=state.stageSnapshot?.standings||state.standings;
    const failed=order.filter(id=>state.stageFailures.includes(id) && tagActive('collision',id) && (id==='player'?state.integrity:state.rivalIntegrity[id])>0);
    for(let a=0;a<failed.length;a++)for(let b=a+1;b<failed.length;b++)state.pendingRuleChecks.push({type:'collision',first:failed[a],second:failed[b],firstRoll:null});
    if (failed.length>1) addLog('Каменные зубы', `${failed.map(id=>RACERS[id].name).join(', ')} провалили участок: обязательные состязания тарана между провалившими экипажами.`);
  }
  function renderRiderRecovery() {
    playArea.innerHTML=`<span class="overline">Возница выпал из колесницы</span><h2 class="scene-title">Гонка приостановлена</h2><p class="scene-copy">Мастер разрешает спасение возницы и возвращение в колесницу. Документ не задаёт отдельного броска возвращения.</p><div class="action-bar">${viewMode==='master'?'<button class="primary-button" id="riderReturned">Возница вернулся в колесницу</button>':'<button class="secondary-button" id="riderMaster">Открыть пульт мастера</button>'}</div>`;
    $('#riderReturned')?.addEventListener('click',()=>{state.riderOut.player=false;addLog('Возница','Мастер подтвердил возвращение в колесницу.');saveState();render();});
    $('#riderMaster')?.addEventListener('click',()=>setViewMode('master'));
  }
  function ruleCheckBonus(check,racer) {
    if(check.type==='collision')return racer==='player'?state.controlBonus:RIVAL_PROFILES[racer].control;
    if(check.type==='repair')return racer==='player'?crewCheck('driver','smith').bonus:(RIVAL_PROFILES[racer].skillBonuses.tools ?? Math.floor((RIVAL_PROFILES[racer].abilities.int-10)/2)+RIVAL_PROFILES[racer].proficiency);
    return crewActor('driver')?.abilities.dex.save??state.saveBonus;
  }
  function renderRuleChecks() {
    if(state.ruleLastResult){
      playArea.innerHTML=`<span class="overline">Обязательная проверка</span><h2 class="scene-title">${state.ruleLastResult.title}</h2><p class="scene-copy">${state.ruleLastResult.text}</p><div class="action-bar"><button class="primary-button" id="ruleContinue">Продолжить</button></div>`;
      $('#ruleContinue').addEventListener('click',()=>{state.ruleLastResult=null;saveState();render();});return;
    }
    const check=state.pendingRuleChecks[0];if(!check)return;
    const racer=check.type==='collision'?(check.firstRoll?check.second:check.first):check.racer;
    const name=RACERS[racer].name;
    if(viewMode!=='master'&&racer!=='player'){
      playArea.innerHTML=`<span class="overline">Обязательная проверка</span><h2 class="scene-title">${name}: ход мастера</h2><p class="scene-copy">${check.type==='collision'?'Состязание тарана после провала «Каменных зубов».':'Ремонт инструментами кузнеца Сл 15.'}</p><div class="action-bar"><button class="secondary-button" id="rulesMaster">Открыть пульт мастера</button></div>`;
      $('#rulesMaster').addEventListener('click',()=>setViewMode('master'));return;
    }
    const title=check.type==='collision'?`Вынужденный таран: ${RACERS[check.first].name} / ${RACERS[check.second].name}`:check.type==='repair'?'Ремонт инструментами кузнеца':'Спасбросок Ловкости';
    const dc=check.type==='collision'?null:check.dc;
    const text=check.type==='collision'?`Оба экипажа бросают Управление. Сейчас ${name}${check.firstRoll?`; ${RACERS[check.first].name}: ${check.firstRoll.total}`:''}. При равенстве защищающийся впереди удерживает линию. Победитель наносит 1к6 + 3 урона.`:check.type==='repair'?`${name} восстанавливает сцепление с дорожкой. Провал: пропуск следующего хода.`:'Руна тяги погасла. Ловкость Сл 10: при провале возница выпадает из колесницы. Защитные печати предотвращают гибель; возвращение решает мастер.';
    const bonus=ruleCheckBonus(check,racer);
    playArea.innerHTML=`<span class="overline">Последствие участка</span><h2 class="scene-title">${title}</h2><p class="scene-copy">${text}</p>${rollWidget({id:'requiredRoll',label:name,formula:`к20 ${signed(bonus)}`,dc,bonus,mode:racer==='player'?state.rollMode:state.gmRollMode})}`;
    bindRollWidget('requiredRoll',bonus,result=>resolveRuleCheck(result));
  }
  function resolveRuleCheck(roll) {
    const check=state.pendingRuleChecks[0];if(!check)return;
    let title,text;
    if(check.type==='collision'){
      if(!check.firstRoll){check.firstRoll=roll;saveState();render();return;}
      title='Вынужденный таран';
      if(roll.total===check.firstRoll.total)text=`Ничья ${roll.total}: ${RACERS[check.first].name} удерживает линию. Урона и обмена местами нет.`;
      else {
        const winner=roll.total>check.firstRoll.total?check.second:check.first,loser=winner===check.first?check.second:check.first;
        const before=[...state.standings],damage=rollDie(6)+3;
        const applied=damageRaceTarget(loser,damage,winner,Math.max(roll.total,check.firstRoll.total));
        const swapped=distanceOf(winner)<=distanceOf(loser)?applyRamSwap(winner,loser):false;
        text=`${RACERS[check.first].name}: ${check.firstRoll.total}; ${RACERS[check.second].name}: ${roll.total}. ${RACERS[winner].name} выигрывает и наносит ${applied.damage} урона${swapped?'; экипажи меняются местами':''}. ${applied.text||''}`;
        sceneCue(winner,'universal_ram',title,{before,target:loser,success:true});
      }
    }else if(check.type==='repair'){
      title='Ремонт инструментами кузнеца';const success=roll.total>=check.dc;
      if(!success)state.skipStages[check.racer]=state.stageIndex+1;
      text=`${RACERS[check.racer].name}: ${rollText(roll,check.dc)}. ${success?'Корпус закреплён; следующий ход доступен.':'Ремонт не удался: следующий ход пропускается.'}`;
    }else {
      title='Спасбросок Ловкости';const success=roll.total>=check.dc;
      if(!success)state.riderOut[check.racer]=true;
      text=`${rollText(roll,check.dc)}. ${success?'Возница удержался в колеснице.':'Возница выпал из колесницы. Перед продолжением мастер должен подтвердить возвращение.'}`;
    }
    state.pendingRuleChecks.shift();state.ruleLastResult={title,text};addLog(title,text);saveState();render();
  }

  function updateUltimateReadiness() {
    const allAwake = Object.values(state.awakened).every(Boolean);
    if (allAwake && state.battleMark && !state.ultimateUsed) state.charges.ultimate = true;
  }

  function render() {
    ensureRuleState();ensureCrew();
    document.body.dataset.viewMode = viewMode;
    $('#playerModeButton').classList.toggle('active', viewMode === 'player');
    $('#masterModeButton').classList.toggle('active', viewMode === 'master');
    renderHeader();
    renderTrack();
    renderPhaseRail();
    renderKaraPanel();
    renderLog();

    playArea.classList.remove('transitioning');
    if(state.canonPending){renderCanonPending();return;}
    if (state.pendingRuleChecks.length || state.ruleLastResult) { renderRuleChecks(); return; }
    if (state.riderOut.player) { renderRiderRecovery(); return; }
    if(state.started&&crewActor('driver')&&crewHp('driver')<=0){renderCrewIncapacitated();return;}
    if (viewMode === 'master') {
      renderMasterConsole();renderCrewDamageControls();renderCanonReaction();
      return;
    }
    switch (state.phase) {
      case 'setup': renderSetup(); break;
      case 'qualifying': renderQualification(); break;
      case 'control': renderControlRoom(); break;
      case 'choice': renderChoice(); break;
      case 'helper': renderHelperTurn(); break;
      case 'support': renderSupportRoll(); break;
      case 'drive': renderDriveRoll(); break;
      case 'resolve': renderPlayerResult(); break;
      case 'rivals': renderRivalTurn(); break;
      case 'summary': renderStageSummary(); break;
      case 'finish': renderFinish(); break;
      default: renderSetup();
    }
  }

  function renderHeader() {
    const stage = currentStage();
    const stageInLap = state.stageIndex % 9 + 1;
    $('#headerStage').textContent = state.started && stage ? `${viewMode === 'master' ? 'Режим мастера · ' : ''}${currentLap().name} · этап ${stageInLap} из 9` : (viewMode === 'master' ? 'Режим мастера' : 'Подготовка экипажа');
    $('#lapLabel').textContent = state.started && stage ? `${currentLap().name} · ${stage.trial}` : 'До старта';
    $('#stageTitle').textContent = state.finished ? 'Гонка завершена' : (state.started && stage ? stage.name : 'Золотая колесница ждёт');
    $('#stageNumber').textContent = state.started ? Math.min(STAGES.length, state.stageIndex + 1) : 0;
    $('#sceneType').textContent = stage && state.started ? stage.type : 'ПОДГОТОВКА';
    $('#sceneDc').textContent = stage && state.started && !state.finished ? `СЛ ${effectiveStageDc(viewMode === 'master' ? 'neutral' : 'player', state.phase === 'choice')}` : '';
  }

  function renderTrack() {
    const racers = $('#racers');
    racers.innerHTML = Object.entries(RACERS).map(([id, racer]) => {
      const position = racerPosition(id);
      const left = (distanceOf(id)%90)/90*84;
      const active = state.started && currentStage()?.rivals.includes(id) ? ' active' : '';
      const eliminated = id !== 'player' && state.rivalIntegrity[id] <= 0 ? ' eliminated' : '';
      const integrity = id === 'player' ? state.integrity : state.rivalIntegrity[id];
      return `<div class="racer-row"><div class="racer-token${id === 'player' ? ' player' : ''}${active}${eliminated}" data-racer="${id}" title="${distanceLabel(id)} · ${gapLabel(id)} · Целостность: ${integrity}" style="left:${left}%;--racer-color:${racer.color}"><span class="racer-sigil">${racer.short}</span><b>${racer.name}</b><span class="rank-badge">${eliminated ? '×' : position}</span></div></div>`;
    }).join('');
  }

  function renderPhaseRail() {
    const order = ['control', 'choice', 'support', 'drive', 'resolve', 'rivals', 'summary'];
    const currentIndex = order.indexOf(state.phase);
    $$('#phaseList li').forEach(li => {
      const index = order.indexOf(li.dataset.phase);
      li.classList.toggle('current', state.phase === li.dataset.phase || (state.phase === 'helper' && li.dataset.phase === 'support') || (state.phase === 'qualifying' && li.dataset.phase === 'choice'));
      li.classList.toggle('done', currentIndex > index && currentIndex >= 0);
    });
  }

  function renderKaraPanel() {
    let crewStrip=$('#crewStrip');if(!crewStrip){crewStrip=document.createElement('div');crewStrip.id='crewStrip';$('#abilityList').before?.(crewStrip);}if(crewStrip)crewStrip.innerHTML=crewStatusHtml();
    $('#integrityValue').textContent = state.integrity;
    $('#tempIntegrityValue').textContent = state.tempIntegrity;
    $('#integrityBar').style.width = `${clamp(state.integrity / 30 * 100, 0, 100)}%`;
    $$('[data-bond]').forEach(item => item.classList.toggle('awake', Boolean(state.awakened[item.dataset.bond])));

    $('#abilityList').innerHTML = Object.entries(ABILITIES).map(([id, ability]) => {
      const ready = state.charges[id];
      const spent = id === 'ultimate' && state.ultimateUsed;
      const locked = id === 'ultimate' && !ready && !spent;
      return `<article class="ability-card ${id === 'ultimate' ? 'ultimate' : ''} ${ready ? 'ready' : ''} ${spent ? 'spent' : ''}">
        <div class="ability-top"><b>${ability.name}</b><span class="charge ${ready ? 'ready' : ''}">${spent ? 'ИСПОЛЬЗОВАНА' : ready ? 'ГОТОВА' : locked ? 'ЗАКРЫТА' : 'НЕТ ЗАРЯДА'}</span></div>
        <span>${ability.text} ${cancellationHelp(ABILITY_CANCELS[id])}</span>
      </article>`;
    }).join('');

    const active = state.activeArc;
    $('#activeArc').className = active ? '' : 'empty-state';
    $('#activeArc').innerHTML = active ? `<b>${ARCS[active.id].name}</b><br>${active.text}` : 'Активного усиления нет';
  }

  function renderRivalProfiles() {
    const labels = { str: 'СИЛ', dex: 'ЛОВ', con: 'ТЕЛ', int: 'ИНТ', wis: 'МДР', cha: 'ХАР' };
    $('#rivalProfiles').innerHTML = Object.entries(RIVAL_PROFILES).map(([id, profile]) => {
      const abilityCells = Object.entries(profile.abilities).map(([ability, score]) => {
        const modifier = Math.floor((score - 10) / 2);
        return `<div><span>${labels[ability]}</span><b>${score}</b><small>${signed(modifier)}</small></div>`;
      }).join('');
      const features = profile.features.map(([name, text]) => `<li><b>${name}.</b> ${text}</li>`).join('');
      return `<article class="rival-sheet" style="--rival-color:${RACERS[id].color}">
        <header><div><span class="overline">${profile.title}</span><h3>${profile.name}</h3><p>${profile.archetype} · бонус мастерства +${profile.proficiency}</p></div><span class="sheet-sigil">${RACERS[id].short}</span></header>
        <div class="sheet-summary">
          <span>КД <b>${profile.racer.ac}</b></span><span>Хиты <b>${state.npcHp?.[id]??profile.racer.hp} / ${profile.racer.hp}</b></span><span>Пилот <b>${state.npcHp[id]??profile.racer.hp}/${profile.racer.hp} ОЗ</b></span><span>Управление <b>+${profile.control}</b></span><span>Сл приёмов <b>${profile.saveDc}</b></span>
        </div>
        <div class="ability-scores">${abilityCells}</div>
        <p><b>Спасброски:</b> ${profile.saves}</p><p><b>Навыки:</b> ${profile.skills}</p>
        <div class="chariot-line"><b>${profile.chariot.name}</b><span>${profile.chariot.mount}</span><small>КД ${profile.chariot.ac} · Целостность ${state.rivalIntegrity[id]} / ${profile.chariot.integrity}</small></div>
        <div class="resource-line"><b>Ресурс:</b> ${profile.resource}<br><b>Сейчас:</b> ${resourceStatus(id)} · заряды ${rivalChargeSummary(id)}</div>
        <ul class="feature-list">${features}</ul>
        <div class="arc-ability-list">${Object.entries(RIVAL_ARC_ABILITIES[id]).map(([arc, ability]) => `<span><b>${ARCS[arc].sigil} · ${ability[0]}</b>${ability[1]}</span>`).join('')}</div>
      </article>`;
    }).join('');
  }

  function renderLog() {
    $('#eventLog').innerHTML = state.log.map((entry, index) => `<div class="log-entry"><time>${index === 0 ? 'Сейчас' : `−${index}`}</time><div><strong>${escapeHtml(entry.label)}.</strong> ${escapeHtml(entry.text)}</div></div>`).join('');
  }

  function renderSetup() {
    ensureCrew();const roster=crewRoster();
    playArea.innerHTML=`<span class="overline">Золотая колесница · два места</span><h2 class="scene-title">Кто поедет с Карой?</h2><p class="scene-copy">Водитель управляет и таранит. Второе место необязательно: помощник получает отдельное действие перед Управлением. Каждый бросает по своему листу персонажа.</p>
    <div class="crew-seats">${['driver','helper'].map(role=>`<label class="field">${role==='driver'?'Водитель · у вожжей':'Помощник · второе место'}<select id="crew-${role}">${role==='helper'?'<option value="">Пустое место</option>':''}${roster.filter(a=>role==='driver'||a.id!==state.crew.driver).map(a=>`<option value="${escapeHtml(a.id)}" ${state.crew[role]===a.id?'selected':''}>${escapeHtml(a.name)} · ур. ${a.level}</option>`).join('')}</select></label>`).join('')}</div>
    ${crewStatusHtml()}<div class="crew-import"><label class="secondary-button">Добавить чарник Foundry<input type="file" id="crewImport" accept=".json,application/json" hidden></label>${crewMembers().map(r=>`<label class="secondary-button">Портрет: ${escapeHtml(r.actor.name)}<input type="file" data-portrait="${r.actor.id}" accept="image/png,image/jpeg,image/webp" hidden></label>`).join('')}</div>
    <details class="crew-checks"><summary>Проверки из чарника и происхождение бонусов</summary>${crewMembers().map(r=>`<h3>${escapeHtml(r.actor.name)}</h3><p>Бонус мастерства +${r.actor.prof}. КД ${r.actor.ac}; ОЗ ${r.actor.hp}/${r.actor.hpMax}.</p>${['drive','scout','calm','brace','repair','guard'].map(key=>`<p><b>${key==='drive'?'Управление':SUPPORT_ACTIONS[key].name}</b>: ${window.SapphireCrew.options(r.actor,key).map(c=>`${c.label} ${signed(c.bonus)}`).join(' / ')}</p>`).join('')}${r.actor.warnings.map(w=>`<p class="rule-alert">${escapeHtml(w)}</p>`).join('')}<p>${r.actor.portrait?'Портрет загружен.':'В экспорте только путь к портрету Foundry; загрузите изображение кнопкой выше.'}</p>`).join('')}</details>
    <label class="field">Урон опасных участков<select id="crewDamageRule"><option value="0.33" ${(state.crewDamageShare??.33)>0?'selected':''}>⅔ колеснице, ⅓ экипажу</option><option value="0" ${state.crewDamageShare===0?'selected':''}>Весь урон колеснице; экипажу вручную</option></select></label><p class="scene-copy">Правило гонки: обломки, волна, молния, жар, переворот и пике могут ранить экипаж. Доля делится между пассажирами. ОЗ персонажей и Целостность учитываются отдельно.</p>
    <div class="section-label"><h3>Кости</h3></div><div class="pace-grid"><button data-roll-mode="auto" class="pace-card ${state.rollMode==='auto'?'selected':''}">Бросать на сайте</button><button data-roll-mode="manual" class="pace-card ${state.rollMode==='manual'?'selected':''}">Физический к20</button></div><div class="action-bar"><button id="beginButton" class="primary-button">Перейти к старту</button></div>`;
    for(const role of ['driver','helper'])$('#crew-'+role).addEventListener('change',e=>{state.crew[role]=e.target.value||null;if(state.crew.helper===state.crew.driver)state.crew.helper=null;ensureCrew();saveState();renderSetup();});
    $('#crewDamageRule').addEventListener('change',e=>{state.crewDamageShare=Number(e.target.value);saveState();});
    $$('[data-roll-mode]').forEach(b=>b.addEventListener('click',()=>{state.rollMode=b.dataset.rollMode;saveState();renderSetup();}));
    $('#crewImport').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>4000000)throw Error('Чарник слишком большой (максимум 4 МБ).');const actor=window.SapphireCrew.normalize(JSON.parse(await file.text()));saveRosterActor(actor);ensureCrew();saveState();renderSetup();toast('Добавлен '+actor.name);}catch(err){toast(err.message);}});
    $$('[data-portrait]').forEach(input=>input.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2000000||!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Выберите PNG, JPEG или WebP до 2 МБ.');const reader=new FileReader();reader.onload=()=>{try{const actor=crewRoster().find(a=>a.id===input.dataset.portrait);actor.portrait=reader.result;saveRosterActor(actor);saveState();renderSetup();}catch(err){toast(err.message);}};reader.readAsDataURL(file);}catch(err){toast(err.message);}}));
    $('#beginButton').addEventListener('click',()=>{if(!crewActor('driver'))return;if(crewHp('driver')<=0){toast('У водителя 0 ОЗ. Выберите другого персонажа.');return;}state.started=true;addLog('Экипаж',`${crewActor('driver').name} у вожжей${crewActor('helper')?' · помощник '+crewActor('helper').name:''}. Кара готова к старту.`);setPhase('qualifying');});
  }

  function numberField(id, label, value) {
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="number" min="-5" max="15" value="${value}" inputmode="numeric"></div>`;
  }

  function renderQualification(){
    playArea.innerHTML=`<span class="overline">Общий старт</span><h2 class="scene-title">Все экипажи на одной линии</h2><p class="scene-copy">У каждого 0 позиций пути. Между арками — 10 позиций, полный круг — 90. Обычный проход двигает на 10; бонусы и штрафы прибавляются к дистанции. Место определяется пройденным путём, равная дистанция означает равенство.</p><button class="primary-button" id="equalStart">Дать общий старт</button>`;
    $('#equalStart').addEventListener('click',()=>{state.distance=Object.fromEntries(Object.keys(RACERS).map(id=>[id,0]));state.distanceStage=-1;state.lastCueDistances={...state.distance};sortStandings();state.stageIndex=0;addLog('Старт','Все шесть экипажей стартуют одновременно: 0/90 позиций.');beginLapControl();});
  }

  function beginLapControl() {
    const lap = currentStage().lap;
    state.lapControl = { lap, status: null, successes: 0, failures: 0, usedSkills: [] };
    state.phase = 'control';
    saveState();
    render();
  }

  function renderControlRoom() {
    const lap = currentLap();
    const control = state.lapControl;
    const skills = [
      ['arcana', 'Магия'], ['investigation', 'Расследование'], ['thieves', 'Инструменты вора'], ['athletics', 'Физическое вмешательство']
    ];
    playArea.innerHTML = `
      <span class="overline">Перед ${lap.name.toLowerCase()}</span>
      <h2 class="scene-title">Комната управления ареной</h2>
      <p class="scene-copy">Получите два успеха раньше двух провалов. Каждый навык можно использовать один раз. Победа уменьшит Сл всех препятствий заезда на 2 и отключит саботаж.</p>
      <div class="result-grid">
        <div class="result-hero"><span class="overline">Успехи</span><div class="result-score"><b>${control.successes}</b><span>/ 2</span></div></div>
        <div class="result-hero"><span class="overline">Провалы</span><div class="result-score"><b>${control.failures}</b><span>/ 2</span></div></div>
        <div class="result-hero"><span class="overline">Сложность</span><div class="result-score"><b>${lap.controlDc}</b><span>Сл</span></div></div>
      </div>
      <div class="section-label"><h3>Выберите подход</h3><span>Бонус навыков ${signed(state.supportBonus)}</span></div>
      <div class="choice-grid">
        ${skills.map(([id, name]) => `<button class="choice-card" data-control-skill="${id}" ${control.usedSkills.includes(id) ? 'disabled' : ''}><b>${name}</b><span>${control.usedSkills.includes(id) ? 'Уже использовано' : 'Совершить проверку'}</span></button>`).join('')}
      </div>
      <div class="action-bar"><button class="secondary-button" id="skipControl">Никого нет под ареной</button></div>
      <div id="controlRollSlot"></div>`;

    $$('[data-control-skill]').forEach(button => button.addEventListener('click', () => {
      const skill = button.dataset.controlSkill;
      const check=crewCheck('driver',skill);const bonus=check.bonus;const slot = $('#controlRollSlot');
      slot.innerHTML = rollWidget({ id: 'controlCheck', label: button.querySelector('b').textContent, formula: `${check.label}: к20 ${signed(bonus)}`, dc: lap.controlDc, bonus });
      bindRollWidget('controlCheck', bonus, result => {
        control.usedSkills.push(skill);
        if (result.total >= lap.controlDc) control.successes += 1; else control.failures += 1;
        addLog('Под ареной', `${button.querySelector('b').textContent}: ${result.total} против Сл ${lap.controlDc} — ${result.total >= lap.controlDc ? 'успех' : 'провал'}.`);
        if (control.successes >= 2 || control.failures >= 2) {
          control.status = control.successes >= 2 ? 'success' : 'failure';
          if (control.status === 'failure') state.sabotageTokens += 1;
          addLog('Механизмы', control.status === 'success' ? 'Ловушки заезда ослаблены.' : 'Саботаж остаётся активным.');
          toast(control.status === 'success' ? 'Ловушки заезда ослаблены' : 'Саботаж остаётся активным');
          setTimeout(() => setPhase('choice'), 450);
        } else {
          saveState();
          renderControlRoom();
        }
      });
    }));
    $('#skipControl').addEventListener('click', () => {
      control.status = 'failure';
      control.failures = 2;
      state.sabotageTokens += 1;
      addLog('Под ареной', 'Никто не вмешался в работу механизмов. Саботаж активен.');
      setPhase('choice');
    });
  }

  function renderChoice() {
    ensureRuleState();
    if (state.skipStages.player === state.stageIndex) { beginPlayerTurn(); return; }
    const stage = currentStage();
    if (!state.selection.arc || !stage.arcs.includes(state.selection.arc)) state.selection.arc = stage.arcs[0];
    if (state.karaPanic || (sabotageActive() && state.stageIndex === 6)) { state.karaPanic = true; state.selection.support = 'calm'; }
    const availableAbilities = Object.entries(state.charges).filter(([, ready]) => ready).map(([id]) => id);
    playArea.innerHTML = `
      ${crewStatusHtml()}<span class="overline">Ваш ход</span>
      <h2 class="scene-title">${stage.name}</h2>
      <p class="scene-copy">${stage.text}</p>
      <div class="stage-tags">${stageTagsHtml()}</div>
      ${cancellationNote(true)}
      ${state.karaPanic ? '<p class="rule-alert">Кара в панике: доступно только «Успокоить Кару».</p>' : ''}
      <div class="section-label"><h3>1. Выберите темп</h3><span>Позиция ${playerPosition()} · Целостность ${state.integrity}</span></div>
      <div class="pace-grid">${Object.entries(PACE).map(([id, pace]) => choiceButton('pace', id, pace.name, pace.text, state.selection.pace === id)).join('')}</div>

      <div class="section-label"><h3>2. Действие экипажа</h3><span>Выполняется до Управления</span></div>
      <div class="choice-grid">${Object.entries(SUPPORT_ACTIONS).map(([id, action]) => choiceButton('support', id, action.name, `${action.text} ${cancellationHelp(SUPPORT_CANCELS[id])}`, state.selection.support === id, action.formula)).join('')}</div>

      ${helperChoiceHtml()}
      <div class="section-label"><h3>3. Выберите маршрут к арке</h3><span>Награду получит первый на каждом из двух маршрутов</span></div>
      <div class="arc-grid">${stage.arcs.map(id => arcChoice(id)).join('')}</div>

      <div class="section-label"><h3>4. Способность Кары</h3><span>Необязательно · один заряд за применение</span></div>
      <div class="choice-grid">
        <button class="choice-card ${state.selection.ability === null ? 'selected' : ''}" data-ability="none"><b>Не использовать</b><span>Сохранить заряд для следующего препятствия.</span></button>
        ${availableAbilities.length ? availableAbilities.map(id => `<button class="choice-card ${state.selection.ability === id ? 'selected' : ''}" data-ability="${id}"><b>${ABILITIES[id].name}</b><span>${ABILITIES[id].text} ${cancellationHelp(ABILITY_CANCELS[id])}</span><div class="card-meta"><span class="mini-tag">${ABILITIES[id].timing}</span></div></button>`).join('') : '<div class="choice-card" aria-disabled="true"><b>Нет зарядов</b><span>Направьте энергию арки в Кару, чтобы открыть способности.</span></div>'}
      </div>

      ${roadLanePicker('player')}
      <div class="action-bar"><button class="primary-button" id="confirmChoice">Подтвердить действия</button></div>`;

    if (state.karaPanic) $$('[data-choice="support"]').forEach(button => { button.disabled = button.dataset.value !== 'calm'; });
    $$('[data-choice]').forEach(button => button.addEventListener('click', () => {
      state.selection[button.dataset.choice] = button.dataset.value;
      saveState(); renderChoice();
    }));
    $$('[data-arc]').forEach(button => button.addEventListener('click', event => {
      const modeButton = event.target.closest('[data-arc-mode]');
      state.selection.arc = button.dataset.arc;
      rememberTrackLane('player',state.selection.arc);
      if (modeButton) state.selection.arcMode = modeButton.dataset.arcMode;
      saveState(); renderChoice();
    }));
    $$('[data-ability]').forEach(button => button.addEventListener('click', () => {
      const value = button.dataset.ability;
      state.selection.ability = value === 'none' ? null : value;
      saveState(); renderChoice();
    }));
    bindHelperChoice();bindRoadLanePicker();
    $('#confirmChoice').addEventListener('click', beginPlayerTurn);
  }

  function choiceButton(group, id, name, text, selected, meta = '') {
    return `<button class="choice-card ${selected ? 'selected' : ''}" data-choice="${group}" data-value="${id}"><b>${name}</b><span>${text}</span>${meta ? `<div class="card-meta"><span class="mini-tag">${meta}</span></div>` : ''}</button>`;
  }

  function arcChoice(id) {
    const arc = ARCS[id];
    const selected = state.selection.arc === id;
    return `<article class="arc-card ${selected ? 'selected' : ''}" data-arc="${id}">
      <b>${arc.name}</b><small>${currentStage().arcs.indexOf(id)===0?'Внутренняя · полосы 1–3':'Внешняя · полосы 4–6'}</small><span>${state.selection.arcMode === 'kara' && selected ? arc.kara : arc.chariot}</span>
      <div class="mode-switch">
        <button class="${state.selection.arcMode === 'chariot' && selected ? 'active' : ''}" data-arc-mode="chariot">В колесницу</button>
        <button class="${state.selection.arcMode === 'kara' && selected ? 'active' : ''}" data-arc-mode="kara">В Кару</button>
      </div>
    </article>`;
  }

  function beginPlayerTurn() {
    rememberTrackLane('player',state.selection.arc);
    ensureRuleState();
    state.cancelledTags = { stage: state.stageIndex, tags: selectionCancelledTags() };
    state.stageFailures = []; state.collisionChecksStage = -1;
    if (state.karaPanic) state.selection.support = 'calm';
    state.stageSnapshot = { distance: distanceOf('player'), distances: {...state.distance}, position: playerPosition(), integrity: state.integrity, tempIntegrity: state.tempIntegrity, standings: [...state.standings] };
    state.rivalTurnDone = false;
    state.rivalTurnResults = [];
    state.masterTurnStage = -1;
    state.masterTurnOrder = [];
    state.masterTurnIndex = 0;
    state.masterAction = null;
    state.masterLastResult = null;
    state.stageRolls = {};
    state.rivalRoutes = {};
    state.rivalArcModes = {};
    state.routeEligible = { player: false };
    state.arcClaims = [];
    state.helperDone=false;state.helperShots=0;state.crewProtected=false;
    state.lastSupport = null;
    state.lastControl = null;
    state.supportControlBonus = 0;
    state.controlAdvantage = false;
    state.damageReduction = 0;
    state.ejectionGuard = false;
    state.selectedAbilityApplied = false;

    if (state.skipStages.player === state.stageIndex) {
      advanceField();sceneCue('player','hit','Пропуск хода',{success:false});
      delete state.skipStages.player; state.routeEligible.player = false;
      state.cancelledTags = { stage: state.stageIndex, tags: [] };
      state.lastControl = {raw: null, total: null, dc: currentStage().dc, success: false, gain: 0, damage: 0, verdict: 'Ход пропущен после неудачного ремонта инструментами кузнеца.', skipped: true};
      addLog('Экипаж', state.lastControl.verdict); setPhase('resolve'); return;
    }
    if (cancelledTags().length) addLog('Теги', `${cancelledTags().map(t => TAG_LABELS[t]).join(', ')}: −${cancelledTags().length * 2} к Сл Управления.`);
    if (sabotageActive() && state.stageIndex === 6) state.karaPanic = true;
    const ability = state.selection.ability;
    if (ability && !state.charges[ability]) state.selection.ability = null;
    if (ability && state.charges[ability]) {
      state.charges[ability] = false;
      state.selectedAbilityApplied = true;
      if (ability === 'light') {
        state.tempIntegrity = Math.max(state.tempIntegrity, 12);
        state.ejectionGuard = true;
        state.lightProtection = true; state.karaPanic = false;
      }
      if (ability === 'ultimate') state.ultimateUsed = true;
      if (ability !== 'ultimate') state.awakened[ability] = true;
      updateUltimateReadiness();
      addLog('Кара', `Готовит способность «${ABILITIES[ability].name}».`);
      if (ability === 'light' || ability === 'speed') sceneCue('player', ability, ABILITIES[ability].name, { success: true });
    }

    state.helperDone=false;setPhase(crewActor('helper')&&state.helperAction!=='none'?'helper':'support');
  }

  function renderSupportRoll() {
    const action = SUPPORT_ACTIONS[state.selection.support];
    const attackTarget = state.selection.support === 'ram' ? nearestActiveRival() : null;
    const dc = state.selection.support === 'ram' && attackTarget ? controlResultFor(attackTarget) : attackTarget ? RIVAL_PROFILES[attackTarget].chariot.ac : (action.dc === 'stage' || state.selection.support === 'ram' ? effectiveStageDc('neutral') : action.dc);
    const check=crewCheck('driver',state.selection.support);const bonus=check.bonus;
    playArea.innerHTML = `
      <span class="overline">Действие экипажа</span>
      <h2 class="scene-title">${action.name}</h2>
      <p class="scene-copy">${action.text}${attackTarget ? ` Цель: ${RIVAL_PROFILES[attackTarget].chariot.name}, встречное Управление ${dc}. При равенстве цель удерживает линию.` : ''}</p>
      ${crewStatusHtml()}${checkPickerHtml('driver',state.selection.support)}
      ${rollWidget({ id: 'supportRoll', label: action.name, formula: `${check.label}: к20 ${signed(bonus)}`, dc, bonus })}`;
    bindCheckPicker('driver',state.selection.support,renderSupportRoll);bindRollWidget('supportRoll', bonus, result => resolveSupport(result, dc));
  }

  function resolveSupport(result, dc) {
    const before = [...state.standings], visualTarget = nearestActiveRival();
    const action = state.selection.support;
    const success = action === 'ram' && nearestActiveRival() ? result.total > dc : result.total >= dc;
    let text = success ? 'Действие выполнено.' : 'Действие не удалось.';
    if (action === 'scout' && success) {
      if (result.total >= dc + 5) { state.controlAdvantage = true; text = 'Маршрут прочитан: преимущество на Управление.'; }
      else { const bonus = rollDie(4); state.supportControlBonus += bonus; text = `Найден проход: +${bonus} к Управлению.`; }
    }
    if(action==='guard'&&success){state.damageReduction+=rollDie(6);state.ejectionGuard=true;state.crewProtected=true;text='Руны активированы: следующий удар по экипажу поглощается, выброс предотвращён.';}
    if (action === 'calm' && success) { state.karaPanic = false; state.supportControlBonus += 2; state.nextDisadvantage = false; text = 'Кара слышит голос экипажа: +2 к Управлению.'; }
    if (action === 'brace' && success) { state.damageReduction = rollDie(6) + 3; state.ejectionGuard = true; text = `Корпус удержан: следующий урон меньше на ${state.damageReduction}.`; }
    if (action === 'repair' && success) {
      const healing = result.total >= 20 ? rollDice(2, 6) + 3 : rollDie(6) + 3;
      const before = state.integrity;
      state.integrity = clamp(state.integrity + healing, 0, 30);
      text = `Восстановлено ${state.integrity - before} Целостности.`;
    }
    if (action === 'repair' && result.raw === 1) {
      const damage = rollDie(4); if(damage>0)crowdCue('disappointed','player');
    state.integrity = Math.max(0, state.integrity - damage); text = `Инструмент срывается: колесница теряет ${damage} Целостности.`;
    }
    if (action === 'ram') {
      const target = nearestActiveRival();
      if (result.raw === 1) {
        const selfDamage = rollDie(6); applyDamage(selfDamage); text = `Кара срывает таран: золотая колесница получает ${selfDamage} урона.`;
      } else if (success && target) {
        let damage = id==='aegon'?rollDie(8)+3:id==='pello'?rollDie(4)+3:rollDie(6)+3;
      if(id==='saira')damage=damage-3+(roll.heatSpent||0)*3;
      
        if (state.swordBoost) { damage += rollDie(8) + 3; state.swordBoost = false; clearActiveArc('sword'); }
        const applied = applyDamageToRival(target, damage, { sourceId: 'player', attackTotal: result.total });
        const passed = applyRamSwap('player', target); markRacerHit(target);
        text = `Кара выигрывает состязание и наносит ${applied.damage} урона${passed ? `, выходя перед ${RACERS[target].name}` : ', но Щит цели удерживает позицию'}. ${applied.text}`;
      } else text = target ? `${RACERS[target].name} удерживает линию; ничья остаётся за защищающимся.` : success ? 'Колесница пробивает препятствие на трассе. Обгон и урон сопернику не применяются.' : 'Преграда выдерживает удар.';
    }
    sceneCue('player', action, SUPPORT_ACTIONS[action].name, { before, target: action === 'ram' ? visualTarget : null, success: success && result.raw !== 1 });
    state.lastSupport = { action, success, total: result.total, text };
    addLog('Экипаж', `${SUPPORT_ACTIONS[action].name}: ${result.total} против Сл ${dc}. ${text}`);
    setPhase('drive');
  }

  function renderDriveRoll() {
    ensureCrew();state.controlBonus=crewCheck('driver','drive').bonus;
    const stage = currentStage();
    const ability = state.selection.ability;
    const pace = PACE[state.selection.pace];
    const sabotagePenalty = sabotageActive() && state.stageIndex === 2 ? -2 : sabotageActive() && state.stageIndex === 8 ? -3 : 0;
    const raceMods = pace.mod + integrityPenalty() + state.supportControlBonus + state.nextControlBonus + (state.delayedControl.player?.stage === state.stageIndex ? state.delayedControl.player.value : 0) + sabotagePenalty + (ability === 'speed' ? 5 : 0);
    const advantage = state.controlAdvantage || state.nextAdvantage;
    const disadvantage = state.nextDisadvantage || tagActive('visibility') || (sabotageActive() && stage.sabotage.includes('помеха'));
    const netAdvantage = advantage && !disadvantage;
    const netDisadvantage = disadvantage && !advantage;
    const automatic = ability === 'flight' || ability === 'ultimate';
    const notes = [
      `${pace.name}: ${signed(pace.mod)}`,
      integrityPenalty() ? `Повреждения: ${signed(integrityPenalty())}` : null,
      state.supportControlBonus ? `Экипаж: ${signed(state.supportControlBonus)}` : null,
      state.nextControlBonus ? `Арка: ${signed(state.nextControlBonus)}` : null,
      ability === 'speed' ? 'Кара: +5' : null,
      state.delayedControl.player?.stage === state.stageIndex ? 'Предыдущий участок: −5' : null,
      sabotagePenalty ? `Саботаж: ${signed(sabotagePenalty)}` : null,
      netAdvantage ? 'Преимущество' : null,
      netDisadvantage ? 'Помеха' : null
    ].filter(Boolean);

    playArea.innerHTML = `
      ${crewStatusHtml()}<span class="overline">Главный бросок · ${escapeHtml(crewActor('driver')?.name||'Водитель')}</span>
      <h2 class="scene-title">Проведите колесницу через препятствие</h2>
      <p class="scene-copy">Проверка Управления против Сл ${effectiveStageDc()}. ${stage.failure}</p>
      ${cancellationNote()}
      <div class="card-meta">${notes.map(note => `<span class="mini-tag">${note}</span>`).join('')}</div>
      ${automatic ? `<div class="result-hero success"><span class="overline">Способность Кары</span><div class="result-score"><b>УСПЕХ</b></div><p>${ABILITIES[ability].text}</p></div><div class="action-bar"><button class="primary-button" id="applyAutomatic">Применить способность</button></div>` : rollWidget({ id: 'driveRoll', label: 'Управление колесницей', formula: `${crewCheck('driver','drive').label}: к20 ${signed(state.controlBonus)} ${signed(raceMods)}`, dc: effectiveStageDc(), bonus: state.controlBonus + raceMods, advantage: netAdvantage, disadvantage: netDisadvantage })}`;

    if (automatic) $('#applyAutomatic').addEventListener('click', () => resolveDrive({ raw: ability === 'ultimate' ? 20 : 15, total: ability === 'ultimate' ? 99 : effectiveStageDc(), automatic: true }));
    else bindRollWidget('driveRoll', state.controlBonus + raceMods, result => resolveDrive(result), { advantage: netAdvantage, disadvantage: netDisadvantage });
  }

  function resolveDrive(result) {
    const before = [...state.standings], beforeDistances={...state.distance};
    advanceField();
    const stage = currentStage();
    const dc = effectiveStageDc();
    const ability = state.selection.ability;
    let gain = 0;
    let damage = 0;
    let verdict = '';
    let success = result.total >= dc;

    if (ability === 'flight' && result.automatic) {
      success = true; gain = 0; verdict = 'Кара перелетает препятствие. Позиция сохранена, последствия отменены.';
    } else if (ability === 'ultimate' && result.automatic) {
      success = true; gain = 2; verdict = 'Кара повторяет последний полёт Дюрана и прорывается вперёд.';
      applyUltimateShockwave();
    } else if (result.raw === 20) {
      gain = 2; verdict = 'Критический проход. Колесница режет траекторию и вырывается вперёд.';
    } else if (result.raw === 1) {
      success = false; gain = -2; damage = rollDice(3, 6); verdict = 'Критический провал. Корпус принимает удар целиком.';
    } else if (result.total >= dc + 5) {
      gain = 1; verdict = 'Чистый проход с запасом скорости.';
    } else if (result.total >= dc) {
      gain = 0; verdict = 'Препятствие пройдено. Позиция сохранена.';
    } else if (result.total >= dc - 4) {
      gain = -1; damage = rollStageDamage(stage); verdict = stage.failure;
    } else {
      gain = -2; damage = rollStageDamage(stage) + rollDie(6); verdict = `${stage.failure} Ошибка оказывается тяжёлой.`;
    }

    if (success && state.selection.pace === 'limit' && ability !== 'flight') gain += 1;
    if (success && ability === 'speed') gain += 1;
    if (state.selection.pace === 'careful' && gain > 0) gain = 0;
    if (!success && state.selection.pace === 'limit') damage += rollDie(6);
    if (state.selection.pace === 'careful' && damage > 0) damage = Math.max(0, damage - rollDie(6));

    if (!success && stage.lap === 0) {
      gain = groundFailureGain(state.stageIndex);
      applyGroundFailure('player');
    }
    gain = clamp(gain, -3, 2);
    if (gain !== 0) moveRacer('player', gain);
    if (damage > 0) applyDamage(damage,{crew:currentStage().tags.some(t=>['debris','impact','lightning','heat','inversion','dive'].includes(t))});

    commitRoadLane('player',success);state.routeEligible.player = success;
    if (success) addLog('Маршрут', `Кара входит в поток «${ARCS[state.selection.arc].name}». Победитель маршрута определится после ходов соперников.`);
    else addLog('Арка', 'Траектория сорвана: Кара не участвует в споре за выбранную арку на этом этапе.');

    if (ability === 'flight' || ability === 'ultimate') sceneCue('player', ability, ABILITIES[ability].name, { before, beforeDistances, success });
    else if (!success) sceneCue('player', 'hit', 'Удар препятствия', { before, beforeDistances, success: false });
    else sceneCue('player', gain > 0 ? 'overtake' : 'drive', gain > 0 ? 'Обгон' : 'Управление колесницей', { before, beforeDistances, success });
    state.lastControl = { raw: result.raw, total: result.total, dc, success, gain, damage, verdict };
    if (state.delayedControl.player?.stage <= state.stageIndex) delete state.delayedControl.player;
    state.nextControlBonus = 0;
    state.nextAdvantage = false;
    state.nextDisadvantage = false;
    addLog('Возница', `${result.total} против Сл ${dc}. ${verdict}${gain ? ` Изменение позиции: ${gain > 0 ? '+' : ''}${gain}.` : ''}${damage ? ` Урон: ${damage}.` : ''}`);
    if (sabotageActive() && state.stageIndex === 3 && !state.ejectionGuard && !state.lightProtection && !result.automatic) state.pendingRuleChecks.push({type:'ejection',racer:'player',dc:10});
    setPhase('resolve');
  }

  function rollStageDamage(stage) {
    const [count, sides, flat = 0] = stage.damage;
    let damage = rollDice(count, sides) + flat;
    if (sabotageActive() && stage.sabotage.includes('ещё 1к6')) damage += rollDie(6);
    if (stage.lap !== 0 && state.sabotageTokens > 0) {
      damage += rollDie(6);
      state.sabotageTokens -= 1;
      addLog('Саботаж', 'Жетон саботажа усиливает повреждение на 1к6.');
    }
    return damage;
  }

  function applyDamage(incoming,{crew=false}={}) {
    let damage = incoming;
    if(crew&&state.crew?.driver){const riders=crewMembers(),part=Math.floor(damage*(state.crewDamageShare??.33));damage-=part;if(state.crewProtected){state.crewProtected=false;addLog('Руны','Урон экипажу поглощён.');}else riders.forEach((r,i)=>damageCrew(r.role,Math.floor(part/riders.length)+(i<part%riders.length?1:0),'bludgeoning'));}

    if (state.damageReduction > 0) {
      const reduced = Math.min(damage, state.damageReduction);
      damage -= reduced;
      addLog('Защита', `Экипаж поглощает ${reduced} урона.`);
      state.damageReduction = 0;
    }
    if (state.tempIntegrity > 0 && damage > 0) {
      const blocked = Math.min(damage, state.tempIntegrity);
      state.tempIntegrity -= blocked;
      damage -= blocked;
      addLog('Сияние', `Временная защита поглощает ${blocked} урона.`);
    }
    if(damage>0)crowdCue('disappointed','player');
    state.integrity = Math.max(0, state.integrity - damage);
    if (state.integrity === 0) {
      state.eliminated = true;
      addLog('Крушение', 'Защитные печати арены подхватывают экипаж. Гонка для золотой колесницы окончена.');
    }
  }

  function awardArcToPlayer(id, mode) {
    const arc = ARCS[id];
    if (mode === 'kara') {
      if (id === 'sword') {
        state.battleMark = true;
        updateUltimateReadiness();
        addLog('Арка Меча', state.charges.ultimate ? 'Боевой знак завершает резонанс. Ультимативная способность готова.' : 'Кара принимает Боевой знак. Нужны три пробуждённых аспекта.');
      } else {
        state.charges[arc.ability] = true;
        addLog(arc.name, `Заряжена способность «${ABILITIES[arc.ability].name}».`);
      }
      sceneCue('player',`arc_${id}`,arc.name,{success:true});return;
    }

    clearActiveArc();
    if (id === 'shield') {
      state.tempIntegrity = Math.max(state.tempIntegrity, 10);
      state.shieldPositionGuard = true;
    }
    if (id === 'star') {
      moveRacer('player', 1);
      state.nextControlBonus = 5;
    }
    if (id === 'wing') state.nextAdvantage = true;
    if (id === 'sword') state.swordBoost = true;
    state.activeArc = { id, acquiredStage: state.stageIndex, text: arc.chariot };
    addLog(arc.name, arc.chariot);sceneCue('player',`arc_${id}`,arc.name,{success:true});
  }

  function awardArcToRival(racerId, arcId, mode) {
    const profile = RIVAL_PROFILES[racerId];
    if (mode === 'racer') {
      state.rivalCharges[racerId][arcId] = true;
      const ability = RIVAL_ARC_ABILITIES[racerId][arcId][0];
      addLog(ARCS[arcId].name, `${profile.name} заряжает приём «${ability}».`);sceneCue(racerId,`arc_${arcId}`,ARCS[arcId].name,{success:true});
      return;
    }
    const effect = state.rivalArcEffects[racerId];
    if (arcId === 'shield') { effect.tempIntegrity += 10; effect.positionGuard = true; }
    if (arcId === 'sword') effect.attackBonus = true;
    if (arcId === 'star') { moveRacer(racerId, 1); effect.controlBonus = Math.max(effect.controlBonus, 5); }
    if (arcId === 'wing') effect.advantage = true;
    addLog(ARCS[arcId].name, `${profile.chariot.name} получает усиление: ${ARCS[arcId].chariot}`);sceneCue(racerId,`arc_${arcId}`,ARCS[arcId].name,{success:true});
  }

  function resolveArcClaims() {
    const standingsSnapshot = [...state.standings];
    const claims = currentStage().arcs.map(arcId => {
      const entrants = [];
      if (!state.eliminated && state.routeEligible.player && state.selection.arc === arcId) entrants.push({ id: 'player', mode: state.selection.arcMode });
      Object.keys(RIVAL_PROFILES).forEach(id => {
        if (state.rivalIntegrity[id] > 0 && state.routeEligible[id] !== false && state.rivalRoutes[id] === arcId) {
          entrants.push({ id, mode: state.rivalArcModes[id] || 'chariot' });
        }
      });
      entrants.sort((a,b)=>distanceOf(b.id)-distanceOf(a.id)||controlResultFor(b.id)-controlResultFor(a.id));
      const tied=entrants.length>1&&distanceOf(entrants[0].id)===distanceOf(entrants[1].id)&&controlResultFor(entrants[0].id)===controlResultFor(entrants[1].id);
      return {arcId,winner:tied?null:entrants[0]||null,tied,entrants:entrants.map(entry=>entry.id)};
    });

    state.arcClaims = claims;
    claims.forEach(claim => {
      if (!claim.winner) {
        addLog(ARCS[claim.arcId].name,claim.tied?'Дистанция и Управление равны. Арка гаснет без единственного победителя.':'Ни один экипаж не удержал этот маршрут. Арка гаснет без хозяина.');
      } else if (claim.winner.id === 'player') {
        awardArcToPlayer(claim.arcId, claim.winner.mode);
      } else {
        awardArcToRival(claim.winner.id, claim.arcId, claim.winner.mode);
      }
    });
    return claims;
  }

  function clearActiveArc(onlyId = null) {
    if (onlyId && state.activeArc?.id !== onlyId) return;
    if (state.activeArc?.id === 'shield') { state.tempIntegrity = 0; state.shieldPositionGuard = false; }
    if (state.activeArc?.id === 'star') state.nextControlBonus = 0;
    if (state.activeArc?.id === 'wing') state.nextAdvantage = false;
    if (state.activeArc?.id === 'sword') state.swordBoost = false;
    state.activeArc = null;
  }

  function applyUltimateShockwave() {
    const playerDistance = distanceOf('player');
    Object.keys(RACERS).filter(id => id !== 'player' && Math.abs(distanceOf(id) - playerDistance) <= 1).forEach(id => {
      const damage = rollDice(2, 6);
      damageRival(id, damage);
      moveRacer(id, -1);
      addLog('Последний полёт', `${RACERS[id].name} теряет позицию и ${damage} Целостности.`);
    });
  }

  function renderPlayerResult() {
    const result = state.lastControl;
    if (state.eliminated) {
      state.finished = true;
      state.phase = 'finish';
      saveState(); renderFinish(); return;
    }
    playArea.innerHTML = `
      <span class="overline">Итог хода игрока</span>
      <h2 class="scene-title">${result.skipped ? 'Ход пропущен' : result.success ? 'Препятствие пройдено' : 'Колесница принимает удар'}</h2>
      <div class="result-hero ${result.success ? 'success' : 'failure'}">
        <div class="result-score"><b>${result.total}</b><span>против Сл ${result.dc}</span></div>
        <p>${result.verdict}</p>
      </div>
      <div class="result-grid">
        <div class="result-hero"><span class="overline">Дистанция · ${playerPosition()} место</span><div class="result-score"><b>${distanceOf('player')} поз.</b><span>${result.gain ? `${result.gain > 0 ? '+' : ''}${result.gain}` : 'без изменений'}</span></div></div>
        <div class="result-hero"><span class="overline">Целостность</span><div class="result-score"><b>${state.integrity}</b><span>${result.damage ? `−${result.damage}` : 'без урона'}</span></div></div>
        <div class="result-hero"><span class="overline">Маршрут</span><div class="result-score"><b>${result.success ? ARCS[state.selection.arc].sigil : '—'}</b><span>${result.success ? 'заявка на арку' : 'вне розыгрыша'}</span></div></div>
      </div>
      <p class="scene-copy">${result.success ? 'Арка ещё не получена: сначала все соперники выберут один из двух маршрутов. На каждом маршруте энергию заберёт экипаж, который окажется впереди.' : 'После провала Кара продолжает этап, но не может получить арку на этом участке.'}</p>
      <div class="action-bar"><button class="primary-button" id="toRivals">Передать ход соперникам</button></div>`;
    $('#toRivals').addEventListener('click', () => setPhase('rivals'));
  }

  function renderRivalTurn() {
    const turnOrder = state.standings.filter(id => id !== 'player');
    if (!state.rivalTurnDone) {
      playArea.innerHTML = `
        <span class="overline">Ход передан мастеру</span>
        <h2 class="scene-title">Кара ждёт ответа трассы</h2>
        <p class="scene-copy">Игровой ход золотой колесницы завершён. Теперь мастер по очереди выбирает действия пяти соперников и совершает их броски в отдельном режиме.</p>
        <div class="rival-turn-grid">${turnOrder.map(id => `<article class="rival-turn-card ${currentStage().rivals.includes(id) ? 'featured' : ''} ${state.rivalIntegrity[id] <= 0 ? 'disabled' : ''}">
          <div class="turn-card-head"><b>${RIVAL_PROFILES[id].name}</b><span>${racerPosition(id)} место</span></div>
          <p>${rivalPreview(id)}</p>
          <small>${resourceStatus(id)} · Целостность ${state.rivalIntegrity[id]} / ${RIVAL_PROFILES[id].chariot.integrity}</small>
        </article>`).join('')}</div>
        <div class="waiting-pulse"><i></i><span>Ожидание решений мастера</span></div>
        <div class="action-bar"><button class="primary-button" id="openMasterMode">Открыть режим мастера</button></div>`;
      $('#openMasterMode').addEventListener('click', () => setViewMode('master'));
      return;
    }

    playArea.innerHTML = `
      <span class="overline">Ходы соперников завершены</span>
      <h2 class="scene-title">Трасса отвечает</h2>
      <p class="scene-copy">Каждый результат рассчитан из характеристик гонщика, состояния его колесницы, положения в строю и накопленного ресурса.</p>
      <div class="rival-results">${state.rivalTurnResults.map(result => `<article class="rival-result ${result.tone || ''}">
        <div class="turn-card-head"><b>${RIVAL_PROFILES[result.id].name}</b><span>${result.roll || 'без броска'}</span></div>
        <h3>${result.action}</h3><p>${result.text}</p>
      </article>`).join('')}</div>
      <div class="action-bar"><button class="primary-button" id="toSummary">Подвести итог этапа</button></div>`;
    $('#toSummary').addEventListener('click', async () => {
      $('#toSummary').disabled = true;
      await window.SapphireRace.animate();
      if (state.eliminated) {
        state.finished = true;
        setPhase('finish');
      } else setPhase('summary');
    });
  }

  function renderMasterConsole() {
    if (!state.started) {
      playArea.innerHTML = `
        <span class="overline">Режим мастера</span>
        <h2 class="scene-title">Гонка ещё не началась</h2>
        <p class="scene-copy">Начальные параметры Кары и способ бросков задаются на экране игрока. После хода золотой колесницы приложение само остановится перед очередью соперников.</p>
        <div class="action-bar"><button class="primary-button" id="masterOpenPlayer">Перейти к экрану игрока</button></div>`;
      $('#masterOpenPlayer').addEventListener('click', () => setViewMode('player'));
      return;
    }
    if (state.finished || state.phase === 'finish') {
      renderFinish();
      return;
    }
    if (state.phase !== 'rivals') {
      renderMasterWaiting();
      return;
    }

    ensureMasterTurn();
    if (state.rivalTurnDone) {
      prepareCollisionChecks();
      if (state.pendingRuleChecks.length) { renderRuleChecks(); return; }
      if (!state.arcClaims.length) resolveArcClaims();
      playArea.innerHTML = `
        <span class="overline">Очередь завершена</span>
        <h2 class="scene-title">Все соперники сделали ход</h2>
        <p class="scene-copy">Результаты сохранены. На каждом маршруте арку получает экипаж, который закончил этап впереди остальных претендентов.</p>
        <div class="arc-claim-grid">${state.arcClaims.map(claim => `<article class="arc-claim"><span>${ARCS[claim.arcId].name}</span><b>${claim.winner ? RACERS[claim.winner.id].name : claim.tied?'Ничья':'Не разыграна'}</b><small>${claim.winner ? (claim.winner.mode === 'chariot' ? 'энергия в колесницу' : 'энергия в гонщика') : claim.tied?'дистанция и Управление равны':'нет успешных претендентов'}</small></article>`).join('')}</div>
        <div class="rival-results">${state.rivalTurnResults.map(result => masterResultCard(result)).join('')}</div>
        <div class="action-bar"><button class="primary-button" id="masterFinishPhase">Завершить этап</button><button class="secondary-button" id="masterOpenPlayer">Экран игрока</button></div>`;
      $('#masterFinishPhase').addEventListener('click', finishMasterPhase);
      $('#masterOpenPlayer').addEventListener('click', () => setViewMode('player'));
      return;
    }

    const id = state.masterTurnOrder[state.masterTurnIndex];
    if (!id) {
      state.rivalTurnDone = true;
      saveState();
      renderMasterConsole();renderCrewDamageControls();renderCanonReaction();
      return;
    }
    const profile = RIVAL_PROFILES[id];
    if (!state.masterLastResult && (state.skipStages[id] === state.stageIndex || (state.npcHp?.[id]??1)<=0)) {
      delete state.skipStages[id]; state.routeEligible[id] = false;
      state.masterLastResult = {id, action:'Пропуск хода', roll:null, text:'Экипаж пропускает ход из-за ремонта или воздействия способности.', tone:'failure', success:false};
      state.rivalTurnResults.push(state.masterLastResult); saveState();
    }

    if (state.masterLastResult) {
      const reactionOnly = state.masterLastResult.reactionOnly;
      playArea.innerHTML = `
        <span class="overline">${reactionOnly ? 'Реакция разрешена' : `Ход ${state.masterTurnIndex + 1} из ${state.masterTurnOrder.length}`}</span>
        <h2 class="scene-title">${profile.name}</h2>
        ${masterResultCard(state.masterLastResult)}
        <div class="action-bar"><button class="primary-button" id="masterNextRival">${reactionOnly ? 'Перейти к основному действию' : state.masterTurnIndex === state.masterTurnOrder.length - 1 ? 'Завершить очередь' : 'Следующий гонщик'}</button></div>`;
      $('#masterNextRival').addEventListener('click', advanceMasterTurn);
      return;
    }

    const actions = masterActionOptions(id);
    const available = actions.filter(action => action.available !== false);
    if (!available.some(action => action.id === state.masterAction)) state.masterAction = available[0]?.id || null;
    const selected = actions.find(action => action.id === state.masterAction) || available[0];
    const selectedUsesControl = selected ? selected.formula.startsWith('Управление') : false;
    let selectedBonus = selected ? selected.bonus + (selectedUsesControl && state.delayedControl[id]?.stage === state.stageIndex ? state.delayedControl[id].value : 0) + (selectedUsesControl ? state.rivalArcEffects[id].controlBonus : 0) : 0;
    const terrainDisadvantage = selectedUsesControl && !selected?.ignoreTags && ((id !== 'aegon' && raceTags(id).some(tag => ['turn', 'tight'].includes(tag)&&tagActive(tag,id))) || tagActive('visibility',id));
    const rawAdvantage = selected ? Boolean(selected.advantage || (selectedUsesControl && state.rivalArcEffects[id].advantage)) : false;
    const rawDisadvantage = selected ? Boolean(!selected.ignoreTags && (selected.disadvantage || terrainDisadvantage || (selectedUsesControl && state.rivalArcEffects[id].disadvantage))) : false;
    const selectedAdvantage = rawAdvantage && !rawDisadvantage;
    const selectedDisadvantage = rawDisadvantage && !rawAdvantage;
    const route = state.rivalRoutes[id] || currentStage().arcs[0];
    const arcMode = state.rivalArcModes[id] || 'chariot';
    state.rivalRoutes[id] = route;
    state.rivalArcModes[id] = arcMode;
    const progress = state.masterTurnOrder.map((rivalId, index) => `<span class="master-queue-item ${index < state.masterTurnIndex ? 'done' : index === state.masterTurnIndex ? 'current' : ''}" title="${RIVAL_PROFILES[rivalId].name}">${RACERS[rivalId].short}</span>`).join('');

    playArea.innerHTML = `
      <span class="overline">Ход ${state.masterTurnIndex + 1} из ${state.masterTurnOrder.length}</span>
      <div class="master-title-row"><div><h2 class="scene-title">${profile.name}</h2><p>${profile.title} · ${profile.chariot.name}</p></div><div class="master-queue">${progress}</div></div>
      <div class="stage-tags">${stageTagsHtml()}</div>
      <div class="master-status-strip"><span>Место <b>${racerPosition(id)}</b></span><span>Путь <b>${distanceOf(id)} поз.</b> · ${gapLabel(id)}</span><span>Целостность <b>${state.rivalIntegrity[id]} / ${profile.chariot.integrity}</b>${state.rivalArcEffects[id].tempIntegrity ? ` + ${state.rivalArcEffects[id].tempIntegrity} врем.` : ''}</span><span>${resourceStatus(id)}</span><span>Пилот <b>${state.npcHp[id]??profile.racer.hp}/${profile.racer.hp} ОЗ</b></span><span>Управление <b>+${profile.control}</b></span><span>Заряды <b>${rivalChargeSummary(id)}</b></span></div>
      <div class="section-label"><h3>Маршрут к арке</h3><span>Только лидер выбранного маршрута получит энергию</span></div>
      <div class="route-picker">${currentStage().arcs.map(arcId => `<button class="route-card ${route === arcId ? 'selected' : ''}" data-rival-route="${arcId}"><b>${ARCS[arcId].name}</b><small>${currentStage().arcs.indexOf(arcId)===0?'Внутренняя · 1–3':'Внешняя · 4–6'}</small><span>${arcId === route && arcMode === 'racer' ? RIVAL_ARC_ABILITIES[id][arcId][1] : ARCS[arcId].chariot}</span></button>`).join('')}</div>
      <div class="mode-switch rival-mode"><button class="${arcMode === 'chariot' ? 'active' : ''}" data-rival-arc-mode="chariot">В колесницу</button><button class="${arcMode === 'racer' ? 'active' : ''}" data-rival-arc-mode="racer">В гонщика: ${RIVAL_ARC_ABILITIES[id][route][0]}</button></div>
      ${roadLanePicker(id)}
      <div class="section-label"><h3>Выберите действие</h3><span>Подсвеченные приёмы доступны сейчас</span></div>
      <div class="master-actions">${actions.map(action => `<button class="choice-card ${state.masterAction === action.id ? 'selected' : ''}" data-master-action="${action.id}" ${action.available === false ? 'disabled' : ''}><b>${action.name}</b><span>${action.available === false ? action.reason : action.text}</span><div class="card-meta"><span class="mini-tag">${action.meta}</span></div></button>`).join('')}</div>
      <div class="master-roll-mode"><span>Бросок мастера</span><button data-gm-roll="auto" class="${state.gmRollMode === 'auto' ? 'active' : ''}">В приложении</button><button data-gm-roll="manual" class="${state.gmRollMode === 'manual' ? 'active' : ''}">Физический к20</button></div>
      ${canonTargetPicker(id,selected)}
      ${selected?.automatic ? '<button class="primary-button" id="canonAutomatic">Применить способность</button>' : selected ? rollWidget({ id: 'masterRoll', label: selected.name, formula: `${selected.formula}${selectedUsesControl && state.delayedControl[id]?.stage === state.stageIndex ? ' · предыдущий участок −5' : ''}${selectedUsesControl && state.rivalArcEffects[id].controlBonus ? ` · арка ${signed(state.rivalArcEffects[id].controlBonus)}` : ''}`, dc: selected.dc, bonus: selectedBonus, advantage: selectedAdvantage, disadvantage: selectedDisadvantage, mode: state.gmRollMode }) : '<p class="scene-copy">У этого экипажа не осталось доступных действий.</p>'}`;

    $$('[data-master-action]').forEach(button => button.addEventListener('click', () => {
      state.masterAction = button.dataset.masterAction;state.canonTarget=null;
      saveState(); render();
    }));
    $$('[data-rival-route]').forEach(button => button.addEventListener('click', () => {
      state.rivalRoutes[id] = button.dataset.rivalRoute;
      rememberTrackLane(id,state.rivalRoutes[id]);
      saveState(); render();
    }));
    $$('[data-rival-arc-mode]').forEach(button => button.addEventListener('click', () => {
      state.rivalArcModes[id] = button.dataset.rivalArcMode;
      saveState(); render();
    }));
    $$('[data-gm-roll]').forEach(button => button.addEventListener('click', () => {
      state.gmRollMode = button.dataset.gmRoll;
      saveState(); render();
    }));
    bindRoadLanePicker();
    $('#canonTarget')?.addEventListener('change',()=>{state.canonTarget=$('#canonTarget').value;saveState();render();});
    $('#canonAutomatic')?.addEventListener('click',()=>executeMasterAction(id,selected,{raw:15,total:selected.dc,automatic:true}));
    if (selected&&!selected.automatic) bindRollWidget('masterRoll', selectedBonus, result => executeMasterAction(id, selected, {...result,rollOptions:{advantage:selectedAdvantage,disadvantage:selectedDisadvantage}}), { advantage: selectedAdvantage, disadvantage: selectedDisadvantage });
  }

  function renderMasterWaiting() {
    const phaseNames = {
      setup: 'Подготовка экипажа', qualifying: 'Стартовая расстановка', control: 'Комната управления',
      choice: 'Выбор действий Кары', support: 'Действие экипажа', drive: 'Проверка возницы',
      resolve: 'Последствия хода Кары', summary: 'Завершение этапа'
    };
    playArea.innerHTML = `
      <span class="overline">Пульт мастера</span>
      <h2 class="scene-title">Сейчас действует игрок</h2>
      <p class="scene-copy">Текущая фаза: <b>${phaseNames[state.phase] || state.phase}</b>. Мастерская очередь откроется после того, как золотая колесница завершит свой бросок и передаст ход соперникам.</p>
      <div class="master-stage-card"><span class="overline">${currentStage().trial}</span><h3>${currentStage().name}</h3><p>${currentStage().text}</p><div class="stage-tags">${stageTagsHtml()}</div><div class="card-meta"><span class="mini-tag">Сл ${effectiveStageDc('neutral')}</span><span class="mini-tag">этап ${state.stageIndex % 9 + 1} из 9</span><span class="mini-tag">ровно 2 арки</span></div></div>
      <div class="rival-turn-grid">${state.standings.filter(id => id !== 'player').map(id => `<article class="rival-turn-card ${currentStage().rivals.includes(id) ? 'featured' : ''}"><div class="turn-card-head"><b>${RIVAL_PROFILES[id].name}</b><span>${racerPosition(id)} место</span></div><p>${resourceStatus(id)}</p><small>Целостность ${state.rivalIntegrity[id]} / ${RIVAL_PROFILES[id].chariot.integrity}</small></article>`).join('')}</div>
      <div class="action-bar"><button class="secondary-button" id="masterOpenPlayer">Открыть экран игрока</button></div>`;
    $('#masterOpenPlayer').addEventListener('click', () => setViewMode('player'));
  }

  function ensureMasterTurn() {
    if (state.masterTurnStage === state.stageIndex && state.masterTurnOrder.length) return;
    state.masterTurnStage = state.stageIndex;
    state.masterTurnOrder = state.standings.filter(id => id !== 'player' && state.rivalIntegrity[id] > 0);
    state.masterTurnIndex = 0;
    state.masterAction = null;
    state.masterLastResult = null;
    state.rivalTurnResults = [];
    state.rivalTurnDone = state.masterTurnOrder.length === 0;
    saveState();
  }

  function canAegonCutoff() {
    if (!hasRivalCharge('aegon', 'shield') || state.rivalUsage.aegonReactionStage === state.stageIndex || !state.stageSnapshot?.standings) return false;
    return Boolean(aegonCutoffTarget())&&state.unblockable?.[aegonCutoffTarget()]!==state.stageIndex;
  }

  function aegonCutoffTarget() {
    if (!state.stageSnapshot?.standings) return null;
    const before=state.stageSnapshot.distances||{};
    return state.standings.find(id=>id!=='aegon'&&(before[id]||0)<=(before.aegon||0)&&distanceOf(id)>distanceOf('aegon'))||null;
  }

  function masterActionOptions(id) {
    ensureRuleState();
    const profile = RIVAL_PROFILES[id];
    const pickKey=state.masterAction;const needsPick=['pello_swap','pello_laugh','aegon_blade'].includes(pickKey);const target=needsPick?(legalCanonTargets(id,pickKey).includes(state.canonTarget)?state.canonTarget:legalCanonTargets(id,pickKey)[0]||null):frontTarget(id);
    const exchangeTarget=legalCanonTargets(id,'pello_swap').includes(state.canonTarget)?state.canonTarget:legalCanonTargets(id,'pello_swap')[0];
    const cutoffTarget = id === 'aegon' ? aegonCutoffTarget() : null;
    let stageDc = effectiveStageDc(id);
    
    const universalRam = {
      id: 'universal_ram', name: 'Таран',
      text: target ? `Состязание Управления с ${RACERS[target].name}; ничья остаётся за целью. ${id==='aegon'?'1к8+3':id==='pello'?'1к4+3 колеснице и 2к6 экипажу':id==='saira'?'1к6, по выбору +3 за потраченный Жар':'1к6+3'} урона.` : 'Впереди нет цели для тарана.',
      reason: 'Таран возможен только по ближайшей колеснице впереди.', available: Boolean(target) && !(id === 'saira' && state.rivalUsage.sairaHeat >= 5),
      bonus: profile.control, dc: target ? controlResultFor(target) : 99, formula: `Управление: к20 ${signed(profile.control)}`,
      meta: target ? `состязание · цель ${RACERS[target].name}` : 'нет цели', targetId: target
    };
    if (id === 'aegon') {
      return [
        { id: 'aegon_cutoff', name: 'Срезать путь', text: cutoffTarget ? `Реакцией отменить обгон: цель ${RACERS[cutoffTarget].name}.` : 'Никто ещё не обогнал Аэгона на этом этапе.', reason: 'Нужны заряд Щита, совершённый обгон и готовая реакция.', available: canAegonCutoff(), bonus: profile.control, dc: cutoffTarget ? controlResultFor(cutoffTarget) : 99, formula: `Управление: к20 ${signed(profile.control)}`, meta: 'реакция · заряд Щита', reactionOnly: true, targetId: cutoffTarget },
        { id: 'aegon_blade', name: 'Заточенная кромка', text: target ? `Состязание Управления с ${RACERS[target].name}: 2к8 + 4 урона и обгон.` : 'Впереди нет цели.', reason: 'Нужны заряд Меча и ближайшая цель впереди.', available: hasRivalCharge(id, 'sword') && Boolean(target), bonus: profile.control, dc: target ? controlResultFor(target) : 99, formula: `Управление: к20 ${signed(profile.control)}`, meta: 'состязание · заряд Меча', targetId: target },
        { id: 'aegon_turn', name: 'Изломанный поворот', text: 'Пройти участок; теги «крутой поворот» и «тесный проход» не дают Аэгону помеху.', available: true, bonus: profile.control, dc: stageDc, formula: `Управление: к20 ${signed(profile.control)}`, meta: currentStage().tags.some(tag => ['turn','tight'].includes(tag)) ? 'пассивная специализация действует' : 'проверка трассы' },
        { id: 'aegon_hunt', name: 'Чёрная охота', text: 'Рискованный срез траектории: при успехе +2 позиции.', reason: 'Нужен заряд Платиновой звезды.', available: hasRivalCharge(id, 'star'), bonus: profile.control, dc: stageDc + 5, formula: `Управление: к20 ${signed(profile.control)}`, meta: `Сл ${stageDc + 5} · заряд Звезды` },
        { id: 'aegon_angle', name: 'Невозможный угол', text: 'Все теги отменены: −2 к Сл за каждый. Управление с преимуществом; блокировка невозможна.', reason: 'Нужен заряд Серебряного крыла.', available: hasRivalCharge(id, 'wing'), bonus: profile.control, dc: stageDc-raceTags(id).filter(t=>!cancelledTags(id).includes(t)).length*2, formula: `Управление: к20 ${signed(profile.control)}`, meta: 'преимущество · все теги · нельзя блокировать', advantage: true, ignoreTags:true },
        {id:'aegon_scout',name:'Разведать путь',text:'Как у Кары: отменяет подходящие теги и готовит бонус к Управлению.',available:state.rivalUsage.aegonScoutStage!==state.stageIndex,reason:'Разведка уже выполнена на этом этапе.',bonus:profile.skillBonuses.perception,dc:effectiveStageDc('neutral'),formula:'Внимательность: к20 +5',meta:'разведка · дополнительная подготовка',reactionOnly:true},
        universalRam
      ];
    }
    if (id === 'saira') {
      const heat = state.rivalUsage.sairaHeat;
      return [
        { id:'saira_course',name:'Полёт в строю',text:'Управление к20 +3; +1к3 Жара и перегрев. Отменяемые теги пока не заданы.',reason:'При 5 Жарах сначала охладитесь или потратьте Жар.',available:heat<5,bonus:3,dc:stageDc,formula:'Управление: к20 +3',meta:'бонус +3 · +1к3 Жара'},
        {id:'saira_dash',name:'Солнечный рывок',text:'−2 Жара; Сл участка +5. Успех: +4 позиции. Провал: 1к8 + оставшийся Жар урона.',reason:'Нужны 2 Жара и Звезда.',available:heat>=2&&hasRivalCharge(id,'star'),bonus:profile.control,dc:stageDc+5,formula:'Управление: к20 +6',meta:'−2 Жара · Звезда'},
        {id:'saira_veil',name:'Тепловая завеса',text:'Все экипажи позади: спасбросок Мудрости Сл 15. Провал: помеха, тег «Жар» и 2к10 огненного урона пилоту.',reason:'Нужны 1 Жар, Меч и цель впереди.',available:heat>=1&&hasRivalCharge(id,'sword')&&Boolean(target),bonus:0,dc:15,formula:'Спасброски целей: Мудрость Сл 15',meta:'−1 Жар · Меч · цели позади',automatic:true},
        {id:'saira_cool',name:'Открыть охлаждение',text:'Сл 14: −(1к3+1) Жара; провал: −1 Жар и 1к6 урона. Соседи на той же позиции получают плохую видимость.',reason:'Нет Жара.',available:heat>0,bonus:6,dc:14,formula:'Уход за животными: к20 +6',meta:'пар · соседние полосы'},
        {id:'saira_updraft',name:'Восходящий поток',text:'Управление с преимуществом. После провала можно потратить Жар: +2 за единицу, либо перебросить за 1 Жар.',reason:'Нужен заряд Крыла.',available:hasRivalCharge(id,'wing'),bonus:profile.control,dc:stageDc,formula:'Управление: к20 +6',meta:'преимущество · усиление после броска',advantage:true},
        universalRam
      ];
    }
    if (id === 'pello') {
      const used = state.rivalUsage.pelloTeleports.includes(currentStage().lap);
      const poorVisibility = tagActive('visibility',id);
      const teleportBonus = profile.skillBonuses.arcana + (state.rivalUsage.pelloPrepared ? 2 : 0);
      return [
        { id: 'pello_mark', name: 'Расчёт точки выхода', text: 'Исследовать участок и подготовить метку: +2 к следующей телепортации.', available: true, bonus: profile.skillBonuses.investigation, dc: stageDc, formula: 'Расследование: к20 +7', meta: poorVisibility ? 'плохая видимость учитывается' : 'навык · подготовка', disadvantage: poorVisibility },
        {id:'pello_clear_exit',name:'Чистая точка выхода',text:'Автоматический успех Управления, все теги и реакции игнорируются. +2 позиции.',reason:'Нужен заряд Крыла.',available:hasRivalCharge(id,'wing'),bonus:0,dc:stageDc,formula:'Управление: автоматический успех',meta:'Крыло · без броска',automatic:true,ignoreTags:true},
        {id:'pello_swap',name:'Координатный обмен',text:'Выберите любую колесницу впереди. Магия: Сл 14 + расстояние в позициях.',reason:'Нужны Меч и цель впереди.',available:hasRivalCharge(id,'sword')&&legalCanonTargets(id,'pello_swap').length>0,bonus:7,dc:exchangeTarget?14+distanceOf(exchangeTarget)-distanceOf(id):99,formula:'Магия: к20 +7',meta:'выбор цели · Меч',targetId:exchangeTarget},
        {id:'pello_teleport',name:'Короткий путь',text:'Магия Сл 16: +2 позиции. Провал: 1к6 урона; недобор 5: −1 позиция.',reason:'Нужны Звезда и готовая попытка этого круга.',available:hasRivalCharge(id,'star')&&!used,bonus:teleportBonus,dc:16,formula:`Магия: к20 ${signed(teleportBonus)}`,meta:'1/круг · Звезда',disadvantage:poorVisibility&&!state.rivalUsage.pelloPrepared},
        {id:'pello_laugh',name:'Злобный смех',text:'Выбранный экипаж на том же этапе: Мудрость Сл 15. При провале возница пропускает ход, экипаж получает 3к6 психического урона.',available:legalCanonTargets(id,'pello_laugh').length>0,bonus:0,dc:15,formula:'Спасбросок цели: Мудрость Сл 15',meta:'выбор цели · психический урон',targetId:legalCanonTargets(id,'pello_laugh').includes(target)?target:legalCanonTargets(id,'pello_laugh')[0],automatic:true},
        universalRam
      ];
    }
    if (id === 'mael') {
      const resonance = state.rivalUsage.maelResonance;
      const followsLeader = racerPosition(id) === 2;
      return [
        { id: 'mael_read', name: 'Считать ритм', text: 'Пройти участок; Резонанс появляется только при успехе со 2-го места.', available: true, bonus: profile.skillBonuses.perception, dc: stageDc, formula: 'Внимательность: к20 +7', meta: followsLeader ? '+1 Резонанс при успехе' : 'нужно идти сразу за лидером' },
        { id: 'mael_wing_read', name: 'Подхват ритма', text: 'Считать ритм с преимуществом.', reason: 'Нужен заряд Серебряного крыла.', available: hasRivalCharge(id, 'wing'), bonus: profile.skillBonuses.perception, dc: stageDc, formula: 'Внимательность: к20 +7', meta: 'преимущество · заряд Крыла', advantage: true },
        { id: 'mael_wave', name: 'Направленная волна', text: target ? `${RACERS[target].name} проходит спасбросок Мудрости Сл 15.` : 'Впереди нет цели.', reason: 'Нужны 1 Резонанс, заряд Меча и цель впереди.', available: resonance > 0 && hasRivalCharge(id, 'sword') && Boolean(target), bonus: profile.skillBonuses.performance, dc: target ? wisdomDefense(target) : 99, formula: 'Выступление: к20 +6', meta: 'Мудрость Сл 15 · −1 Резонанс', targetId: target },
        { id: 'mael_perfect', name: 'Идеальный интервал', text: 'Состязание с лидером; при успехе Маэль занимает первое место.', reason: 'Нужны 3 Резонанса, заряд Звезды и второе место.', available: resonance >= 3 && hasRivalCharge(id, 'star') && followsLeader, bonus: profile.skillBonuses.performance, dc: followsLeader ? controlResultFor(state.standings[0]) : 99, formula: 'Выступление: к20 +6', meta: 'состязание · весь Резонанс', targetId: state.standings[0] },
        universalRam
      ];
    }
    if (id === 'ordis') {
      const charge = state.rivalUsage.ordisCharge;
      const missing = profile.chariot.integrity - state.rivalIntegrity[id];
      return [
        { id: 'ordis_charge', name: 'Грозовой накопитель', text: `Собрать Заряд; бонус повреждений +${missing}. На теге «молния» получается ещё 1 Заряд.`, reason: 'Накопитель переполнен: Ордис обязана разрядиться.', available: charge < 4, bonus: profile.skillBonuses.tools + missing, dc: 22, formula: `Инструменты: к20 ${signed(profile.skillBonuses.tools + missing)}`, meta: currentStage().tags.includes('lightning') ? '+2 Заряда при успехе' : '+1 Заряд при успехе', advantage: hasRivalCharge(id, 'wing') },
        { id: 'ordis_discharge', name: 'Девятый гром', text: 'Одним броском Управления последовательно таранить экипажи впереди; серия прекращается на первом проигрыше.', reason: 'Нужны 3 Заряда и заряд Платиновой звезды.', available: charge >= 3 && hasRivalCharge(id, 'star') && Boolean(target), bonus: profile.control, dc: target ? controlResultFor(target) : 99, formula: `Управление: к20 ${signed(profile.control)}`, meta: charge >= 4 ? 'обязательный разряд · заряд Звезды' : 'цепь таранов · заряд Звезды' },
        universalRam
      ];
    }
    return [];
  }

  function executeMasterAction(id, action, roll) {
    ensureRuleState();
    if(id==='saira'&&!roll.canonDecided&&state.rivalUsage.sairaHeat>0){const failed=action.id==='universal_ram'?roll.raw===1||roll.total<=action.dc:roll.total<action.dc; if((failed&&!action.automatic)||action.id==='universal_ram'&&roll.raw!==1&&roll.total>action.dc){state.canonPending={id,action,roll};saveState();render();return;}}
    const before = [...state.standings];
    if (action.formula.startsWith('Управление')) {
      state.rivalArcEffects[id].controlBonus = 0;
      state.rivalArcEffects[id].advantage = false;
      state.rivalArcEffects[id].disadvantage = false;
    }
    let result = null;
    if (action.id === 'universal_ram') result = resolveUniversalRam(id, action, roll);
    if (action.id === 'aegon_turn') result = courseManeuver(id, { label: action.name, providedRoll: roll, dc: action.dc });
    if(action.id==='aegon_scout'){state.rivalUsage.aegonScoutStage=state.stageIndex;state.npcCancelled[id]={stage:state.stageIndex,tags:raceTags(id).filter(t=>SUPPORT_CANCELS.scout.includes(t))};const success=roll.total>=action.dc;if(success){state.rivalArcEffects[id].controlBonus+=roll.total>=action.dc+5?0:rollDie(4);if(roll.total>=action.dc+5)state.rivalArcEffects[id].advantage=true;}result=simpleMasterResult(id,action,roll,success,'Разведка: '+(success?'теги отменены, бонус к следующему Управлению.':'бонус не получен; подходящие теги отменены.'),true);}
    if (action.id === 'aegon_angle') { state.unblockable[id]=state.stageIndex;state.npcCancelled[id]={stage:state.stageIndex,tags:raceTags(id)};spendRivalCharge(id, 'wing'); result = courseManeuver(id, { advantage: true, label: action.name, providedRoll: roll, dc: action.dc }); }
    if (action.id === 'aegon_hunt') {
      spendRivalCharge(id, 'star'); const success = roll.total >= action.dc; if (success) moveRacer(id, 2);
      result = simpleMasterResult(id, action, roll, success, success ? 'Аэгон прорезает строй и получает две позиции.' : 'Слишком острый срез запирает «Нагльфар» в чужом потоке.');
    }
    if (action.id === 'aegon_cutoff') {
      spendRivalCharge(id, 'shield'); state.rivalUsage.aegonReactionStage = state.stageIndex;
      const success = state.unblockable[action.targetId]!==state.stageIndex && roll.total >= action.dc; if (success) swapRacers('aegon', action.targetId);
      result = simpleMasterResult(id, action, roll, success, success ? `Аэгон закрывает траекторию и возвращается перед ${RACERS[action.targetId].name}.` : `${RACERS[action.targetId].name} удерживает линию и завершает обгон.`, true);
    }
    if (action.id === 'aegon_blade') {
      spendRivalCharge(id, 'sword'); result = resolveSpecialRam(id, action, roll, rollDice(2,8) + 4, 'Заточенная кромка');
      if (result.success && roll.total - action.dc >= 5 && action.targetId !== 'player') state.rivalArcEffects[action.targetId].controlBonus -= 2;
    }
    if (action.id === 'saira_course') {
      result = courseManeuver(id, { label: action.name, providedRoll: roll, dc: action.dc });
      result.text += resolveSairaHeat(roll);
    }
    if (action.id === 'saira_dash') {
      spendRivalCharge(id, 'star'); state.rivalUsage.sairaHeat -= 2; const success = roll.total >= action.dc;
      if (success) moveRacer(id, 4); else damageRival(id, rollDie(8) + state.rivalUsage.sairaHeat);
      result = simpleMasterResult(id, action, roll, success, success ? '«Белое Солнце» получает четыре позиции.' : 'Сброс запаздывает, и жар прожигает корпус.');
    }
    if(action.id==='saira_veil'){
      spendRivalCharge(id,'sword');state.rivalUsage.sairaHeat-=1;
      const targets=state.standings.filter(t=>t!==id&&alive(t)&&distanceOf(t)<distanceOf(id));
      const texts=targets.map(t=>{const save=canonWisSave(t),failed=save.total<15;if(failed){giveDisadvantage(t);addNpcTag(t,'heat');const damage=rollDice(2,10);damagePilots(t,damage,'fire');return `${RACERS[t].name}: ${rollText(save,15)}; помеха, Жар, ${damage} огненного урона пилоту.`;}return `${RACERS[t].name}: ${rollText(save,15)}; спасбросок успешен.`;});
      result=simpleMasterResult(id,action,{raw:0,total:0},true,texts.join(' ')||'Позади нет целей.');result.visualTargets=targets;
    }
    if(action.id==='pello_laugh'){
      const target=action.targetId,save=canonWisSave(target),success=save.total<15;
      if(success){state.skipStages[target]=state.phase==='rivals'&&(target==='player'||state.masterTurnOrder.indexOf(target)<state.masterTurnIndex)?state.stageIndex+1:state.stageIndex;damagePilots(target,rollDice(3,6),'psychic');}
      result=simpleMasterResult(id,action,save,success,`${RACERS[target].name}: ${rollText(save,15)}. ${success?'Возница пропускает ход; 3к6 психического урона экипажу.':'Смех не подействовал.'}`);
    }
    if (action.id === 'saira_cool') {
      const success = roll.total >= action.dc; const cooling = success ? rollDie(3) + 1 : 1;
      state.rivalUsage.sairaHeat = Math.max(0, state.rivalUsage.sairaHeat - cooling); if (!success) damageRival(id, rollDie(6));
      state.standings.filter(t=>t!==id&&alive(t)&&distanceOf(t)===distanceOf(id)&&Math.abs(state.roadLanes[t]-state.roadLanes[id])===1).forEach(t=>addNpcTag(t,'visibility'));
      result = simpleMasterResult(id, action, roll, success, `Жар снижен на ${cooling}, теперь ${state.rivalUsage.sairaHeat} из 5.${success ? '' : ' Пар повреждает корпус.'}`);
    }
    if (action.id === 'saira_updraft') { spendRivalCharge(id, 'wing'); result = courseManeuver(id, { advantage: true, label: action.name, providedRoll: roll, dc: action.dc }); }
    if(action.id==='pello_clear_exit'){spendRivalCharge(id,'wing');state.unblockable[id]=state.stageIndex;state.npcCancelled[id]={stage:state.stageIndex,tags:raceTags(id)};moveRacer(id,2);commitRoadLane(id,true);result=simpleMasterResult(id,action,roll,true,'Автоматический успех, +2 позиции. Теги и реакции игнорируются.');}
    if (action.id === 'pello_mark') {
      if (action.id === 'pello_clear_exit') spendRivalCharge(id, 'wing');
      const success = roll.total >= action.dc; state.rivalUsage.pelloPrepared = success;
      if (success) moveRacer(id, 1);
      result = simpleMasterResult(id, action, roll, success, success ? 'Точка выхода рассчитана: следующая телепортация получает +2 и игнорирует плохую видимость.' : 'Линии выхода расплываются; метка не установлена.');
    }
    if (action.id === 'pello_swap') {
      spendRivalCharge(id, 'sword'); const success = roll.total >= action.dc;
      if (success) swapRacers(id, action.targetId); else { const damage = rollDie(6); damageRival(id, damage); if (roll.total <= action.dc - 5) moveRacer(id, -1); }
      result = simpleMasterResult(id, action, roll, success, success ? `Тут и Там складывают дистанцию: Пелло меняется местами с ${RACERS[action.targetId].name}.` : 'Координаты расходятся; скачок повреждает колесницу.');
    }
    if (action.id === 'pello_teleport') {
      spendRivalCharge(id, 'star'); state.rivalUsage.pelloTeleports.push(currentStage().lap); state.rivalUsage.pelloPrepared = false;
      const success = roll.total >= action.dc; if (success) moveRacer(id, 2); else { damageRival(id, rollDie(6)); if (roll.total <= action.dc - 5) moveRacer(id, -1); }
      result = simpleMasterResult(id, action, roll, success, success ? '«Короткий путь» исчезает за препятствием и получает две позиции.' : 'Выход смещается: корпус цепляет край перехода.');
    }
    if (action.id === 'mael_read' || action.id === 'mael_wing_read') {
      if (action.id === 'mael_wing_read') spendRivalCharge(id, 'wing');
      const startedSecond = racerPosition(id) === 2;
      result = courseManeuver(id, { advantage: action.advantage, label: action.name, providedRoll: roll, dc: action.dc, bonus: action.bonus });
      if (result.success && startedSecond) state.rivalUsage.maelResonance = Math.min(3, state.rivalUsage.maelResonance + 1);
      result.text += ` Резонанс: ${state.rivalUsage.maelResonance} из 3.`;
    }
    if (action.id === 'mael_wave') {
      spendRivalCharge(id, 'sword'); state.rivalUsage.maelResonance -= 1; const success = roll.total >= action.dc;
      if (success) giveDisadvantage(action.targetId);
      result = simpleMasterResult(id, action, roll, success, success ? `${RACERS[action.targetId].name} получает помеху на следующее Управление.` : 'Цель удерживает собственный ритм.');
    }
    if (action.id === 'mael_perfect') {
      spendRivalCharge(id, 'star'); state.rivalUsage.maelResonance = 0; const success = roll.total > action.dc;
      if (success) swapRacers(id, action.targetId);
      result = simpleMasterResult(id, action, roll, success, success ? 'Маэль зеркалит ритм лидера и занимает первое место.' : 'Лидер удерживает темп; накопленный Резонанс рассыпается.');
    }
    if (action.id === 'ordis_charge') {
      if (hasRivalCharge(id, 'wing')) spendRivalCharge(id, 'wing');
      const success = roll.total >= action.dc; if (success) state.rivalUsage.ordisCharge = Math.min(4, state.rivalUsage.ordisCharge + 1 + (currentStage().tags.includes('lightning') ? 1 : 0));
      result = simpleMasterResult(id, action, roll, success, success ? `Маховики принимают ток. Заряд: ${state.rivalUsage.ordisCharge} из 4.` : 'Контур не замыкается; Заряд не получен.');
    }
    if (action.id === 'ordis_discharge') result = resolveNinthThunder(action, roll);

    if (!result) return;
    if (result.success === false && currentStage().lap === 0 && !action.reactionOnly && !['aegon_hunt','saira_dash','saira_cool','pello_swap','pello_teleport','pello_laugh'].includes(action.id) && !state.stageFailures.includes(id)) {
      const loss = groundFailureGain(state.stageIndex,id), damage = stageBaseDamage();
      if (loss) moveRacer(id,loss); damageRival(id,damage); applyGroundFailure(id);
      result.text += ` ${currentStage().failure} Урон участка: ${damage}.${loss ? ` Изменение позиции: ${loss}.` : ''}`;
    }
    if (state.delayedControl[id]?.stage === state.stageIndex && action.formula.startsWith('Управление')) delete state.delayedControl[id];
    if(action.formula.startsWith('Управление'))commitRoadLane(id,result.success!==false&&roll.raw!==1);
    state.rivalRoutes[id]=currentStage().arcs[state.roadLanes[id]<3?0:1];
    sceneCue(id, action.id, action.name, { before, target: action.targetId || null, targets: result.visualTargets || [], success: result.success !== false && !(action.id === 'universal_ram' && roll.raw === 1) });
    state.stageRolls[id] = action.formula.startsWith('Управление') ? roll.total : 10 + RIVAL_PROFILES[id].control;
    state.routeEligible[id] = result.success !== false;
    if(!action.reactionOnly)state.rivalTurnResults.push(result);
    state.masterLastResult = result;
    saveState(); render();
  }

  function wisdomDefense(id) {
    if (id === 'player') return 10 + (crewActor('driver')?.abilities.wis.save??state.saveBonus);
    return 10 + Math.floor((RIVAL_PROFILES[id].abilities.wis - 10) / 2) + RIVAL_PROFILES[id].proficiency;
  }

  function giveDisadvantage(id) {
    if (id === 'player') state.nextDisadvantage = true;
    else state.rivalArcEffects[id].disadvantage = true;
  }

  function simpleMasterResult(id, action, roll, success, text, reactionOnly = false) {
    addLog(RACERS[id].name, `${action.name}: ${rollText(roll, action.dc)}. ${text}`);
    return { id, action: action.name, roll: rollText(roll, action.dc), text, tone: success ? 'success' : 'failure', success, reactionOnly };
  }

  function damageRaceTarget(id, damage, sourceId, attackTotal) {
    if (id === 'player') { applyDamage(damage,{crew:true}); markRacerHit(id); return { damage, text: `Золотая колесница теряет ${damage} Целостности.` }; }
    const applied = applyDamageToRival(id, damage, { sourceId, attackTotal }); markRacerHit(id); return applied;
  }

  function applyRamSwap(attackerId, targetId) {
    if (targetId === 'player' && state.shieldPositionGuard) {
      state.shieldPositionGuard = false;
      addLog('Арка Щита', 'Первая потеря позиции от столкновения отменена.');
      return false;
    }
    if (targetId !== 'player' && state.rivalArcEffects[targetId].positionGuard) {
      state.rivalArcEffects[targetId].positionGuard = false;
      addLog('Арка Щита', `${RIVAL_PROFILES[targetId].chariot.name} удерживает позицию после столкновения.`);
      return false;
    }
    const oldDistance=distanceOf(attackerId);
    state.distance[attackerId]=Math.max(oldDistance,distanceOf(targetId)+1);
    state.distance[targetId]=oldDistance;sortStandings();
    return true;
  }

  function resolveUniversalRam(id, action, roll) {
    const target = action.targetId;
    const success = roll.raw!==1 && roll.total > action.dc;
    let text;
    if (roll.raw === 1) {
      const selfDamage = rollDie(6); damageRival(id, selfDamage); text = `Таран срывается: собственная колесница получает ${selfDamage} урона.`;
    } else if (success) {
      let damage = id==='aegon'?rollDie(8)+3:id==='pello'?rollDie(4)+3:rollDie(6)+3;
      if(id==='saira')damage=damage-3+(roll.heatSpent||0)*3;
      
      if (state.rivalArcEffects[id].attackBonus) { damage += rollDie(8) + 3; state.rivalArcEffects[id].attackBonus = false; }
      if (id === 'ordis' && hasRivalCharge(id, 'sword')) { damage += rollDie(8) + 3; spendRivalCharge(id, 'sword'); }
      if (id === 'ordis' && state.rivalUsage.ordisGroundingBonus) { damage += rollDie(8) + 3; state.rivalUsage.ordisGroundingBonus = false; }
      const applied = damageRaceTarget(target, damage, id, roll.total);if(id==='pello'&&applied.damage>0)damagePilots(target,rollDice(2,6),'bludgeoning'); const passed = applyRamSwap(id, target);
      text = `${RACERS[id].name} выигрывает Управление у ${RACERS[target].name} и наносит ${applied.damage} урона${passed ? ', выходя вперёд' : ', но Щит удерживает позицию'}. ${applied.text}`;
    } else text = `${RACERS[target].name} удерживает линию; при равенстве защищающийся побеждает.`;
    if (id === 'saira') text += resolveSairaHeat(roll);
    return simpleMasterResult(id, action, roll, success, text);
  }

  function resolveSpecialRam(id, action, roll, damage, label) {
    const success = roll.total > action.dc;
    let text = `${RACERS[action.targetId].name} удерживает траекторию.`;
    if (success) {
      const applied = damageRaceTarget(action.targetId, damage, id, roll.total); const passed = applyRamSwap(id, action.targetId);
      text = `${label} наносит ${applied.damage} урона${passed ? `, и ${RACERS[id].name} выходит вперёд` : ', но Щит удерживает позицию'}. ${applied.text}`;
    }
    return simpleMasterResult(id, action, roll, success, text);
  }

  function resolveSairaHeat(roll) {
    const gain = rollDie(3); state.rivalUsage.sairaHeat = Math.min(5, state.rivalUsage.sairaHeat + gain);
    const heat = state.rivalUsage.sairaHeat; const dc = heat >= 5 ? 18 : heat === 4 ? 16 : heat === 3 ? 14 : null;
    if (!dc || roll.total >= dc) return ` Жар +${gain}: ${heat} из 5${dc ? `; перегрев удержан против Сл ${dc}.` : '.'}`;
    if (hasRivalCharge('saira', 'shield')) { spendRivalCharge('saira', 'shield'); sceneCue('saira', 'saira_cocoon', 'Керамический кокон', { success: true }); return ` Жар +${gain}: ${heat} из 5. Керамический кокон принимает перегрев.`; }
    const damage = rollDie(6) + heat; damageRival('saira', damage); if (heat === 5) state.rivalArcEffects.saira.disadvantage = true;
    return ` Жар +${gain}: ${heat} из 5. Перегрев Сл ${dc} провален: ${damage} урона${heat === 5 ? ' и помеха' : ''}.`;
  }

  function resolveNinthThunder(action, roll) {
    const id = 'ordis'; const charge = state.rivalUsage.ordisCharge; spendRivalCharge(id, 'star'); state.rivalUsage.ordisCharge = 0;
    const targets = state.standings.slice(0, state.standings.indexOf(id)).reverse().slice(0, charge);
    let hits = 0; const notes = [], visualTargets = [];
    for (const target of targets) {
      const defense = controlResultFor(target);
      visualTargets.push({ id: target, success: roll.total > defense });
      if (roll.total <= defense) { notes.push(`${RACERS[target].name} удерживает линию (${defense})`); break; }
      const damage = rollDie(8) + 3; const applied = damageRaceTarget(target, damage, id, roll.total); applyRamSwap(id, target); hits += 1;
      notes.push(`${RACERS[target].name}: ${applied.damage} урона`);
    }
    const success = hits > 0;
    const result = simpleMasterResult(id, { ...action, dc: action.dc }, roll, success, success ? `Ордис пробивает ${hits} ${hits === 1 ? 'экипаж' : 'экипажа'}: ${notes.join('; ')}.` : `Первый защитник останавливает разряд: ${notes.join('; ')}.`);
    result.visualTargets = visualTargets;
    return result;
  }

  function masterResultCard(result) {
    return `<article class="rival-result ${result.tone || ''}"><div class="turn-card-head"><b>${RIVAL_PROFILES[result.id].name}</b><span>${result.roll || 'без броска'}</span></div><h3>${result.action}</h3><p>${result.text}</p></article>`;
  }

  function advanceMasterTurn() {
    if (state.masterLastResult?.reactionOnly) {
      state.masterLastResult = null;
      state.masterAction = null;
      saveState(); render(); return;
    }
    state.canonTarget=null;state.masterTurnIndex += 1;
    state.masterAction = null;
    state.masterLastResult = null;
    if (state.masterTurnIndex >= state.masterTurnOrder.length || state.eliminated) {
      state.rivalTurnDone = true;
      prepareCollisionChecks();
      if (!state.pendingRuleChecks.length && !state.arcClaims.length) resolveArcClaims();
    }
    saveState(); render();
  }

  async function finishMasterPhase() {
    if (window.SapphireScene?.busy) return;
    prepareCollisionChecks();
    if (state.pendingRuleChecks.length) { renderRuleChecks(); return; }
    await window.SapphireRace.animate();
    state.masterLastResult = null;
    if (!state.arcClaims.length) resolveArcClaims();
    if (state.eliminated) {
      state.finished = true;
      setPhase('finish');
    } else setPhase('summary');
  }

  function rivalPreview(id) {
    if (state.rivalIntegrity[id] <= 0) return 'Колесница разрушена и больше не участвует в гонке.';
    if (id === 'aegon') return hasRivalCharge(id, 'sword') && frontTarget(id) ? 'Может потратить заряд Меча на состязательную «Заточенную кромку».' : 'Проходит повороты и теснины без помехи.';
    if (id === 'saira') {
      if (state.rivalUsage.sairaHeat >= 2 && hasRivalCharge(id, 'star')) return 'Может сбросить Жар в Солнечный рывок.';
      return 'Обычный ход даёт 1к3 Жара и может вызвать проверку перегрева.';
    }
    if (id === 'pello') return hasRivalCharge(id, 'star') ? 'Может рискнуть очень сложным «Коротким путём».' : 'Готовит точку выхода навыком Расследования.';
    if (id === 'mael') {
      if (state.rivalUsage.maelResonance >= 3 && hasRivalCharge(id, 'star')) return 'Может оспорить лидерство Идеальным интервалом.';
      return 'Получает Резонанс только если успешно читает ритм со второго места.';
    }
    if (id === 'ordis') return state.rivalUsage.ordisCharge >= 3 && hasRivalCharge(id, 'star') ? 'Готова провести цепь таранов «Девятым громом».' : 'Инструменты Сл 22 накапливают Заряд; повреждения дают бонус.';
    return 'Преодолевает препятствие.';
  }

  function resourceStatus(id) {
    if (id === 'aegon') return state.rivalUsage.aegonReactionStage === state.stageIndex ? 'Реакция израсходована' : 'Реакция готова';
    if (id === 'saira') return `Жар ${state.rivalUsage.sairaHeat} / 5`;
    if (id === 'pello') {
      const emergency = state.rivalUsage.pelloEmergencyUnlocked ? (state.stageIndex >= state.rivalUsage.pelloEmergencyReadyAt ? 'аварийный скачок готов' : `скачок на этапе ${state.rivalUsage.pelloEmergencyReadyAt + 1}`) : 'аварийный скачок закрыт';
      return `${state.rivalUsage.pelloTeleports.includes(currentStage().lap) ? 'Короткий путь израсходован' : 'Короткий путь готов'} · ${emergency}`;
    }
    if (id === 'mael') return `Резонанс ${state.rivalUsage.maelResonance} / 3`;
    if (id === 'ordis') return `Заряд ${state.rivalUsage.ordisCharge} / 4`;
    return 'Нет ресурса';
  }

  function rivalChargeSummary(id) {
    const labels = { shield: 'Щ', sword: 'М', star: 'З', wing: 'К' };
    const ready = Object.entries(state.rivalCharges[id]).filter(([, value]) => value).map(([arc]) => labels[arc]);
    return ready.length ? ready.join(' · ') : 'нет';
  }

  function resolveAllRivals() {
    const order = state.standings.filter(id => id !== 'player');
    state.rivalTurnResults = [];
    for (const id of order) {
      if (state.rivalIntegrity[id] <= 0) {
        state.rivalTurnResults.push({ id, action: 'Выбыл', roll: null, text: `${RIVAL_PROFILES[id].chariot.name} больше не может продолжать гонку.`, tone: 'failure' });
        continue;
      }
      if (state.eliminated) break;
      state.rivalTurnResults.push(resolveRival(id));
    }
    state.rivalTurnDone = true;
    saveState();
    render();
  }

  function resolveRival(id) {
    if (id === 'aegon') return resolveAegon();
    if (id === 'saira') return resolveSaira();
    if (id === 'pello') return resolvePello();
    if (id === 'mael') return resolveMael();
    if (id === 'ordis') return resolveOrdis();
    return courseManeuver(id);
  }

  function checkRoll(bonus, { advantage = false, disadvantage = false } = {}) {
    const first = rollDie(20);
    const second = rollDie(20);
    let raw = first;
    if (advantage && !disadvantage) raw = Math.max(first, second);
    if (disadvantage && !advantage) raw = Math.min(first, second);
    return { raw, total: raw + bonus, pair: advantage || disadvantage ? [first, second] : null };
  }

  function rollText(result, dc = null) {
    const dice = result.pair ? `${result.pair[0]}/${result.pair[1]} → ${result.raw}` : result.raw;
    return `к20 ${dice} ${signed(result.total - result.raw)} = ${result.total}${dc ? ` против Сл ${dc}` : ''}`;
  }

  function courseManeuver(id, { modifier = 0, advantage = false, disadvantage = false, label = 'Преодолеть препятствие', providedRoll = null, dc: dcOverride = null, bonus: skillBonus = null } = {}) {
    if (id === 'ordis' && state.rivalUsage.ordisPanic) {
      disadvantage = true;
      state.rivalUsage.ordisPanic = false;
    }
    const profile = RIVAL_PROFILES[id];
    const dc = dcOverride ?? effectiveStageDc(id);
    const roll = providedRoll || checkRoll((skillBonus ?? profile.control) + modifier, { advantage, disadvantage });
    let gain = 0;
    let damage = 0;
    let text = 'Экипаж сохраняет место в строю.';
    let tone = 'neutral';

    if (roll.raw === 20) {
      gain = 2; tone = 'success'; text = 'Безупречная траектория даёт две дополнительные позиции пути.';
    } else if (roll.raw === 1) {
      gain = -2; damage = rollDice(2, 6); tone = 'failure'; text = 'Критическая ошибка ломает строй и тяжело бьёт по корпусу.';
    } else if (roll.total >= dc + 5) {
      gain = 1; tone = 'success'; text = 'Гонщик проходит участок с запасом скорости и получает позицию.';
    } else if (roll.total >= dc) {
      tone = 'success'; text = 'Препятствие пройдено без потери темпа.';
    } else if (roll.total >= dc - 4) {
      damage = rollDie(4); tone = 'failure'; text = 'Позиция удержана, но колесница цепляет препятствие.';
    } else {
      gain = -1; damage = rollDie(6) + 2; tone = 'failure'; text = 'Траектория сорвана: колесница теряет позицию и принимает удар.';
    }

    const success = roll.raw !== 1 && (roll.raw === 20 || roll.total >= dc);
    if (!success && currentStage().lap === 0) { gain = groundFailureGain(state.stageIndex,id); damage = stageBaseDamage(); applyGroundFailure(id); text = currentStage().failure; }
    if (gain) moveRacer(id, gain);
    if(skillBonus===null)commitRoadLane(id,success);
    if (damage) damageRival(id, damage);
    const resultText = `${text}${gain ? ` Изменение позиции: ${gain > 0 ? '+' : ''}${gain}.` : ''}${damage ? ` Урон: ${damage}.` : ''}`;
    addLog(profile.name.split(' ')[0], `${label}: ${rollText(roll, dc)}. ${resultText}`);
    return { id, action: label, roll: rollText(roll, dc), text: resultText, tone, success, raw: roll.raw, total: roll.total };
  }

  function resolveAegon() {
    const id = 'aegon';
    const reaction = attemptAegonCutoff();
    const adjacent = Math.abs(distanceOf(id) - distanceOf('player')) <= 1;
    if (adjacent && currentStage().rivals.includes(id)) {
      const profile = RIVAL_PROFILES[id];
      const defense = 10 + state.controlBonus;
      const roll = checkRoll(profile.attack);
      let text;
      let tone = 'failure';
      if (roll.total >= defense) {
        const damage = rollDie(8) + 4;
        applyDamage(damage);
        if (state.shieldPositionGuard) {
          state.shieldPositionGuard = false;
          addLog('Щит', 'Арка отменяет потерю позиции от столкновения.');
          text = `Кромка наносит ${damage} урона, но Арка Щита удерживает позицию.`;
        } else {
          moveRacer('player', -1);
          text = `Кромка наносит ${damage} урона и выбивает золотую колесницу на позицию назад.`;
        }
        tone = 'success'; markRacerHit('player');
      } else text = 'Кара меняет высоту, и заточенная кромка проходит под колесницей.';
      if (reaction) text = `${reaction} ${text}`;
      addLog('Аэгон', `Заточенная кромка: ${rollText(roll, defense)}. ${text}`);
      return { id, action: 'Заточенная кромка', roll: rollText(roll, defense), text, tone };
    }
    const advantage = currentStage().lap === 0 || currentStage().trial === 'Сапфировые врата';
    const result = courseManeuver(id, { advantage, label: 'Изломанный поворот' });
    if (reaction) result.text = `${reaction} ${result.text}`;
    return result;
  }

  function attemptAegonCutoff() {
    const lap = currentStage().lap;
    if (state.rivalUsage.aegonReactionLaps.includes(lap) || !state.stageSnapshot?.standings) return '';
    const before = state.stageSnapshot.standings;
    const crossed = before.indexOf('player') > before.indexOf('aegon') && playerPosition() < racerPosition('aegon');
    if (!crossed) return '';
    state.rivalUsage.aegonReactionLaps.push(lap);
    const roll = checkRoll(RIVAL_PROFILES.aegon.control);
    const target = state.lastControl?.total || 15;
    if (roll.total >= target) {
      moveRacer('player', -1);
      addLog('Аэгон', `Реакция «Срезать путь»: ${rollText(roll, target)}. Обгон отменён.`);
      return 'Аэгон реакцией перерезает траекторию и отменяет одну полученную героями позицию.';
    }
    addLog('Аэгон', `Реакция «Срезать путь»: ${rollText(roll, target)}. Кара удерживает линию.`);
    return 'Аэгон пытается закрыть обгон, но Кара удерживает линию.';
  }

  function resolveSaira() {
    const id = 'saira';
    const heat = state.rivalUsage.sairaHeat;
    const adjacent = Math.abs(distanceOf(id) - distanceOf('player')) <= 1;
    if (heat >= 2) {
      const dc = currentStage().dc;
      const roll = checkRoll(RIVAL_PROFILES[id].control);
      state.rivalUsage.sairaHeat = Math.max(0, heat - 2);
      let text;
      let tone;
      if (roll.total >= dc) {
        moveRacer(id, roll.raw === 20 ? 3 : 2);
        text = `«Белое Солнце» сбрасывает жар и получает ${roll.raw === 20 ? 'три' : 'две'} позиции.`; tone = 'success';
      } else {
        const damage = rollDie(6) + 3;
        damageRival(id, damage);
        moveRacer(id, -1);
        text = `Клапаны открываются поздно: ${damage} урона и потеря позиции.`; tone = 'failure';
      }
      addLog('Сайра', `Солнечный рывок: ${rollText(roll, dc)}. ${text}`);
      return { id, action: 'Солнечный рывок', roll: rollText(roll, dc), text, tone };
    }
    if (adjacent && currentStage().lap === 2 && currentStage().rivals.includes(id) && heat > 0) {
      const save = checkRoll(crewActor('driver')?.abilities.wis.save??state.saveBonus);
      state.rivalUsage.sairaHeat -= 1;
      const failed = save.total < RIVAL_PROFILES[id].saveDc;
      if (failed) state.nextDisadvantage = true;
      const text = failed ? 'Жар от крыльев Полдня ломает воздушный поток: следующая проверка Кары совершается с помехой.' : 'Кара проходит через жар и не теряет ритм.';
      addLog('Сайра', `Тепловая завеса: спасбросок героев ${rollText(save, RIVAL_PROFILES[id].saveDc)}. ${text}`);
      return { id, action: 'Тепловая завеса', roll: `спасбросок героев: ${rollText(save, RIVAL_PROFILES[id].saveDc)}`, text, tone: failed ? 'success' : 'failure' };
    }
    const result = courseManeuver(id, { label: 'Полёт в строю' });
    state.rivalUsage.sairaHeat = Math.min(3, state.rivalUsage.sairaHeat + 1);
    result.text += ` Медные каналы набирают Жар: ${state.rivalUsage.sairaHeat} из 3.`;
    return result;
  }

  function shouldPelloTeleport() {
    const lap = currentStage().lap;
    if (state.rivalUsage.pelloTeleports.includes(lap)) return false;
    const farBehind = distanceOf('player')-distanceOf('pello')>=2;
    return state.stageIndex % 3 === 0 || farBehind || currentStage().dc >= 17;
  }

  function resolvePello() {
    const id = 'pello';
    if (shouldPelloTeleport()) {
      const lap = currentStage().lap;
      const poorVisibility = currentStage().trial === 'Туманный риф' || ['Пенный тоннель', 'Голоса в тумане'].includes(currentStage().name);
      const bonus = RIVAL_PROFILES[id].control + (state.rivalUsage.pelloPrepared ? 2 : 0);
      const roll = checkRoll(bonus, { disadvantage: poorVisibility });
      const dc = currentStage().dc;
      state.rivalUsage.pelloTeleports.push(lap);
      state.rivalUsage.pelloPrepared = false;
      let text;
      let tone;
      if (roll.total >= dc) {
        const gain = roll.raw === 20 ? 3 : 2;
        moveRacer(id, gain);
        text = `Тут начинает переход, Там удерживает выход. «Короткий путь» получает ${gain} позиции.`; tone = 'success';
      } else {
        const damage = roll.raw === 1 ? rollDice(2, 6) : rollDie(6);
        const loss = roll.raw === 1 ? -2 : -1;
        moveRacer(id, loss); damageRival(id, damage);
        text = `Выход смещается: колесница теряет ${Math.abs(loss)} ${Math.abs(loss) === 1 ? 'позицию' : 'позиции'} и ${damage} Целостности.`; tone = 'failure';
      }
      addLog('Пелло', `Короткий путь: ${rollText(roll, dc)}. ${text}`);
      return { id, action: 'Короткий путь', roll: rollText(roll, dc), text, tone };
    }
    const result = courseManeuver(id, { label: 'Расчёт точки выхода' });
    state.rivalUsage.pelloPrepared = true;
    result.text += ' Пелло устанавливает метку и получает +2 к следующей телепортации.';
    return result;
  }

  function resolveMael() {
    const id = 'mael';
    const resonance = state.rivalUsage.maelResonance;
    const adjacent = Math.abs(distanceOf(id) - distanceOf('player')) <= 1;
    if (resonance >= 3) {
      const dc = currentStage().dc;
      const roll = checkRoll(RIVAL_PROFILES[id].control, { advantage: true });
      state.rivalUsage.maelResonance = 0;
      const success = roll.total >= dc;
      if (success) moveRacer(id, 2);
      const text = success ? 'Грань и Эхо входят в идеальный интервал. «Стеклянный хор» получает две позиции.' : 'Ритм распадается до обгона; накопленный Резонанс потерян.';
      addLog('Маэль', `Идеальный интервал: ${rollText(roll, dc)}. ${text}`);
      return { id, action: 'Идеальный интервал', roll: rollText(roll, dc), text, tone: success ? 'success' : 'failure' };
    }
    if (adjacent && currentStage().rivals.includes(id) && resonance > 0) {
      const save = checkRoll(crewActor('driver')?.abilities.wis.save??state.saveBonus);
      const failed = save.total < RIVAL_PROFILES[id].saveDc;
      state.rivalUsage.maelResonance -= 1;
      if (failed) {
        state.nextDisadvantage = true;
        if (racerPosition(id) > playerPosition()) moveRacer(id, 1);
      }
      const text = failed ? 'Звуковая волна сбивает команды экипажа: следующая проверка с помехой, а Маэль использует заминку для обгона.' : 'Упряжь Кары выдерживает резонанс.';
      addLog('Маэль', `Направленная волна: спасбросок героев ${rollText(save, RIVAL_PROFILES[id].saveDc)}. ${text}`);
      return { id, action: 'Направленная волна', roll: `спасбросок героев: ${rollText(save, RIVAL_PROFILES[id].saveDc)}`, text, tone: failed ? 'success' : 'failure' };
    }
    const result = courseManeuver(id, { label: 'Считать ритм' });
    if (result.success) state.rivalUsage.maelResonance = Math.min(3, resonance + 1);
    result.text += ` Резонанс: ${state.rivalUsage.maelResonance} из 3.`;
    return result;
  }

  function resolveOrdis() {
    const id = 'ordis';
    const lightningStage = currentStage().name === 'Грозовой разрез';
    state.rivalUsage.ordisCharge = Math.min(4, state.rivalUsage.ordisCharge + 1 + (lightningStage ? 1 : 0));
    const charge = state.rivalUsage.ordisCharge;
    const favorable = /РЫВОК|ФИНИШ|ПРОЛЁТ|ПИКИРОВАНИЕ|УДАРНАЯ/.test(currentStage().type) || racerPosition(id) > playerPosition();
    if (charge >= 4 || (charge >= 3 && favorable)) {
      const forced = charge >= 4;
      const dc = currentStage().dc + (favorable ? 0 : 2);
      const roll = checkRoll(RIVAL_PROFILES[id].control + Math.min(2, charge - 2));
      state.rivalUsage.ordisCharge = 0;
      const success = roll.total >= dc;
      let text;
      if (success) {
        moveRacer(id, roll.raw === 20 ? 3 : 2);
        text = `Маховики поднимают тяжёлый корпус над трассой. Ордис получает ${roll.raw === 20 ? 'три' : 'две'} позиции.`;
      } else {
        const damage = rollDice(2, 6) + (forced ? 2 : 0);
        damageRival(id, damage);
        state.rivalUsage.ordisPanic = true;
        text = `Разряд уходит в упряжь: ${damage} урона, Варра паникует, следующий бросок совершается с помехой.`;
      }
      addLog('Ордис', `Девятый гром: ${rollText(roll, dc)}. ${text}`);
      return { id, action: 'Девятый гром', roll: rollText(roll, dc), text, tone: success ? 'success' : 'failure' };
    }
    const modifier = currentStage().lap === 0 ? -2 : 0;
    const result = courseManeuver(id, { modifier, label: 'Грозовой накопитель' });
    result.text += ` Заряд: ${state.rivalUsage.ordisCharge} из 4.`;
    return result;
  }

  function applyDamageToRival(id, incoming, { sourceId = null, attackTotal = null } = {}) {
    let damage = incoming;
    let reaction = '';
    if (id === 'pello' && state.unblockable?.[sourceId]!==state.stageIndex && (state.rivalUsage.pelloEmergencyUnlocked || hasRivalCharge(id, 'shield')) && state.stageIndex >= state.rivalUsage.pelloEmergencyReadyAt) {
      if (hasRivalCharge(id, 'shield')) { spendRivalCharge(id, 'shield'); state.rivalUsage.pelloEmergencyUnlocked = true; }
      state.rivalUsage.pelloEmergencyReadyAt = state.stageIndex + 3;
      damage = 0;
      sceneCue(id, 'pello_emergency', 'Аварийный скачок', { success: true });
      reaction = `Аварийный скачок полностью уводит колесницу от удара; перезарядка до этапа ${state.rivalUsage.pelloEmergencyReadyAt + 1}. `;
    } else if (id === 'mael' && state.unblockable?.[sourceId]!==state.stageIndex && sourceId && attackTotal && hasRivalCharge(id, 'shield') && state.rivalUsage.maelResonance > 0) {
      const counter = checkRoll(RIVAL_PROFILES.mael.skillBonuses.performance);
      sceneCue(id, 'mael_counter', 'Противофаза', { target: sourceId, success: counter.total >= attackTotal });
      spendRivalCharge(id, 'shield'); state.rivalUsage.maelResonance -= 1;
      if (counter.total >= attackTotal) {
        damage = 0;
        if (sourceId === 'player') applyDamage(incoming); else damageRival(sourceId, incoming);
        reaction = `Противофаза (${counter.total} против ${attackTotal}) отражает ${incoming} урона в источник. `;
      } else reaction = `Противофаза срывается (${counter.total} против ${attackTotal}). `;
    } else if (id === 'ordis' && hasRivalCharge(id, 'shield') && state.rivalUsage.ordisCharge > 0) {
      spendRivalCharge(id, 'shield');
      state.rivalUsage.ordisCharge -= 1;
      state.rivalUsage.ordisGroundingBonus = true;
      sceneCue(id, 'ordis_ground', 'Заземление', { success: true });
      reaction = 'Заземление не уменьшает удар, но заряжает следующий таран на +1к8 + 3. ';
    }
    const shield = state.rivalArcEffects[id].tempIntegrity;
    if (shield > 0 && damage > 0) {
      const blocked = Math.min(shield, damage);
      state.rivalArcEffects[id].tempIntegrity -= blocked;
      damage -= blocked;
      reaction += `Временная Целостность поглощает ${blocked}. `;
    }
    damageRival(id, damage);
    const text = `${reaction}${damage ? `${RIVAL_PROFILES[id].chariot.name} теряет ${damage} Целостности.` : 'Повреждений нет.'}`;
    addLog('Атака', `${RIVAL_PROFILES[id].name}: ${text}`);
    return { damage, text };
  }

  function damageRival(id, damage) {
    if (damage <= 0) return;crowdCue('disappointed',id);
    state.rivalIntegrity[id] = Math.max(0, state.rivalIntegrity[id] - damage);
    if (state.rivalIntegrity[id] === 0) {
      sortStandings();
      addLog('Выбывание', `${RIVAL_PROFILES[id].chariot.name} разрушена. Защитные печати снимают экипаж с трассы.`);
    }
  }

  function renderStageSummary() {
    const before = state.stageSnapshot;
    const posDelta = before ? distanceOf('player') - (before.distance||0) : 0;
    const integrityDelta = before ? state.integrity - before.integrity : 0;
    playArea.innerHTML = `
      <span class="overline">Этап ${state.stageIndex + 1} завершён</span>
      <h2 class="scene-title">${currentStage().name} остаётся позади</h2>
      <p class="scene-copy">Запишите итог и переходите к следующему участку. Все краткосрочные эффекты текущего препятствия завершатся автоматически.</p>
      <div class="result-grid">
        <div class="result-hero"><span class="overline">Пройдено позиций</span><div class="result-score"><b>${distanceOf('player')}</b><span class="${posDelta < 0 ? 'delta negative' : 'delta'}">${posDelta === 0 ? 'без изменений' : `${posDelta > 0 ? '+' : ''}${posDelta}`}</span></div></div>
        <div class="result-hero"><span class="overline">Целостность</span><div class="result-score"><b>${state.integrity}</b><span class="${integrityDelta < 0 ? 'delta negative' : 'delta'}">${integrityDelta === 0 ? 'без изменений' : `${integrityDelta > 0 ? '+' : ''}${integrityDelta}`}</span></div></div>
        <div class="result-hero"><span class="overline">Лидер</span><div class="result-score"><b>${RACERS[state.standings[0]].short}</b><span>${RACERS[state.standings[0]].name}</span></div></div>
      </div>
      <div class="arc-claim-grid">${state.arcClaims.map(claim => `<article class="arc-claim"><span>${ARCS[claim.arcId].name}</span><b>${claim.winner ? RACERS[claim.winner.id].name : claim.tied?'Ничья':'Не разыграна'}</b><small>${claim.winner ? (claim.winner.mode === 'chariot' ? 'усиление колесницы' : 'заряд способности') : 'нет успешного маршрута'}</small></article>`).join('')}</div>
      <div class="action-bar"><button class="primary-button" id="nextStage">${state.stageIndex === STAGES.length - 1 ? 'Перейти к финишу' : 'Следующий участок'}</button></div>`;
    $('#nextStage').addEventListener('click', advanceStage);
  }

  function advanceStage() {
    if (state.lightProtection) {
      state.tempIntegrity = state.activeArc?.id === 'shield' && state.activeArc.acquiredStage === state.stageIndex ? 10 : 0;
      state.lightProtection = false;
    }
    state.damageReduction = 0;
    state.ejectionGuard = false;
    if (state.activeArc && state.activeArc.acquiredStage < state.stageIndex) clearActiveArc();
    if (state.stageIndex >= STAGES.length - 1) {
      state.finished = true; state.phase = 'finish'; saveState(); render(); return;
    }
    const oldLap = currentStage().lap;
    state.stageIndex += 1;
    state.cancelledTags = {stage: -1, tags: []}; state.stageFailures = []; state.collisionChecksStage = -1;
    state.rivalTurnDone = false;
    state.rivalTurnResults = [];
    state.masterTurnStage = -1;
    state.masterTurnOrder = [];
    state.masterTurnIndex = 0;
    state.masterAction = null;
    state.masterLastResult = null;
    state.stageRolls = {};
    state.rivalRoutes = {};
    state.rivalArcModes = {};
    state.routeEligible = { player: false };
    state.arcClaims = [];
    state.selection = { pace: 'race', support: 'scout', arc: currentStage().arcs[0], arcMode: 'chariot', ability: null };
    state.stageSnapshot = null;
    const newLap = currentStage().lap;
    addLog('Трасса', `Начинается этап ${state.stageIndex + 1}: ${currentStage().name}.`);
    if (newLap !== oldLap) beginLapControl(); else setPhase('choice');
  }

  function renderFinish() {
    const position = playerPosition();
    const won = position === 1 && !state.eliminated;
    const tiedFinish=Object.keys(RACERS).some(id=>id!=='player'&&alive(id)&&distanceOf(id)===distanceOf('player'));
    playArea.innerHTML = `
      <span class="overline">Сапфировая гонка завершена</span>
      <h2 class="scene-title">${state.eliminated ? 'Защитные печати гасят падение' : won ? tiedFinish?'Кара делит первое место':'Кара пересекает линию первой' : `Золотая колесница финиширует ${position}-й`}</h2>
      <p class="scene-copy">${state.eliminated ? 'Экипаж спасён, но колесница больше не может продолжать движение.' : won ? 'Победителей уже ждёт проход в ложи знати. Впереди Совет Мудрых, Альба и последствия раскрытого саботажа.' : 'Герои не получили безусловного права войти к Совету, но спасение соперника, раскрытый саботаж или публичный подвиг всё ещё могут открыть им путь.'}</p>
      <div class="result-grid">
        <div class="result-hero ${won ? 'success' : ''}"><span class="overline">Итоговое место</span><div class="result-score"><b>${position}</b><span>из 6</span></div></div>
        <div class="result-hero"><span class="overline">Целостность</span><div class="result-score"><b>${state.integrity}</b><span>из 30</span></div></div>
        <div class="result-hero"><span class="overline">Аспекты Кары</span><div class="result-score"><b>${Object.values(state.awakened).filter(Boolean).length}</b><span>из 3</span></div></div>
      </div>
      <div class="action-bar"><button class="primary-button" id="finishReset">Начать новую гонку</button></div>`;
    $('#finishReset').addEventListener('click', resetRace);
  }

  function rollWidget({ id, label, formula, dc, bonus, advantage = false, disadvantage = false, mode = state.rollMode }) {
    const modeNote = advantage ? 'Преимущество: бросьте два к20 и возьмите больший.' : disadvantage ? 'Помеха: бросьте два к20 и возьмите меньший.' : '';
    return `<div class="roll-card" id="${id}Card">
      <div class="roll-heading"><span class="overline">${label}</span><div class="roll-check"><div><small>Проверка</small><div class="formula">${formula}</div></div><div class="roll-difficulty"><small>${id === 'supportRoll' && state.selection.support === 'ram' ? 'Управление цели' : 'Сложность'}</small><b>${dc || '—'}</b></div></div>${modeNote ? `<p class="roll-mode-note">${modeNote}</p>` : ''}</div>
      <div class="dice-row"><div class="die" id="${id}Die">20</div><div><b>Итог = к20 ${signed(bonus)}</b><p class="roll-mode-note">${mode === 'auto' ? 'Бонус уже учтён. Нажмите кнопку ниже.' : 'Введите только число на кости. Бонус добавится автоматически.'}</p></div></div>
      ${mode === 'auto' ? `<div class="roll-actions"><button class="primary-button" id="${id}Auto">Бросить к20</button></div>` : `<div class="manual-entry"><div class="field"><label for="${id}Manual">Результат к20</label><input id="${id}Manual" type="number" min="1" max="20" inputmode="numeric" placeholder="1–20"></div><button class="primary-button" id="${id}Submit">Применить</button></div>`}
    </div>`;
  }

  function bindRollWidget(id, bonus, callback, options = {}) {
    pendingRoll = { id, bonus, callback, options };
    const auto = $(`#${id}Auto`);
    if (auto) auto.addEventListener('click', () => animateRoll(id, bonus, callback, options));
    const submit = $(`#${id}Submit`);
    if (submit) submit.addEventListener('click', () => {
      const raw = Number($(`#${id}Manual`).value);
      if (!Number.isInteger(raw) || raw < 1 || raw > 20) { toast('Введите целое число от 1 до 20'); return; }
      callback({ raw, total: raw + bonus });
    });
  }

  function animateRoll(id, bonus, callback, options) {
    const die = $(`#${id}Die`);
    const button = $(`#${id}Auto`);
    if (!die || !button) return;
    button.disabled = true;
    die.classList.add('rolling');
    let rawA = rollDie(20);
    let rawB = rollDie(20);
    let raw = rawA;
    if (options.advantage) raw = Math.max(rawA, rawB);
    if (options.disadvantage) raw = Math.min(rawA, rawB);
    let ticks = 0;
    const ticker = setInterval(() => { die.textContent = rollDie(20); ticks += 1; if (ticks > 6) clearInterval(ticker); }, 65);
    setTimeout(() => {
      clearInterval(ticker);
      die.classList.remove('rolling');
      die.textContent = raw;
      callback({ raw, total: raw + bonus, pair: options.advantage || options.disadvantage ? [rawA, rawB] : null });
    }, 650);
  }

  function signed(value) { return value >= 0 ? `+${value}` : String(value); }

  function nearestActiveRival() {
    return frontTarget('player');
  }

  function markRacerHit(id) {
    requestAnimationFrame(() => {
      const token = document.querySelector(`[data-racer="${id}"]`);
      token?.classList.add('hit');
      setTimeout(() => token?.classList.remove('hit'), 460);
    });
  }

  function resetRace() {
    if (state.started && !state.finished && !confirm('Начать гонку заново? Текущий прогресс будет удалён.')) return;
    state = defaultState();
    saveState();
    render();
  }

  function bindStaticControls() {
    $('#playerModeButton').addEventListener('click', () => setViewMode('player'));
    $('#masterModeButton').addEventListener('click', () => setViewMode('master'));
    $('#racersButton').addEventListener('click', () => {
      renderRivalProfiles();
      $('#racersDialog').showModal();
    });
    $('#rulesButton').addEventListener('click', () => $('#rulesDialog').showModal());
    $('#resetButton').addEventListener('click', resetRace);
    $('#toggleLogButton').addEventListener('click', () => {
      const log = $('#eventLog');
      log.classList.toggle('expanded');
      $('#toggleLogButton').textContent = log.classList.contains('expanded') ? 'Свернуть' : 'Развернуть';
    });
  }

  syncChannel?.addEventListener('message', event => {
    if (event.data?.version !== 4) return;
    state = ensureDistanceState(event.data);
    render();
  });

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const incoming = JSON.parse(event.newValue);
      if (incoming?.version === 4) {
        state = ensureDistanceState(incoming);
        render();
      }
    } catch (_) {}
  });

  window.addEventListener('hashchange', () => {
    viewMode = loadViewMode();
    render();
  });

  function registerWebMCP() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const register = tool => {
      try { Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch (_) {}
    };
    register({
      name: 'get_race_state',
      title: 'Получить состояние гонки',
      description: 'Возвращает текущий этап, фазу, позицию, Целостность, арки и готовые способности Кары без изменения гонки.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return {
          stage: state.stageIndex + 1,
          phase: state.phase,
          position: playerPosition(),
          distance: distanceOf('player'),positionsPerLap:90,positionsPerArc:10,
          integrity: state.integrity,
          tempIntegrity: state.tempIntegrity,
          charges: state.charges,
          availableArcs: currentStage()?.arcs || [],
          rivals: Object.fromEntries(Object.keys(RIVAL_PROFILES).map(id => [id, {
            position: racerPosition(id),distance:distanceOf(id),gap:distanceOf(state.standings[0])-distanceOf(id),
            integrity: state.rivalIntegrity[id],
            resource: resourceStatus(id)
          }]))
        };
      }
    });
    register({
      name: 'configure_race_turn',
      title: 'Настроить ход экипажа',
      description: 'На фазе выбора задаёт темп, действие экипажа, арку, направление её энергии и способность Кары. Обновляет те же элементы, что видимый интерфейс.',
      inputSchema: {
        type: 'object',
        properties: {
          pace: { type: 'string', enum: ['careful', 'race', 'limit'] },
          support: { type: 'string', enum: ['scout', 'calm', 'brace', 'repair', 'ram', 'guard'] },
          arc: { type: 'string', enum: ['shield', 'sword', 'star', 'wing'] },
          arcMode: { type: 'string', enum: ['chariot', 'kara'] },
          ability: { type: ['string', 'null'], enum: ['speed', 'flight', 'light', 'ultimate', null] }
        },
        required: ['pace', 'support', 'arc', 'arcMode'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (state.phase !== 'choice') throw new Error('Настроить ход можно только на фазе выбора действий.');
        if (!currentStage().arcs.includes(input.arc)) throw new Error('Выбранная арка недоступна на текущем этапе.');
        if (input.ability && !state.charges[input.ability]) throw new Error('У выбранной способности Кары нет заряда.');
        state.selection = { pace: input.pace, support: input.support, arc: input.arc, arcMode: input.arcMode, ability: input.ability ?? null };
        saveState(); render();
        return { configured: true, selection: state.selection };
      }
    });
  }

  bindStaticControls();
  render();
  registerWebMCP();
})();
