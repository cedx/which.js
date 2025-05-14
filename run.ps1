#!/usr/bin/env pwsh
Set-StrictMode -Version Latest

$commandPath = Get-Item $PSCommandPath
$scriptRoot = $commandPath.LinkType ? (Split-Path $commandPath.LinkTarget) : $PSScriptRoot
& node "$scriptRoot/lib/Program.js" @args
