; ==========================================================
; ControlHub Installer
; Version 1.0
; ==========================================================

#define MyAppName "ControlHub Agent"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Sandeep Thakor"

[Setup]

AppId={{D8E8A6F2-69A1-4B77-B8D5-3DDB5A5A4C7F}

AppName={#MyAppName}

AppVersion={#MyAppVersion}

AppPublisher={#MyAppPublisher}

DefaultDirName={autopf}\ControlHub

DefaultGroupName=ControlHub

OutputDir=..\release

OutputBaseFilename=ControlHubSetup

Compression=lzma2

SolidCompression=yes

WizardStyle=modern

PrivilegesRequired=admin

ArchitecturesInstallIn64BitMode=x64

DisableProgramGroupPage=yes

DisableDirPage=no

DisableReadyMemo=no

CreateUninstallRegKey=yes

UninstallDisplayIcon={app}\agent.exe

; Remove this line if you don't have a logo yet


[Languages]

Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]

Name: "desktopicon"; Description: "Create Desktop Shortcut"; GroupDescription: "Additional Icons:"; Flags: unchecked

[Files]

Source: "..\release\agent.exe"; DestDir: "{app}"; Flags: ignoreversion

Source: "..\release\ControlHubService.exe"; DestDir: "{app}"; Flags: ignoreversion

Source: "..\release\ControlHubService.xml"; DestDir: "{app}"; Flags: ignoreversion

[Icons]

Name: "{group}\ControlHub Agent"; Filename: "{app}\agent.exe"

Name: "{autodesktop}\ControlHub Agent"; Filename: "{app}\agent.exe"; Tasks: desktopicon

[Run]

Filename: "{app}\ControlHubService.exe"; \
Parameters: "install"; \
StatusMsg: "Installing Windows Service..."; \
Flags: runhidden waituntilterminated

Filename: "{app}\ControlHubService.exe"; \
Parameters: "start"; \
StatusMsg: "Starting ControlHub Agent..."; \
Flags: runhidden waituntilterminated

[UninstallRun]

Filename: "{app}\ControlHubService.exe"; \
Parameters: "stop"; \
Flags: runhidden waituntilterminated skipifdoesntexist

Filename: "{app}\ControlHubService.exe"; \
Parameters: "uninstall"; \
Flags: runhidden waituntilterminated skipifdoesntexist