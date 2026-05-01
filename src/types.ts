// Copyright (c) 2026 nlln19.
// Licensed under the MIT License. 
// See LICENSE file in the project root for details.

export type BuiltInSound = {
	id: string;
	label: string;
	description: string;
	fileName: string;
};

export type TriggerMode = 'both' | 'exitCode' | 'patterns';

export type TriggerModeItem = {
	id: TriggerMode;
	label: string;
	description: string;
};