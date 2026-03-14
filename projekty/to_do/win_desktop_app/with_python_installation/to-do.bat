
@echo off                                        & rem přemístí příkazový řádek do místa, kde je i tento to-do.bat soubor (prý pojistka, když by se .bat nespouštěl dvojklikem, kdy že se otevře příkazová řádek s umístěním, kde je i .bat, ale příkazem příkazového řádku vedoucím do jiného adresáře, než je v tu chvíli tento příkazový řádek, např. x:\adr1\...\to-do.bat, tehdy totiž by asi nefungovala relativní cesta příkazu "py main.py", neboť spuštěním .bat by se otevřel nový příkazový řádek, umístěný ve stejném místě, jako i ten, který jej spustil)
cd /d "%~dp0"                                    & rem spustí nový příkazový řádek v novém okně s popiskem "to-do list", okno minimalizuje, spustí příkaz "py main.py"
start "to-do list" /min py python_source.py
exit                                             & rem zavře současný příkazový řádek
