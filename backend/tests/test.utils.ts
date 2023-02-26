import { User } from "@prisma/client";
import Password from "../src/utils/password";
import { getUserToken } from "../src/utils/jwt";

export class TestUtils {
  plainPassword: string = "pass123";
  user: User = {
    email: "testmail@gmail.com",
    id: 1,
    name: "testuser",
    passwordHash: "",
  };
  tokenHeader: { [key: string]: string };
  constructor() {
    Password.getPasswordHash(this.plainPassword).then(
      (hash) => (this.user.passwordHash = hash)
    );
  }
  getAuthHeaderUser = () => ({
    ["x-access-token"]: getUserToken(this.user),
  });
}

export default new TestUtils();
