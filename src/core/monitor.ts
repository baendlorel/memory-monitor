import vscode from 'vscode';
import { getInterval, getTargets } from '@/lib/config.js';

const createMarkers = () => {
  const targets = getTargets();
  const interval = getInterval();

  const marker = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

  marker.text = '';
  marker.show();
  return marker;
};

export class Monitor extends vscode.Disposable {
  private markers: vscode.StatusBarItem[];
  private targets: MonitorTarget[];
  private interval: number;
  private timer: NodeJS.Timeout | null = null;
  constructor() {
    super(() => {});
    this.targets = getTargets();
    this.interval = getInterval();
    this.markers = this.targets.map((t) => {
      t.
    });
  }
}

export const marker = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
