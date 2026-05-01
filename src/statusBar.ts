// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';

import {
	EXTENSION_CONFIG_SECTION
} from './constants';
import {
	getTriggerMode,
	isTerminalErrorSoundEnabled,
	setTerminalErrorSoundEnabled
} from './config';

let statusBarItem: vscode.StatusBarItem | undefined;

export function registerStatusBar(context: vscode.ExtensionContext): void {
	statusBarItem = vscode.window.createStatusBarItem(
		'terminalErrorSound.statusBar',
		vscode.StatusBarAlignment.Left,
		100
	);

	statusBarItem.name = 'Terminal Error Sound';
	statusBarItem.command = 'terminalErrorSound.toggleEnabled';

	context.subscriptions.push(statusBarItem);

	updateStatusBar();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((event) => {
			if (
				event.affectsConfiguration(`${EXTENSION_CONFIG_SECTION}.enabled`) ||
				event.affectsConfiguration(`${EXTENSION_CONFIG_SECTION}.triggerMode`)
			) {
				updateStatusBar();
			}
		})
	);
}

export async function toggleEnabled(): Promise<void> {
	const enabled = isTerminalErrorSoundEnabled();
	const newValue = !enabled;

	await setTerminalErrorSoundEnabled(newValue);

	updateStatusBar();

	vscode.window.showInformationMessage(
		`Terminal Error Sound ${newValue ? 'enabled' : 'disabled'}.`
	);
}

function updateStatusBar(): void {
	if (!statusBarItem) {
		return;
	}

	const enabled = isTerminalErrorSoundEnabled();
	const triggerMode = getTriggerMode();

	statusBarItem.text = enabled
		? '$(bell) Error Sound: On'
		: '$(bell) Error Sound: Off';

	statusBarItem.tooltip = enabled
		? `Terminal Error Sound is enabled.\nTrigger mode: ${triggerMode}\nClick to disable.`
		: `Terminal Error Sound is disabled.\nTrigger mode: ${triggerMode}\nClick to enable.`;

	statusBarItem.show();
}