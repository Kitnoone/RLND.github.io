# Сапфировая гонка

Полная копия версии 22 сайта https://sapphire-race-engine.kittyty.chatgpt.site/.
Исходный коммит: `35cd216ea607c7b6d64c37fd8db7265ddd9c6b05`.

## Запуск

Из папки `sapphire-race` запустите `python -m http.server 8080` и откройте http://localhost:8080/dist/ . Сборка и npm не требуются.

## Состав

`dist/` содержит сайт и все ресурсы, включая звуковой движок Web Audio, карты, токены, эффекты и сохранённые варианты анимаций. `rules/` содержит каноничные правила и тестовые трактовки недописанных условий. `tests/` содержит проверки механик, экипажа, дистанций и анимаций. `CREW-v18.md` описывает импорт персонажей.

## Проверки

```sh
node tests/canon-v22.mjs
node tests/rules-v9.mjs
node tests/crew-v18.mjs
node tests/distance-v11.mjs
node tests/animations-v10.mjs
```

Прогресс гонки хранится в localStorage браузера; пользовательские сохранения не включены в перенос.

В репозитории оставлена только Сапфировая гонка. При публикации корня main через GitHub Pages входная страница гонки находится в `/RLND.github.io/sapphire-race/`.
