import { hashPassword, PasswordService, PostgresUserDao, verifyPassword, changePasswordForUser } from "../src/untestable4.mjs";
import { expect } from "chai";

const conf = {
  user: "untestable",
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: "secret",
  port: process.env.PGPORT,
}

describe("Connecting to database", () => {
  let users;
  beforeEach(() => {
    users = new PostgresUserDao(conf);
  });

  afterEach(() => {
    users.close();
  });

  it("returns null with unfound username", async () => {
    const user = await users.getById(-1);
    expect(user).to.equal(null)
  });
});

describe("Retrieving user",() => {
  let users;
  let user;
  beforeEach(async () => {
    users = new PostgresUserDao(conf);
    await users.db.query("insert into users (user_id, password_hash) values (1, 'x')")
    user = await users.getById(1);
  });

  afterEach(async () => {
    await users.db.query("delete from users")
    users.close();
  });

  it("returns user from database", async () => {
    expect(user).to.not.equal(null)
  });

  it("returns id", async () => {
    expect(user.userId).to.equal(1)
  });

  it("returns hashed pw", async () => {
    expect(user.passwordHash).to.equal('x')
  });
});

describe("Saving user",() => {
  let users;
  const user = {userId: 1, passwordHash: "x"};
  beforeEach(async () => {
    users = new PostgresUserDao(conf);
    await users.save(user)
  });

  afterEach(async () => {
    await users.db.query("delete from users")
    users.close();
  });

  it("saves user to database correctly", async () => {
    const retrievedUser = await users.getById(1);
    expect(retrievedUser).to.deep.equal(user);
  });

  it("updates user", async () => {
    const updatedUser = {userId: 1, passwordHash: "z"};
    await users.save(updatedUser)
    const retrievedUser = await users.getById(1);
    expect(retrievedUser).to.deep.equal(updatedUser);
  });
});

describe("Hashing passwords",() => {

  it("verifies just hashed password", () => {
    const password = 'secret';
    const hash = hashPassword(password);
    expect(verifyPassword(hash, password)).to.be.true;
  });

});

describe("Changing passwords",() => {
  const oldPassword = "secret";
  const oldHash = hashPassword(oldPassword);
  let user;

  beforeEach(() => {
    user = {userId: 1, passwordHash: oldHash};
  });

  it("updates password with correct old password", () => {
    changePasswordForUser(user, oldPassword, "kanada");
    expect(user.passwordHash).not.to.equal(oldHash);
  });

  it("raises error with wrong old password", () => {
    expect(() => changePasswordForUser(user, "wrong", "kanada")).to.throw("wrong old password");
  });
 
});

describe("Using password service",() => {
  let users;
  afterEach(async () => {
    await users.db.query("delete from users")
    users.close();
  });

  it("updates password into database", async () => {
    users = new PostgresUserDao(conf);
    const service = new PasswordService(users);

    const oldPassword = "secret";
    const oldHash = hashPassword(oldPassword);

    const user = {userId: 1, passwordHash: oldHash};
    await users.save(user);

    await service.changePassword(1, "secret", "kanada");

    let updatedUser = await users.getById(1);
    expect(updatedUser.passwordHash).not.to.equal(oldHash);
  });
});