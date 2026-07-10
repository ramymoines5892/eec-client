@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

REM ============================================================
REM EEC — Sync from GitHub + Install + Run (Windows)
REM Usage: double-click, or run from CMD.
REM Configure PROJECT_DIR below to your local clone path.
REM ============================================================

REM Auto-detect: this script lives in <PROJECT_DIR>\scripts\windows\
for %%I in ("%~dp0..\..") do set "PROJECT_DIR=%%~fI"
set "BRANCH=main"
set "PORT=8080"
set "OPEN_URL=http://localhost:%PORT%/"
set "LOG_DIR=%PROJECT_DIR%\.sync-logs"

if not exist "%PROJECT_DIR%" (
  echo [ERROR] PROJECT_DIR not found: %PROJECT_DIR%
  echo Edit this file and set PROJECT_DIR to your local clone path.
  pause
  exit /b 1
)

cd /d "%PROJECT_DIR%" || (echo [ERROR] cd failed & pause & exit /b 1)
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "STAMP=%date:~-4%-%date:~-7,2%-%date:~-10,2%_%time:~0,2%-%time:~3,2%"
set "STAMP=%STAMP: =0%"
set "LOG=%LOG_DIR%\sync_%STAMP%.log"

echo ====== EEC Sync %STAMP% ====== > "%LOG%"

echo ====== [1/4] Pulling latest from GitHub (%BRANCH%) ======
git fetch origin >> "%LOG%" 2>&1
git pull --ff-only origin %BRANCH% >> "%LOG%" 2>&1
if errorlevel 1 (
  echo [WARN] git pull failed. Check %LOG%
) else (
  echo [OK] Git updated.
)

echo ====== [2/4] Checking dependencies ======
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
git diff HEAD@{1} HEAD --name-only 2>nul | findstr /I "package.json bun.lockb package-lock.json" >nul && set "NEED_INSTALL=1"

if "%NEED_INSTALL%"=="1" (
  echo Installing packages...
  where bun >nul 2>&1
  if !errorlevel!==0 (
    call bun install >> "%LOG%" 2>&1
  ) else (
    call npm install >> "%LOG%" 2>&1
  )
) else (
  echo [OK] Dependencies up to date.
)

REM If invoked with "pull-only", stop here (used by scheduled task).
if /I "%~1"=="pull-only" (
  echo ====== Pull-only mode complete. ======
  exit /b 0
)

echo ====== [3/4] Checking port %PORT% ======
netstat -ano | findstr :%PORT% >nul
if %errorlevel%==0 (
  echo Server already running on %OPEN_URL%
  start "" "%OPEN_URL%"
  exit /b 0
)

echo ====== [4/4] Starting dev server (hidden) ======
set "VBS=%TEMP%\eec-run-hidden.vbs"
where bun >nul 2>&1
if %errorlevel%==0 (
  set "RUN_CMD=bun run dev"
) else (
  set "RUN_CMD=npm run dev"
)
> "%VBS%" echo Set WshShell = CreateObject("WScript.Shell")
>> "%VBS%" echo WshShell.CurrentDirectory = "%PROJECT_DIR%"
>> "%VBS%" echo WshShell.Run "cmd /c " ^& Chr(34) ^& "%RUN_CMD% ^> """"%LOG_DIR%\dev-server.log"""" 2^>^&1" ^& Chr(34), 0, False
wscript "%VBS%"


REM Wait until the port is actually listening (up to ~60s), then open browser.
echo Waiting for server on port %PORT% ...
set /a _tries=0
:waitloop
timeout /t 1 /nobreak >nul
netstat -ano | findstr :%PORT% >nul
if %errorlevel%==0 goto :ready
set /a _tries+=1
if %_tries% LSS 60 goto :waitloop
echo [WARN] Server did not open port %PORT% within 60s. Check the "EEC Dev Server" window.
exit /b 1

:ready
start "" "%OPEN_URL%"
exit /b 0


