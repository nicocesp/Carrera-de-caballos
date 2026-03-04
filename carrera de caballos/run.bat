@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not defined JAVA_HOME (
  echo Buscando JDK...
  for %%D in (
    "%ProgramFiles%\Java\jdk*"
    "%ProgramFiles%\Eclipse Adoptium\jdk*"
    "%ProgramFiles%\Microsoft\jdk*"
    "%ProgramFiles%\Amazon Corretto\jdk*"
    "%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk*"
    "%LOCALAPPDATA%\Programs\Microsoft\jdk*"
  ) do if exist "%%~D\bin\java.exe" (set "JAVA_HOME=%%~D" & goto :found)
  echo ERROR: Define JAVA_HOME con la ruta de tu JDK 17+
  echo O instala JDK 17+ desde https://adoptium.net/
  pause
  exit /b 1
  :found
  echo Usando Java: %JAVA_HOME%
)

set "WRAPPER_JAR=.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if not exist "%WRAPPER_JAR%" (
  echo Descargando Maven Wrapper...
  if not exist ".mvn\wrapper" mkdir ".mvn\wrapper"
  powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%' -UseBasicParsing"
  if errorlevel 1 (
    echo No se pudo descargar. Ejecuta manualmente: mvn compile javafx:run
    pause
    exit /b 1
  )
)

echo Compilando y ejecutando Carreras de Caballos...
"%JAVA_HOME%\bin\java" -cp "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%CD%" org.apache.maven.wrapper.MavenWrapperMain compile javafx:run
if errorlevel 1 (
  echo.
  echo Si falla, instala Maven y ejecuta: mvn compile javafx:run
  pause
  exit /b 1
)
pause
