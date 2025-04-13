@echo off
title Starting Full Stack App

echo Launching Backend...
start cmd /k "cd server && npm install && npm run start"

timeout /t 2

echo Launching Frontend...
start cmd /k "cd client && npm install && npm run dev"

echo All systems starting... Open your browser at http://localhost:3000
