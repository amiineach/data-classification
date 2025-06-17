import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from '../prisma/generated/clientPg'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }

  db = global.cachedPrisma;
}

export { db };
