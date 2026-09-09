# Sushi24 Digital Menu

MVP цифрового меню для телевизоров Sushi24.

## Что уже есть

- Только Sushi24, без мультибрендовой логики.
- Отдельный URL на каждую точку: `/screen/isani`, `/screen/chikobava`, `/screen/vazha`, `/screen/digomi`, `/screen/rustavi`, `/screen/tbilisi-mall`.
- Крупная горизонтальная навигация по категориям.
- Управление мышью/тачем и клавишами: `← →` категории, `↑ ↓` страницы товаров.
- Автоматическая пагинация длинных категорий в зависимости от размера экрана.
- Адаптация под 16:9, 4K, ultrawide и portrait.
- Автообновление меню раз в 60 секунд.
- Syrve Cloud API adapter с mock fallback.
- При ошибке обновления уже загруженное меню остаётся на экране.

## Syrve

Заполнить `.env.local` по примеру `.env.example`:

```env
SYRVE_BASE_URL=https://api-eu.syrve.live
SYRVE_API_LOGIN=...
SYRVE_EXTERNAL_MENU_ID=...
SYRVE_ORGANIZATIONS={"isani":"...","chikobava":"...","vazha":"...","digomi":"...","rustavi":"...","tbilisi-mall":"..."}
```

Если переменных нет, используется тестовое меню из `lib/mock-menu.ts`.

## Запуск

```bash
npm install
npm run dev
```

Открыть `http://localhost:3000/screen/isani`.

## Следующие этапы

1. Подключить реальные Sushi24 credentials / external menu id из текущей интеграции сайта.
2. Сверить реальные категории и изображения из Syrve.
3. Добавить web-админку порядка категорий, скрытия позиций и promo badges.
4. Добавить kiosk/fullscreen mode и автозапуск на медиаплеерах телевизоров.
