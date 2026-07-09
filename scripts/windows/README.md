# EEC — Windows Sync Scripts

أدوات محلية لسحب الكود من GitHub وتشغيل المشروع على جهازك.

## الملفات

| الملف | الغرض |
|---|---|
| `sync-and-run.bat` | يسحب آخر كود من GitHub، يثبّت الـ packages لو محتاج، ويشغّل السيرفر على `http://localhost:8080`. |
| `install-auto-sync-task.bat` | يسجّل مهمة Windows تلقائية تسحب الكود كل 3 أيام الساعة 9 صباحاً (بدون تشغيل السيرفر). |

## متطلبات لمرة واحدة

1. ثبّت **Git for Windows**: <https://git-scm.com/download/win>
2. ثبّت **Node.js LTS** (أو **Bun** لو تفضّله): <https://nodejs.org>
3. اعمل clone للمستودع أول مرة:
   ```cmd
   git clone https://github.com/ramymoines5892/eec-client.git "D:\eec code\eec-client"
   ```
4. افتح `sync-and-run.bat` وعدّل السطر:
   ```
   set "PROJECT_DIR=D:\eec code\eec-client"
   ```
   ليطابق المسار عندك.

## الاستخدام اليدوي

- **سحب + تشغيل**: دبل كليك على `sync-and-run.bat`
- **سحب فقط**: من CMD:
  ```cmd
  sync-and-run.bat pull-only
  ```

## تفعيل السحب الأوتوماتيكي كل 3 أيام

1. كليك يمين على `install-auto-sync-task.bat` → **Run as administrator**
2. المهمة هتتسجّل باسم `EEC_AutoSync_GitHub` في Windows Task Scheduler.
3. لإلغائها لاحقاً:
   ```cmd
   schtasks /Delete /TN "EEC_AutoSync_GitHub" /F
   ```

## اللوجات

كل عملية سحب بتتسجّل في `.sync-logs/` جوّه مجلد المشروع.
