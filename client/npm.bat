@echo off
set NODEJS_VERSION=12.14.0
set NODEJS_PREFIX=%CD%\.node\node-v%NODEJS_VERSION%-win-x64
set NODEJS_UNPACK=%CD%\.node
set NODEJS_URL=http://nodejs.org/dist/v%NODEJS_VERSION%/node-v%NODEJS_VERSION%-win-x64.zip
set LOG_FILE=node-wrapper.log
set ZIP=7za.exe
@rem ##########################################################################

set _NODE_JS_ZIP=%NODEJS_PREFIX%\..\node-v%NODEJS_VERSION%-win-x64.zip
set _NODE_JS_EXE=%NODEJS_PREFIX%\node.exe
set _NPM_EXE=%NODEJS_PREFIX%\npm.cmd

@rem We create the log file and Node's folder.
echo > %LOG_FILE%
if NOT EXIST "%NODEJS_PREFIX%" mkdir "%NODEJS_PREFIX%"

@rem ##########################################################################
@rem ### Check & install node.js
@rem ##########################################################################
if NOT EXIST %_NODE_JS_EXE%  (
	echo Downloading nodejs into %NODEJS_PREFIX%. Be patient, it can take several minutes.

	powershell wget %NODEJS_URL% -OutFile '%_NODE_JS_ZIP%' >> %LOG_FILE%
	echo Installing nodejs
    "%ZIP%" x -o"%NODEJS_UNPACK%" -y "%_NODE_JS_ZIP%" >> %LOG_FILE%

)

set TOOL=""

@rem ##########################################################################
@rem ### Guesses which tool to use
@rem ##########################################################################
call :guess_tool_name %*

if NOT %TOOL% == "" (
  SETLOCAL
  set "PATH=%PATH%;%NODEJS_PREFIX%;"
  if not EXIST %NODEJS_PREFIX%\%TOOL%.cmd (

    IF ERRORLEVEL 0 (
      echo Installing %TOOL%...
      "%_NPM_EXE%" install -g "%TOOL%" >> %LOG_FILE% 2>&1
      echo ... installed.
    )
  )

  %TOOL%.cmd %*
  ENDLOCAL
)

@rem ##########################################################################
:guess_tool_name

  set basename=
  for /F %%i in ("%~f0") do set basename=%%~ni

  if  "%basename%" == "node-wrapper" (
    if "x%~1" == "x" (
       echo No arguments passed.
       echo
       echo Usage: %~f0 [tool] [tool options]
       echo
       echo Examples:
       echo        %~f0 grunt watch
       echo        %~f0 brunch build
       echo
       echo You can also rename %~f0 to the name of your tool and then
       echo you won't need to pass the tool name in the command line
    ) else (
      set TOOL=%~1
      SHIFT
    )
  ) else (
    for /F %%i in ("%~f0") do set TOOL=%%~ni
  )
