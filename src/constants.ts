// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

import type { BuiltInSound, TriggerModeItem } from './types';

export const EXTENSION_CONFIG_SECTION = 'terminalErrorSound';

export const DEFAULT_BUILT_IN_SOUND_ID = 'fahh';

export const BUILT_IN_SOUNDS: BuiltInSound[] = [
	{
		id: 'fahh',
		label: 'Fahh',
		description: 'Fahh sound',
		fileName: 'fahh.wav'
	},
	{
		id: 'bruh',
		label: 'Bruh',
		description: 'Bruh sound',
		fileName: 'bruh.wav'
	},
	{
		id: 'fail',
		label: 'Fail',
		description: 'Fail error sound',
		fileName: 'fail.wav'
	},
	{
		id: 'ohmygod',
		label: 'Oh My God',
		description: 'Oh my god sound',
		fileName: 'ohmygod.wav'
	},
	{
		id: 'vineboom',
		label: 'Vine Boom',
		description: 'Vine boom sound',
		fileName: 'vineboom.wav'
	}
];

export const TRIGGER_MODES: TriggerModeItem[] = [
	{
		id: 'both',
		label: 'Both',
		description: 'Trigger on error patterns and failed commands'
	},
	{
		id: 'exitCode',
		label: 'Exit Code',
		description: 'Trigger only when a command exits with a non-zero exit code'
	},
	{
		id: 'patterns',
		label: 'Patterns',
		description: 'Trigger only when error text is detected in the terminal output'
	}
];

export const DEFAULT_ERROR_PATTERNS: string[] = [
	'\\berror\\b',
	'\\bfailed\\b',
	'\\bfailure\\b',
	'\\bexception\\b',
	'traceback',
	'panic:',
	'fatal:',
	'segmentation fault',
	'abort trap',
	'command not found',
	'not recognized as',
	'not found',
	'no such file or directory',
	'permission denied',
	'access denied',
	'cannot find',
	'module not found',
	'syntaxerror',
	'typeerror',
	'referenceerror',
	'npm err!',
	'die benennung .* wurde nicht als name',
	'der befehl .* ist entweder falsch geschrieben'
];