import vscode from 'vscode';

const dict = {
  未启动: 'Not running',
  匹配: 'Matched',
};

export const t = vscode.env.language.includes('zh')
  ? (key: keyof typeof dict, ...args: string[]): string => {
      let template = key as string;
      args.forEach((arg, index) => (template = template.replace(`{${index}}`, arg)));
      return template;
    }
  : (key: keyof typeof dict, ...args: string[]): string => {
      let template = dict[key] || key;
      args.forEach((arg, index) => (template = template.replace(`{${index}}`, arg)));
      return template;
    };
