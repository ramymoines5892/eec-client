@echo off
REM ============================================================
REM Registers a Windows Scheduled Task that runs sync-and-run.bat
REM in "pull-only" mode every 3 days at 09:00.
REM Run this file ONCE, as Administrator.
REM ============================================================

set "SCRIPT=%~dp0sync-and-run.bat"
set "TASK_NAME=EEC_AutoSync_GitHub"

if not exist "%SCRIPT%" (
  echo [ERROR] Cannot find %SCRIPT%
  pause
  exit /b 1
)

echo Registering scheduled task "%TASK_NAME%"...
schtasks /Create /F ^
  /SC DAILY /MO 3 /ST 09:00 ^
  /TN "%TASK_NAME%" ^
  /TR "\"%SCRIPT%\" pull-only" ^
  /RL HIGHEST

if not %errorlevel%==0 (
  echo [ERROR] Failed to create scheduled task. Run this file as Administrator.
  pause
  exit /b 1
)

echo Enabling "Run as soon as possible after a missed start" ...
powershell -NoProfile -Command ^
  "$s = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -WakeToRun -ExecutionTimeLimit (New-TimeSpan -Hours 1);" ^
  "Set-ScheduledTask -TaskName '%TASK_NAME%' -Settings $s | Out-Null"

if %errorlevel%==0 (
  echo [OK] Task created. Runs every 3 days at 09:00.
  echo      If the PC was off/asleep, it will run automatically the next time it is on.
  echo Manage it in Task Scheduler under name: %TASK_NAME%
) else (
  echo [WARN] Task created but could not enable "StartWhenAvailable". Run as Administrator.
)

pause
