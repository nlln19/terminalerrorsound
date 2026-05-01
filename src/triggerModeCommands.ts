// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';

import { TRIGGER_MODES } from './constants';
import { getExtensionConfig } from './config';

export async function chooseTriggerMode(): Promise<void> {
	const selected = await vscode.window.showQuickPick(
		TRIGGER_MODES.map((mode) => ({
			label: mode.label,
			description: mode.description,
			mode
		})),
		{
			title: 'Choose Terminal Error Sound Trigger Mode',
			placeHolder: 'Select when the sound should be played'
		}
	);

	if (!selected) {
		return;
	}

	await getExtensionConfig().update(
		'triggerMode',
		selected.mode.id,
		vscode.ConfigurationTarget.Global
	);

	vscode.window.showInformationMessage(
		`Terminal Error Sound trigger mode selected: ${selected.mode.label}`
	);
}