@echo off
title Team Task Manager API
cd /d "%~dp0backend"
echo Starting API on http://127.0.0.1:5000 ...
echo Keep this window open while you use the app.
echo.
npm start
pause
