import vscode from 'vscode';
import { Monitor } from './core/monitor.js';

export const activate = async (context: vscode.ExtensionContext) => {
  context.subscriptions.push(new Monitor());
  if (__IS_DEV__) {
    vscode.window.showInformationMessage('Simple Launcher activated!');
  }
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
