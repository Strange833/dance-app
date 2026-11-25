@echo off
chcp 65001 >nul
setlocal

:: === НАСТРОЙКИ ===
:: Укажите API-ключ, созданный в панели OmniRoute (http://localhost:20128)
set "ANTHROPIC_AUTH_TOKEN=sk-f592c04f0b56f93c-2f1dc8-3fe103ae"

:: Базовый адрес OmniRoute (ВАЖНО: указывать без /v1 в конце)
set "ANTHROPIC_BASE_URL=http://localhost:20128/v1"

:: Опционально: принудительно задать модель или комбо из OmniRoute (например, auto/cheap или provider/model)
:: Раскомментируйте строку ниже, если хотите зафиксировать модель:
set "ANTHROPIC_MODEL=omniroute"

:: === ПРОВЕРКА И ЗАПУСК OMNIROUTE ===
:: Проверяем, занят ли порт 20128. Если шлюз не запущен — стартуем его в отдельном окне
netstat -ano | findstr ":20128 " | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [OmniRoute] Шлюз не запущен. Запускаю в отдельном окне...
    start "OmniRoute Gateway" cmd /c "omniroute"
    timeout /t 3 /nobreak >nul
)

:: === ЗАПУСК CLAUDE CODE ===
echo [Claude Code] Подключение через %ANTHROPIC_BASE_URL%...
claude %*

endlocal
