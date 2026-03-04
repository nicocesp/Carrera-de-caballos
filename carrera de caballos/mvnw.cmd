@REM Maven Wrapper - ejecuta Maven sin tenerlo en PATH
@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROP=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"
set "WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if not exist "%WRAPPER_JAR%" (
  echo Descargando Maven Wrapper...
  if not exist "%MAVEN_PROJECTBASEDIR%.mvn\wrapper" mkdir "%MAVEN_PROJECTBASEDIR%.mvn\wrapper"
  powershell -NoProfile -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%' -UseBasicParsing }"
  if errorlevel 1 (
    echo Error descargando Maven Wrapper. Comprueba tu conexion o instala Maven.
    exit /b 1
  )
)

if not defined JAVA_HOME (
  echo ERROR: JAVA_HOME no esta definido.
  exit /b 1
)

"%JAVA_HOME%\bin\java" -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
