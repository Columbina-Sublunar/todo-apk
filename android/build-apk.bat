@echo off
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
set ANDROID_HOME=C:\Users\min\Android
set PATH=%JAVA_HOME%\bin;%PATH%

echo Building APK...
call gradlew.bat assembleDebug
echo Build complete.
echo APK location: app\build\outputs\apk\debug\
dir app\build\outputs\apk\debug\*.apk
