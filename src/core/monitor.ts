import type { MonitorTarget } from '@/types/index.js';
import vscode from 'vscode';
import { getMemoryUsage, MemoryUsage } from 'mem-usage-ts';
import { getInterval, getTargets } from '@/lib/config.js';
import { t } from '@/lib/l10n.js';
import { formatBytes } from '@/lib/native';

const TOGGLE_TARGET_COMMAND = 'memory-monitor.toggleTarget';

export class Monitor extends vscode.Disposable {
  private targets: MonitorTarget[];
  private interval: number;

  private markers: vscode.StatusBarItem[];
  private toggleTargetCommand: vscode.Disposable;

  private timer: number | null = null;
  private usages: MemoryUsage[] = [];

  constructor() {
    super(() => {});
    this.targets = getTargets();
    this.interval = getInterval();

    this.markers = this.targets.map((t) => {
      const marker = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      marker.text = t.name;
      marker.show();
      return marker;
    });

    this.toggleTargetCommand = vscode.commands.registerCommand(TOGGLE_TARGET_COMMAND, (index: number) => {
      const target = this.targets[index];
      if (!target) {
        return;
      }

      target.active = !target.active;
      this.refreshMarker(index);
    });

    this.markers.forEach((marker, index) => {
      marker.command = {
        command: TOGGLE_TARGET_COMMAND,
        title: 'Toggle monitor target',
        arguments: [index],
      };
      this.refreshMarker(index);
    });

    const cb = () => {
      this.usages = getMemoryUsage();
      this.markers.forEach((_, index) => this.refreshMarker(index));
      this.timer = window.setTimeout(cb, this.interval);
    };

    cb();
  }

  private refreshMarker(index: number) {
    const marker = this.markers[index];
    const target = this.targets[index];

    if (!marker || !target) {
      return;
    }

    marker.color = target.active ? undefined : new vscode.ThemeColor('disabledForeground');

    if (!target.active) {
      marker.text = `${target.name}: Off`;
      marker.tooltip = `${target.name}\nClick to enable monitoring`;
      return;
    }

    const usageList = this.usages.filter((u) => target.processName(u.processName));
    const usage = formatBytes(usageList.reduce((prev, cur) => (prev += cur.privateMemory ?? cur.memory), 0));

    marker.tooltip = `${target.name}\nClick to disable monitoring`;

    if (usageList.length === 1) {
      marker.text = `${target.name}: ${usage}`;
      return;
    }

    if (usageList.length === 0) {
      marker.text = `${target.name}: N/A`;
      return;
    }

    marker.text = `${target.name}(${usageList.length} ${t('匹配')}): ${usage}`;
  }

  dispose() {
    this.markers.forEach((m) => m.dispose());
    this.toggleTargetCommand.dispose();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
