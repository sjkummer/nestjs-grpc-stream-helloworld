import {Injectable} from '@nestjs/common';
import {Logger} from "../logger/logger";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class EncryptService {

    hashPassword(plaintextPassword: string): string {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(plaintextPassword, salt);
        Logger.l.log(`plaintext: ${plaintextPassword}  hash: ${hash}`);
        return hash;
    }

    checkPassword(plaintextPassword: string, hash: string): boolean {
        Logger.l.log(`password: ${plaintextPassword} hash: ${hash}`);
        return bcrypt.compareSync(plaintextPassword, hash);

    }

    generateRandomToken(): string {
        return crypto.randomBytes(20).toString('hex');
    }

}
