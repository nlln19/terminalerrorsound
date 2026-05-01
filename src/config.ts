// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';
import { EXTENSION_CONFIG_SECTION } from './constants';
import type { TriggerMode } from './types';

export function getExtensionConfig(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);
}

export function isTerminalErrorSoundEnabled(): boolean {
	return getExtensionConfig().get<boolean>('enabled', true);
}

export async function setTerminalErrorSoundEnabled(
	enabled: boolean
): Promise<void> {
	await getExtensionConfig().update(
		'enabled',
		enabled,
		vscode.ConfigurationTarget.Global
	);
}

export function getTriggerMode(): TriggerMode {
	const mode = getExtensionConfig().get<string>('triggerMode', 'both');

	if (mode === 'both' || mode === 'exitCode' || mode === 'patterns') {
		return mode;
	}

	return 'both';
}

export function shouldUseExitCodeTrigger(): boolean {
	const mode = getTriggerMode();

	return mode === 'both' || mode === 'exitCode';
}

export function shouldUsePatternTrigger(): boolean {
	const mode = getTriggerMode();

	return mode === 'both' || mode === 'patterns';
}