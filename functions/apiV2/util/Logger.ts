import { inspect } from 'util';
import config from '../../../config/appConfig';

export class Logger {
  protected _methodName: string;

  constructor (
    protected _className: string = ''
  ) {}

  public in (methodName: string): Logger {
    let o = new Logger(this._className);
    o._methodName = methodName;
    return o;
  }

  public log (msg: any) {
    let prefix = (this._methodName ?
      `${this._className}.${this._methodName}` :
      `${this._className}`);
    Logger.log(msg, prefix);
  }

  public static log (msg: any, prefix?: string) {
    const colors = config.isLocal;
    if (typeof msg !== 'string') {
      msg = inspect(msg, { depth: null, colors: colors });
    }
    if (prefix !== undefined) {
      colors
        ? console.log(`\x1b[33m[${prefix}]\x1b[0m ${msg}`)
        : console.log(`[${prefix}] ${msg}`);
    } else {
      console.log(msg);
    }
  }
}