import type { MonitorTarget } from '@/types/index.js';
import vscode from 'vscode';
import { getMemoryUsage, MemoryUsage } from 'mem-usage-ts';
import { getInterval, getTargets } from '@/lib/config.js';
import { t } from '@/lib/l10n.js';
import { formatBytes } from '@/lib/native';

export class Monitor extends vscode.Disposable {
  private targets: MonitorTarget[];
  private interval: number;

  private markers: vscode.StatusBarItem[];

  private timer: number | null = null;
  private usages: MemoryUsage[] = [];

  constructor() {
    super(() => {});
    this.targets = getTargets();
    this.interval = getInterval();

    this.markers = this.targets.map((t) => {
      const marker = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      marker.text = t.name;
      marker.tooltip = `Monitoring process: ${t.processName}`;
      marker.show();
      return marker;
    });

    const updateMarker = (marker: vscode.StatusBarItem, index: number) => {
      const target = this.targets[index];
      const usageList = this.usages.filter((u) => target.processName(u.processName));
      const usage = formatBytes(usageList.reduce((prev, cur) => (prev += cur.privateMemory ?? cur.memory), 0));

      if (usageList.length === 1) {
        marker.text = `${target.name}: ${usage}`;
      } else if (usageList.length === 0) {
        marker.text = `${target.name}: N/A`;
      } else {
        marker.text = `${target.name}(${usageList.length} ${t('匹配')}): ${usage}`;
      }
    };

    const cb = () => {
      this.usages = getMemoryUsage();
      this.markers.forEach(updateMarker);
      this.timer = window.setTimeout(cb, this.interval);
    };

    cb();
  }

  dispose() {
    this.markers.forEach((m) => m.dispose());
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const marker = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
