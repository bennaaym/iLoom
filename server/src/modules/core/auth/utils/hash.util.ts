import {randomBytes, scrypt} from 'crypto';
import {promisify} from 'util';

export class HashingUtil {
  public static async hash(value: string, salt: string = '') {
    const _salt = salt || randomBytes(8).toString('hex');
    const hashBuffer = (await promisify(scrypt)(value, _salt, 32)) as Buffer;
    return `${hashBuffer.toString('hex')}.${_salt}`;
  }

  public static async compare(value: string, hashedSaltedValue: string) {
    const [, salt] = hashedSaltedValue.split('.');
    const hashedPassword = await HashingUtil.hash(value, salt);
    return hashedSaltedValue === hashedPassword;
  }
}
