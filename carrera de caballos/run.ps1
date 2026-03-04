# Ejecutar Carreras de Caballos (JavaFX)
# Usa JDK 21 instalado o JAVA_HOME si esta definido

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Buscar JAVA_HOME si no esta definido
if (-not $env:JAVA_HOME) {
    $paths = @(
        "$env:ProgramFiles\Eclipse Adoptium\jdk-21*",
        "$env:ProgramFiles\Java\jdk-21*",
        "$env:ProgramFiles\Microsoft\jdk-21*",
        "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\jdk-21*"
    )
    foreach ($p in $paths) {
        $resolved = Get-Item $p -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($resolved -and (Test-Path "$($resolved.FullName)\bin\java.exe")) {
            $env:JAVA_HOME = $resolved.FullName
            Write-Host "Usando Java: $env:JAVA_HOME"
            break
        }
    }
}

if (-not $env:JAVA_HOME) {
    Write-Host "ERROR: Define JAVA_HOME o instala JDK 17+ desde https://adoptium.net/"
    exit 1
}

$jar = (Resolve-Path ".\.mvn\wrapper\maven-wrapper.jar" -ErrorAction SilentlyContinue).Path
if (-not $jar) {
    Write-Host "ERROR: No se encuentra .mvn\wrapper\maven-wrapper.jar"
    exit 1
}

$dir = (Get-Location).Path
& "$env:JAVA_HOME\bin\java.exe" -classpath $jar "-Dmaven.multiModuleProjectDirectory=$dir" org.apache.maven.wrapper.MavenWrapperMain compile javafx:run
