// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import * as vscode from 'vscode';

import { DEFAULT_ERROR_PATTERNS } from './constants';
import {
	getExtensionConfig,
	isTerminalErrorSoundEnabled,
	shouldUseExitCodeTrigger,
	shouldUsePatternTrigger
} from './config';
import { playSound } from './soundManager';

const alertedExecutions = new WeakSet<vscode.TerminalShellExecution>();

export function registerTerminalMonitoring(
	context: vscode.ExtensionContext
): void {
	context.subscriptions.push(
		vscode.window.onDidStartTerminalShellExecution((event) => {
			void monitorTerminalOutput(event.execution, context);
		})
	);

	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution((event) => {
			if (!isTerminalErrorSoundEnabled()) {
				return;
			}

			if (!shouldUseExitCodeTrigger()) {
				return;
			}

			if (event.exitCode !== undefined && event.exitCode !== 0) {
				alertOnce(event.execution, context);
			}
		})
	);
}

async function monitorTerminalOutput(
	execution: vscode.TerminalShellExecution,
	context: vscode.ExtensionContext
): Promise<void> {
	if (!isTerminalErrorSoundEnabled()) {
		return;
	}

	if (!shouldUsePatternTrigger()) {
		return;
	}

	const patterns = getExtensionConfig().get<string[]>(
		'patterns',
		DEFAULT_ERROR_PATTERNS
	);

	const regex = createPatternRegex(patterns);

	if (!regex) {
		return;
	}

	let buffer = '';

	try {
		for await (const chunk of execution.read()) {
			buffer = stripAnsi(buffer + chunk).slice(-5000);

			if (regex.test(buffer)) {
				alertOnce(execution, context);
				break;
			}
		}
	} catch {
		// Ignore terminal stream errors.
	}
}

function alertOnce(
	execution: vscode.TerminalShellExecution,
	context: vscode.ExtensionContext
): void {
	if (alertedExecutions.has(execution)) {
		return;
	}

	alertedExecutions.add(execution);
	void playSound(context);
}

function createPatternRegex(patterns: string[]): RegExp | undefined {
	const cleanedPatterns = patterns
		.map((pattern) => pattern.trim())
		.filter((pattern) => pattern.length > 0);

	if (cleanedPatterns.length === 0) {
		return undefined;
	}

	try {
		return new RegExp(cleanedPatterns.join('|'), 'i');
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);

		vscode.window.showWarningMessage(
			`Invalid Terminal Error Sound pattern: ${message}`
		);

		return undefined;
	}
}

function stripAnsi(input: string): string {
	return input.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}