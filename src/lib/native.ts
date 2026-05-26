import vscode from 'vscode';
import { inspect } from 'node:util';

export const $info = vscode.window.showInformationMessage;
export const $err = vscode.window.showErrorMessage;

/**
 * Returns a `null` value after showing the error message, so it can be used in `await` expressions without needing to explicitly return `null`.
 */
export const errPop = (err: Error) => ($err(inspect(err)), null);

const textDecoder = new TextDecoder();
export const readFileText = async (uri: vscode.Uri): Promise<string | null> => {
  try {
    const t = await vscode.workspace.fs.readFile(uri);
    return textDecoder.decode(t);
  } catch {
    return null;
  }
};

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }

  if (bytes < KB) {
    return bytes + ' B';
  } else if (bytes < MB) {
    return (bytes / KB).toFixed(2) + ' KB';
  } else if (bytes < GB) {
    return (bytes / MB).toFixed(2) + ' MB';
  } else if (bytes < TB) {
    return (bytes / GB).toFixed(2) + ' GB';
  } else {
    return (bytes / TB).toFixed(2) + ' TB';
  }
};
