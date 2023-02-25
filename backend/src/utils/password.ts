import bcrypt from "bcrypt";

class Password {
  saltRounds: number;
  constructor() {
    this.saltRounds = process.env.SALT_ROUNDS
      ? parseInt(process.env.SALT_ROUNDS)
      : 10;
  }
  async getPasswordHash(pass: string) {
    // const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(pass, this.saltRounds);
    return hash;
  }
  async comparePasswords(pass: string, hashToCompare: string) {
    try {
      const checkResult = await bcrypt.compare(pass, hashToCompare);
      return checkResult;
    } catch (err) {
      return err;
    }
  }
}

export default new Password();
