@echo off
echo ========================================
echo AlKahaf LMS - Database Setup
echo ========================================
echo.

REM Try common XAMPP installation paths
set MYSQL_PATH=""

if exist "C:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
) else if exist "D:\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="D:\xampp\mysql\bin\mysql.exe"
) else if exist "C:\Program Files\xampp\mysql\bin\mysql.exe" (
    set MYSQL_PATH="C:\Program Files\xampp\mysql\bin\mysql.exe"
)

if %MYSQL_PATH%=="" (
    echo ERROR: Could not find XAMPP MySQL installation
    echo Please make sure XAMPP is installed and MySQL is running
    echo.
    echo Manual Setup:
    echo 1. Open phpMyAdmin: http://localhost/phpmyadmin
    echo 2. Click on "SQL" tab
    echo 3. Run: CREATE DATABASE IF NOT EXISTS alkahaf_lms;
    pause
    exit /b 1
)

echo Found MySQL at: %MYSQL_PATH%
echo Creating database...
echo.

%MYSQL_PATH% -u root -e "CREATE DATABASE IF NOT EXISTS alkahaf_lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database 'alkahaf_lms' created successfully!
    echo.
    echo Next steps:
    echo 1. Run migrations: npm run migrate
    echo 2. Start server: npm run dev
    echo.
) else (
    echo.
    echo ERROR: Could not create database
    echo Please check if MySQL is running in XAMPP Control Panel
    echo.
)

pause