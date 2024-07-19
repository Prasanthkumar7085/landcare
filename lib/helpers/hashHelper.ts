import * as bcrypt from 'bcrypt';

export class HashHelper {
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(password: string, hash: string) {
    const comparePassword =  await bcrypt.compare(password, hash)
    return comparePassword
  }
}