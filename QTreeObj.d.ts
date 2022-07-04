interface MenuItem {
  target: any;
  text: string | (() => string);
  callback: (menuItem) => void;
}
interface Options {
  formated?: boolean;
  fileNameStr?: string;
  defaultGroupLabelName?: string;
}

declare class QTreeObj {
  constructor(data: string[], opts: Options)
  static parsePathStr: (s: string, d?: Record<string, any>) => any;
  static addGroup: (s: string, str?: 2) => boolean;
  static removeGroup: (s: string) => boolean;
  static renameGroup: (s: string, str?: string) => boolean;
  static addToDir: (s: string, str: string) => boolean;
  static removeFromDir: (s: string, str: string) => boolean;
  static removeByName: (s: string) => boolean;
  static rename: (s: string, str: string) => boolean;
}