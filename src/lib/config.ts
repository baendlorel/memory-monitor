import type { ConfigName } from '@/types/global.js';
import type { MonitorTarget, MonitorTargetConfigItem } from '@/types/index.js';
import vscode from 'vscode';

const config = <T>(configName: ConfigName, defaultValue: T) => {
  const o = vscode.workspace.getConfiguration(__NAME__);
  return o.get<T>(configName, defaultValue);
};

const update = <T>(configName: ConfigName, value: T, configurationTarget = vscode.ConfigurationTarget.Workspace) =>
  vscode.workspace.getConfiguration(__NAME__).update(configName, value, configurationTarget);

const makeMatcher = (processName: string): ((name: string) => boolean) => {
  try {
    return new Function('a', `return (${processName})(a)`) as (name: string) => boolean;
  } catch {
    return (name) => name === processName;
  }
};

export const getTargets = (): MonitorTarget[] =>
  config<MonitorTargetConfigItem[]>('targets', []).map((t) => ({
    name: t.name,
    processName: makeMatcher(t.processName),
  }));

export const getInterval = () => config<number>('poll-interval', 3) * 1000;

export const saveTargets = (targets: MonitorTargetConfigItem[], configTarget?: vscode.ConfigurationTarget) =>
  update('targets', targets, configTarget);

export const saveInterval = (seconds: number, configTarget?: vscode.ConfigurationTarget) =>
  update('poll-interval', seconds, configTarget);
