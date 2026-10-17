<div align="center">

# 💚 Qalta

### Личный кошелёк для учёта расходов

PWA · KZT · RU · без регистрации · всё в localStorage

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8?logo=pwa)](https://web.dev/progressive-web-apps)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**🚀 [Открыть приложение](https://qalta.vercel.app)** · **[GitHub](https://github.com/GangstaKZ/qalta)**

📱 Сканируй QR — откроется на телефоне:

<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fqalta.vercel.app" alt="QR to qalta.vercel.app" width="160" height="160">

</div>

---

## ✨ Возможности

| | |
|---|---|
| ⚡ **Быстрое добавление** | Сумма → категория → «Сохранить». Два касания до записи |
| 📊 **Дашборд** | Потрачено сегодня и остаток месячного бюджета с прогресс-баром |
| 🍩 **Аналитика** | Круговая диаграмма по категориям + топ трат, листание месяцев |
| 📖 **Лента** | Все операции, сгруппированные: Сегодня / Вчера / по датам |
| ✏️ **Редактирование** | Тап по строке — изменить или удалить операцию |
| 💰 **Бюджет** | Месячный лимит; спрашивается при первом запуске |
| 📴 **Offline** | Service worker кэширует оболочку — работает без сети |
| 🔒 **Приватность** | Нет аккаунта и сервера. Данные только в localStorage |

## 📦 Категории

Еда · Транспорт · Жильё · Кафе · Покупки · Здоровье · Развлечения · Связь · Подписки · Другое

## 🛠 Стек

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack)
- **[Tailwind CSS 4](https://tailwindcss.com)**
- **TypeScript**
- **localStorage** — без бэкенда
- **PWA** — manifest + service worker ( hand-rolled, 0 доп. зависимостей)

## 🚀 Локальная разработка

```bash
git clone https://github.com/GangstaKZ/qalta.git
cd qalta
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

## 📜 Скрипты

```bash
npm run dev     # dev-сервер
npm run build   # production-сборка
npm run start   # запуск production
npm run lint    # ESLint
npm run icons   # перегенерировать PWA-иконки
```

## 📁 Структура

```
qalta/
├── public/
│   ├── icons/               # PWA-иконки
│   ├── manifest.webmanifest
│   └── sw.js                # service worker
├── scripts/
│   └── generate-icons.mjs   # генератор иконок (без зависимостей)
└── src/
    ├── app/                 # страницы: /, /analytics, /settings
    ├── components/          # UI: Dashboard, Feed, DonutChart, Sheet…
    ├── hooks/               # useWallet
    └── lib/                 # types, storage, stats, format, date
```

## 💾 Данные

| Ключ | Что хранится |
|------|----------------|
| `qalta:v1:transactions` | Список операций |
| `qalta:v1:budget` | Месячный бюджет |
| `qalta:schemaVersion` | Версия схемы |

Суммы — целые тенге. Даты — локальный календарь `YYYY-MM-DD` (без сдвигов часовых поясов).

## 📄 Лицензия

MIT

---

<div align="center">
  <sub>Сделано с 💚 для одного человека · Qalta © 2026</sub>
</div>
