@echo off
chcp 65001 >nul
cd /d "f:\Video AI"
start "" "http://localhost:3050"
python tools\studio_app.py
