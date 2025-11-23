import { drizzle } from "drizzle-orm/d1";
import * as schema from "../db/schema";

export interface Env {
  DB: D1Database;
}

export const getDb = (env: Env | any) => {
  return drizzle(env.DB, { schema });
};
