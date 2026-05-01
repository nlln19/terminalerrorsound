// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';

import { registerStatusBar, toggleEnabled } from './statusBar';
import {
	chooseBuiltInSound,
	playSound,
	resetCustomSound,
	selectCustomSound
} from './soundManager';
import { registerTerminalMonitoring } from './terminalMonitor';
import { chooseTriggerMode } from './triggerModeCommands';

export function activate(context: vscode.ExtensionContext): void {
	registerStatusBar(context);
	registerCommands(context);
	registerTerminalMonitoring(context);
}

export function deactivate(): void {}

function registerCommands(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand('terminalErrorSound.testSound', () => {
			void playSound(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('terminalErrorSound.selectSound', async () => {
			await selectCustomSound(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('terminalErrorSound.resetSound', async () => {
			await resetCustomSound(context);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'terminalErrorSound.chooseBuiltInSound',
			async () => {
				await chooseBuiltInSound(context);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('terminalErrorSound.toggleEnabled', async () => {
			await toggleEnabled();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'terminalErrorSound.chooseTriggerMode',
			async () => {
				await chooseTriggerMode();
			}
		)
	);
}