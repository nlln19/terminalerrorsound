// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';
import { execFile } from 'child_process';
import type { ExecFileException } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

import {
	BUILT_IN_SOUNDS,
	DEFAULT_BUILT_IN_SOUND_ID
} from './constants';
import { getExtensionConfig } from './config';

let lastSoundAt = 0;
const SOUND_COOLDOWN_MS = 500;

let lastMissingSoundWarningAt = 0;
const MISSING_SOUND_WARNING_COOLDOWN_MS = 5000;

export async function playSound(
	context: vscode.ExtensionContext,
	customSoundPath?: string
): Promise<void> {
	const now = Date.now();

	if (now - lastSoundAt < SOUND_COOLDOWN_MS) {
		return;
	}

	const soundPath = customSoundPath ?? getSoundPath(context);

	if (!fs.existsSync(soundPath)) {
		await showMissingSoundWarning(context, soundPath);
		return;
	}

	lastSoundAt = now;

	try {
		if (process.platform === 'win32') {
			const escapedPath = soundPath.replace(/'/g, "''");

			await runCommand('powershell.exe', [
				'-NoProfile',
				'-ExecutionPolicy',
				'Bypass',
				'-Command',
				`$player = New-Object System.Media.SoundPlayer '${escapedPath}'; $player.PlaySync();`
			]);

			return;
		}

		if (process.platform === 'darwin') {
			await runCommand('afplay', [soundPath]);
			return;
		}

		await runFirstAvailable([
			['paplay', [soundPath]],
			['aplay', [soundPath]],
			['ffplay', ['-nodisp', '-autoexit', '-loglevel', 'quiet', soundPath]]
		]);
	} catch {
		vscode.window.showWarningMessage(
			'Could not play sound. On Linux, install paplay, aplay, or ffplay.'
		);
	}
}

export async function selectCustomSound(
	context: vscode.ExtensionContext
): Promise<void> {
	const selectedFiles = await vscode.window.showOpenDialog({
		canSelectFiles: true,
		canSelectFolders: false,
		canSelectMany: false,
		filters: {
			'WAV sound files': ['wav']
		},
		title: 'Import custom error sound'
	});

	if (!selectedFiles || selectedFiles.length === 0) {
		return;
	}

	const sourceUri = selectedFiles[0];

	const storageDir = vscode.Uri.joinPath(
		context.globalStorageUri,
		'sounds'
	);

	const targetUri = vscode.Uri.joinPath(
		storageDir,
		'custom-sound.wav'
	);

	try {
		await vscode.workspace.fs.createDirectory(storageDir);

		await vscode.workspace.fs.copy(sourceUri, targetUri, {
			overwrite: true
		});

		await getExtensionConfig().update(
			'soundPath',
			targetUri.fsPath,
			vscode.ConfigurationTarget.Global
		);

		vscode.window.showInformationMessage(
			'Custom sound imported successfully.'
		);

		await playSound(context, targetUri.fsPath);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);

		vscode.window.showErrorMessage(
			`Could not import custom sound: ${message}`
		);
	}
}

export async function resetCustomSound(
	context: vscode.ExtensionContext
): Promise<void> {
	const config = getExtensionConfig();

	await config.update(
		'soundPath',
		'',
		vscode.ConfigurationTarget.Global
	);

	await config.update(
		'builtInSound',
		DEFAULT_BUILT_IN_SOUND_ID,
		vscode.ConfigurationTarget.Global
	);

	const importedSoundUri = vscode.Uri.joinPath(
		context.globalStorageUri,
		'sounds',
		'custom-sound.wav'
	);

	try {
		await vscode.workspace.fs.delete(importedSoundUri, {
			useTrash: false
		});
	} catch {
		// Ignore if no custom sound was imported.
	}

	vscode.window.showInformationMessage(
		'Terminal Error Sound has been reset to the default sound: Fahh'
	);

	await playSound(context);
}

export async function chooseBuiltInSound(
	context: vscode.ExtensionContext
): Promise<void> {
	const selected = await vscode.window.showQuickPick(
		BUILT_IN_SOUNDS.map((sound) => ({
			label: sound.label,
			description: sound.description,
			sound
		})),
		{
			title: 'Choose Built-in Terminal Error Sound',
			placeHolder: 'Select a built-in sound'
		}
	);

	if (!selected) {
		return;
	}

	const config = getExtensionConfig();

	await config.update(
		'builtInSound',
		selected.sound.id,
		vscode.ConfigurationTarget.Global
	);

	await config.update(
		'soundPath',
		'',
		vscode.ConfigurationTarget.Global
	);

	vscode.window.showInformationMessage(
		`Built-in sound selected: ${selected.sound.label}`
	);

	await playSound(context);
}

function getSoundPath(context: vscode.ExtensionContext): string {
	const config = getExtensionConfig();

	const configuredPath = config.get<string>('soundPath', '').trim();

	if (configuredPath.length > 0) {
		return configuredPath;
	}

	const selectedBuiltInSound = config.get<string>(
		'builtInSound',
		DEFAULT_BUILT_IN_SOUND_ID
	);

	const sound =
		BUILT_IN_SOUNDS.find((item) => item.id === selectedBuiltInSound) ??
		BUILT_IN_SOUNDS[0];

	return path.join(context.extensionPath, 'media', sound.fileName);
}

async function showMissingSoundWarning(
	context: vscode.ExtensionContext,
	missingPath: string
): Promise<void> {
	const now = Date.now();

	if (now - lastMissingSoundWarningAt < MISSING_SOUND_WARNING_COOLDOWN_MS) {
		return;
	}

	lastMissingSoundWarningAt = now;

	const resetAction = 'Reset to Default';
	const importAction = 'Import Custom Sound';
	const chooseAction = 'Choose Built-in Sound';

	const selectedAction = await vscode.window.showWarningMessage(
		'The selected sound file could not be found.',
		{
			detail: `Missing file:\n${missingPath}`,
			modal: false
		},
		resetAction,
		importAction,
		chooseAction
	);

	if (selectedAction === resetAction) {
		await resetCustomSound(context);
		return;
	}

	if (selectedAction === importAction) {
		await selectCustomSound(context);
		return;
	}

	if (selectedAction === chooseAction) {
		await chooseBuiltInSound(context);
	}
}

function runCommand(command: string, args: string[]): Promise<void> {
	return new Promise((resolve, reject) => {
		execFile(
			command,
			args,
			{ windowsHide: true },
			(error: ExecFileException | null) => {
				if (error) {
					reject(error);
					return;
				}

				resolve();
			}
		);
	});
}

async function runFirstAvailable(
	commands: Array<[string, string[]]>
): Promise<void> {
	let lastError: unknown;

	for (const [command, args] of commands) {
		try {
			await runCommand(command, args);
			return;
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
}