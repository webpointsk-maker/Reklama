@echo off
chcp 65001 >nul
title Fitness trener - vyvojovy server
cd /d "%~dp0"

rem Node nemusi byt v PATH v kazdom terminali - pridame ho natvrdo.
if exist "C:\Program Files\nodejs\npm.cmd" set "PATH=C:\Program Files\nodejs;%PATH%"

echo.
echo   Fitness trener - spustam vyvojovy server
echo   ------------------------------------------------
echo   Stranka sa o chvilu sama otvori v prehliadaci.
echo   Bezi na porte 3001, takze moze bezat sucasne
echo   s WebPointom na porte 3000.
echo.
echo   TOTO OKNO NECHAJ OTVORENE. Ked ho zavries,
echo   stranka prestane fungovat.
echo   ------------------------------------------------
echo.

if not exist "node_modules" (
  echo   Chybaju zavislosti, instalujem... ^(chvilu to potrva^)
  echo.
  call npm install --no-audit --no-fund
  echo.
)

rem Prehliadac otvorime az ked server nabehne.
start "" cmd /c "timeout /t 8 >nul & start """" http://localhost:3001"

call npm run dev

echo.
echo   Server sa ukoncil. Okno mozes zavriet.
pause >nul
