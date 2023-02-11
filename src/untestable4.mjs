import argon2 from "@node-rs/argon2";
import pg from "pg";

/* 
The main thing making testing difficult here is the use of database. Again, as before, separating
the logic from the task of accessing the database itself will make things much easier. In particular,
most of the password logic can be separated from user retrieval.

The class PostgresUserDao uses the Singleton antipattern, which will be refactored away.

The database connection uses environment variables for the configuration. While safer and more flexible
for production use, for testing it can be better to include them as part of the testing setup to avoid
passing of .env files or other tricks.

With the refactorings, it is not obvious that the PasswordService class is fully needed anymore,
given that
*/

// export class PostgresUserDao {
//   static instance;

//   static getInstance() {
//     if (!this.instance) {
//       this.instance = new PostgresUserDao();
//     }
//     return this.instance;
//   }

//   db = new pg.Pool({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//   });

//   close() {
//     this.db.end();
//   }

//   rowToUser(row) {
//     return { userId: row.user_id, passwordHash: row.password_hash };
//   }

//   async getById(userId) {
//     const { rows } = await this.db.query(
//       `select user_id, password_hash
//        from users
//        where user_id = $1`,
//       [userId]
//     );
//     return rows.map(this.rowToUser)[0] || null;
//   }

//   async save(user) {
//     await this.db.query(
//       `insert into users (user_id, password_hash)
//        values ($1, $2)
//        on conflict (user_id) do update
//            set password_hash = excluded.password_hash`,
//       [user.userId, user.passwordHash]
//     );
//   }
// }

// export class PasswordService {
//   users = PostgresUserDao.getInstance();

//   async changePassword(userId, oldPassword, newPassword) {
//     const user = await this.users.getById(userId);
//     if (!argon2.verifySync(user.passwordHash, oldPassword)) {
//       throw new Error("wrong old password");
//     }
//     user.passwordHash = argon2.hashSync(newPassword);
//     await this.users.save(user);
//   }
// }

const defaultConf = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
}

export class PostgresUserDao {
  constructor (testingConf) {
    const conf = testingConf ?? defaultConf;
    this.db = new pg.Pool(conf);
  }

  close() {
    this.db.end();
  }

  rowToUser(row) {
    return { userId: row.user_id, passwordHash: row.password_hash };
  }

  async getById(userId) {
    const { rows } = await this.db.query(
      `select user_id, password_hash
       from users
       where user_id = $1`,
      [userId]
    );
    return rows.map(this.rowToUser)[0] || null;
  }

  async save(user) {
    await this.db.query(
      `insert into users (user_id, password_hash)
       values ($1, $2)
       on conflict (user_id) do update
           set password_hash = excluded.password_hash`,
      [user.userId, user.passwordHash]
    );
  }
}

export class PasswordService {
  constructor(users) {
    this.users = users;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.users.getById(userId);
    changePasswordForUser(user, oldPassword, newPassword);
    await this.users.save(user);
  }
}

export function changePasswordForUser(user, oldPassword, newPassword) {
  if (!verifyPassword(user.passwordHash, oldPassword)) {
    throw new Error("wrong old password");
  }
  user.passwordHash = hashPassword(newPassword)
}

export function verifyPassword(hash, password) {
  return argon2.verifySync(hash, password)
}

export function hashPassword(password) {
  return argon2.hashSync(password);
}

