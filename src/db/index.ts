import fs from "fs";
import path from "path";
import crypto from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const DATA_FILE = path.join(process.cwd(), ".trueself-data.json");

export interface DatabaseData {
  reports: any[];
  plan_progress: any[];
  personal_notes: any[];
  daily_checkins: any[];
  friend_perspectives: any[];
  friend_invitations: any[];
  values_compass: any[];
  report_counters: any[];
}

function loadData(): DatabaseData {
  const initial: DatabaseData = {
    reports: [],
    plan_progress: [],
    personal_notes: [],
    daily_checkins: [],
    friend_perspectives: [],
    friend_invitations: [],
    values_compass: [],
    report_counters: [],
  };

  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return { ...initial, ...JSON.parse(content) };
    }
  } catch (err) {
    console.warn("[Trueself Storage] Could not read storage file, initializing empty:", err);
  }
  return initial;
}

export class LocalStore {
  public data: DatabaseData;

  constructor() {
    this.data = loadData();
  }

  public save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.warn("[Trueself Storage] Failed to save local data:", err);
    }
  }

  private getTableName(table: any): string {
    return (
      table?.[Symbol.for("drizzle:Name")] ||
      table?._?.name ||
      table?.name ||
      "reports"
    );
  }

  private getColName(col: any): string {
    if (typeof col === "string") return col;
    return col?.name || col?.config?.name || "";
  }

  private extractConditions(cond: any): Array<{ col: string; val: any }> {
    const result: Array<{ col: string; val: any }> = [];
    if (!cond || !cond.queryChunks) return result;
    const chunks = cond.queryChunks;
    for (let i = 0; i < chunks.length; i++) {
      const ch = chunks[i];
      if (ch && (ch.name || ch.config?.name) && chunks[i + 2] && "value" in chunks[i + 2]) {
        result.push({ col: ch.name || ch.config?.name, val: chunks[i + 2].value });
      } else if (ch && ch.queryChunks) {
        result.push(...this.extractConditions(ch));
      }
    }
    return result;
  }

  private recordMatches(record: any, conditions: Array<{ col: string; val: any }>): boolean {
    if (!conditions.length) return true;
    return conditions.every(({ col, val }) => {
      const colNorm = col.toLowerCase().replace(/_/g, "");
      const entry = Object.entries(record).find(
        ([k]) => k.toLowerCase().replace(/_/g, "") === colNorm
      );
      const recordVal = entry ? entry[1] : undefined;
      return String(recordVal) === String(val);
    });
  }

  public insert(table: any) {
    const tableName = this.getTableName(table);
    if (!this.data[tableName as keyof DatabaseData]) {
      this.data[tableName as keyof DatabaseData] = [];
    }
    const list = this.data[tableName as keyof DatabaseData];

    return {
      values: (val: any) => {
        const rowsToInsert = Array.isArray(val) ? val : [val];
        let onConflict: any = null;

        const execute = () => {
          const inserted: any[] = [];
          for (const rawRow of rowsToInsert) {
            const row = { ...rawRow };
            if (!row.id && tableName !== "report_counters") {
              row.id = crypto.randomUUID();
            }
            if (!row.createdAt && !row.created_at && tableName !== "report_counters") {
              row.createdAt = new Date().toISOString();
            }
            if (!row.updatedAt && !row.updated_at && tableName !== "report_counters") {
              row.updatedAt = new Date().toISOString();
            }

            if (onConflict && onConflict.target) {
              const targetCol = this.getColName(onConflict.target);
              const targetVal = row[targetCol] || row["anonymousId"] || row["anonymous_id"];
              const existingIdx = list.findIndex((r) =>
                this.recordMatches(r, [{ col: targetCol, val: targetVal }])
              );
              if (existingIdx !== -1) {
                const existing = list[existingIdx];
                if (tableName === "report_counters") {
                  existing.totalReports = (existing.totalReports || 0) + 1;
                } else if (typeof onConflict.set === "object") {
                  Object.assign(existing, onConflict.set);
                }
                inserted.push(existing);
                continue;
              }
            }

            list.push(row);
            inserted.push(row);
          }
          this.save();
          return inserted;
        };

        return {
          onConflictDoUpdate: (config: any) => {
            onConflict = config;
            return {
              then: (resolve: any, reject: any) => {
                try {
                  resolve(execute());
                } catch (e) {
                  reject ? reject(e) : null;
                }
              },
            };
          },
          returning: (fields?: any) => ({
            then: (resolve: any, reject: any) => {
              try {
                resolve(execute());
              } catch (e) {
                reject ? reject(e) : null;
              }
            },
          }),
          then: (resolve: any, reject: any) => {
            try {
              resolve(execute());
            } catch (e) {
              reject ? reject(e) : null;
            }
          },
        };
      },
    };
  }

  public select(fields?: any) {
    let tableName = "";
    let conditions: Array<{ col: string; val: any }> = [];
    let limitCount: number | null = null;
    let orderDesc = false;

    const execute = () => {
      let records = [...(this.data[tableName as keyof DatabaseData] || [])];
      if (conditions.length) {
        records = records.filter((r) => this.recordMatches(r, conditions));
      }
      if (orderDesc) {
        records.reverse();
      }
      if (limitCount !== null) {
        records = records.slice(0, limitCount);
      }
      if (fields && typeof fields === "object" && !Array.isArray(fields)) {
        const keys = Object.keys(fields);
        records = records.map((r) => {
          const res: any = {};
          for (const k of keys) {
            const colNorm = k.toLowerCase().replace(/_/g, "");
            const entry = Object.entries(r).find(
              ([rk]) => rk.toLowerCase().replace(/_/g, "") === colNorm
            );
            res[k] = entry ? entry[1] : undefined;
          }
          return res;
        });
      }
      return records;
    };

    const query = {
      from: (table: any) => {
        tableName = this.getTableName(table);
        return query;
      },
      where: (cond: any) => {
        conditions = this.extractConditions(cond);
        return query;
      },
      orderBy: () => {
        orderDesc = true;
        return query;
      },
      limit: (n: number) => {
        limitCount = n;
        return query;
      },
      then: (resolve: any, reject: any) => {
        try {
          resolve(execute());
        } catch (e) {
          reject ? reject(e) : null;
        }
      },
    };

    return query;
  }

  public update(table: any) {
    const tableName = this.getTableName(table);
    const list = this.data[tableName as keyof DatabaseData] || [];
    let updateValues: any = {};
    let conditions: Array<{ col: string; val: any }> = [];

    const execute = () => {
      const updated: any[] = [];
      for (const r of list) {
        if (this.recordMatches(r, conditions)) {
          Object.assign(r, updateValues, { updatedAt: new Date().toISOString() });
          updated.push(r);
        }
      }
      this.save();
      return updated;
    };

    return {
      set: (values: any) => {
        updateValues = values;
        return {
          where: (cond: any) => {
            conditions = this.extractConditions(cond);
            return {
              returning: (fields?: any) => ({
                then: (resolve: any, reject: any) => {
                  try {
                    resolve(execute());
                  } catch (e) {
                    reject ? reject(e) : null;
                  }
                },
              }),
              then: (resolve: any, reject: any) => {
                try {
                  resolve(execute());
                } catch (e) {
                  reject ? reject(e) : null;
                }
              },
            };
          },
        };
      },
    };
  }

  public delete(table: any) {
    const tableName = this.getTableName(table);
    let conditions: Array<{ col: string; val: any }> = [];

    const execute = () => {
      if (this.data[tableName as keyof DatabaseData]) {
        this.data[tableName as keyof DatabaseData] = (
          this.data[tableName as keyof DatabaseData] as any[]
        ).filter((r) => !this.recordMatches(r, conditions));
        this.save();
      }
      return { ok: true };
    };

    return {
      where: (cond: any) => {
        conditions = this.extractConditions(cond);
        return {
          then: (resolve: any, reject: any) => {
            try {
              resolve(execute());
            } catch (e) {
              reject ? reject(e) : null;
            }
          },
        };
      },
    };
  }

  public async execute() {
    return { rows: [{ ok: 1 }] };
  }
}

const databaseUrl = process.env.DATABASE_URL;

function isConnectionError(err: any): boolean {
  if (!err) return false;

  const check = (e: any): boolean => {
    if (!e) return false;
    const msg = (e.message || String(e) || "").toLowerCase();
    const code = (e.code || "").toString().toLowerCase();
    const syscall = (e.syscall || "").toString().toLowerCase();
    const name = (e.name || "").toString().toLowerCase();

    if (
      code === "econnrefused" ||
      code === "etimedout" ||
      code === "enotfound" ||
      code === "ehostunreach" ||
      code === "28p01" ||
      code === "3d000" ||
      code === "42p01" ||
      syscall === "connect" ||
      msg.includes("econnrefused") ||
      msg.includes("connection refused") ||
      msg.includes("failed query") ||
      msg.includes("failed to connect") ||
      msg.includes("timeout") ||
      msg.includes("password authentication failed") ||
      msg.includes("does not exist") ||
      msg.includes("socket") ||
      name.includes("drizzleerror")
    ) {
      return true;
    }
    if (e.cause) return check(e.cause);
    return false;
  };

  return check(err);
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __trueselfDbInstance?: any;
  __trueselfLocalStore?: LocalStore;
};

export const localStore =
  globalForDb.__trueselfLocalStore ?? (globalForDb.__trueselfLocalStore = new LocalStore());

let realDb: ReturnType<typeof drizzle> | null = null;
let pgFailed = !databaseUrl;

if (databaseUrl && process.env.USE_LOCAL_STORE !== "true") {
  try {
    const poolInstance =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
        connectionTimeoutMillis: 1500,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = poolInstance;
    }
    realDb = drizzle(poolInstance);
  } catch (err) {
    console.warn("[Trueself DB] PostgreSQL pool initialization failed, using local store:", err);
    pgFailed = true;
  }
} else {
  pgFailed = true;
}

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({ connectionString: databaseUrl || "postgresql://127.0.0.1:5432/app_db" });

function wrapQueryPromise<T>(
  p: Promise<T> | any,
  fallbackFn: () => Promise<T> | any
): Promise<T> {
  if (pgFailed || !realDb) {
    return Promise.resolve().then(() => fallbackFn());
  }

  return new Promise<T>((resolve, reject) => {
    p.then(
      (val: T) => resolve(val),
      (err: any) => {
        if (isConnectionError(err)) {
          pgFailed = true;
          try {
            const fallbackRes = fallbackFn();
            if (fallbackRes && typeof fallbackRes.then === "function") {
              return fallbackRes.then(resolve, reject);
            }
            return resolve(fallbackRes);
          } catch (fallbackErr) {
            return reject(fallbackErr);
          }
        }
        reject(err);
      }
    );
  });
}

function createDbWrapper(): any {
  return new Proxy({} as any, {
    get(_target, prop) {
      if (pgFailed || !realDb) {
        return (localStore as any)[prop];
      }

      if (prop === "select") {
        return (...args: any[]) => {
          if (pgFailed || !realDb) return localStore.select(...args);

          const realQuery = (realDb.select as any)(...args);
          const origFrom = realQuery.from?.bind(realQuery);

          if (origFrom) {
            realQuery.from = function (table: any) {
              if (pgFailed || !realDb) return localStore.select(...args).from(table);
              const fromRes = origFrom(table);

              const wrapChain = (chainObj: any, chainLocalFn: () => any) => {
                const origWhere = chainObj.where?.bind(chainObj);
                if (origWhere) {
                  chainObj.where = function (cond: any) {
                    if (pgFailed || !realDb) return chainLocalFn().where(cond);
                    const whereRes = origWhere(cond);
                    return wrapChain(whereRes, () => chainLocalFn().where(cond));
                  };
                }

                const origLimit = chainObj.limit?.bind(chainObj);
                if (origLimit) {
                  chainObj.limit = function (lim: number) {
                    if (pgFailed || !realDb) return chainLocalFn().limit(lim);
                    const limitRes = origLimit(lim);
                    return wrapChain(limitRes, () => chainLocalFn().limit(lim));
                  };
                }

                const origOrderBy = chainObj.orderBy?.bind(chainObj);
                if (origOrderBy) {
                  chainObj.orderBy = function (ord: any) {
                    if (pgFailed || !realDb) return chainLocalFn().orderBy(ord);
                    const orderRes = origOrderBy(ord);
                    return wrapChain(orderRes, () => chainLocalFn().orderBy(ord));
                  };
                }

                const origThen = chainObj.then?.bind(chainObj);
                if (origThen) {
                  chainObj.then = function (onFulfilled: any, onRejected: any) {
                    return wrapQueryPromise(chainObj, () => chainLocalFn()).then(
                      onFulfilled,
                      onRejected
                    );
                  };
                }

                return chainObj;
              };

              return wrapChain(fromRes, () => localStore.select(...args).from(table));
            };
          }

          const origThen = realQuery.then?.bind(realQuery);
          if (origThen) {
            realQuery.then = function (onFulfilled: any, onRejected: any) {
              return wrapQueryPromise(realQuery, () => localStore.select(...args)).then(
                onFulfilled,
                onRejected
              );
            };
          }

          return realQuery;
        };
      }

      if (prop === "insert") {
        return (table: any) => {
          if (pgFailed || !realDb) return localStore.insert(table);

          const builder: any = realDb.insert(table);
          const origValues = builder.values.bind(builder);

          builder.values = function (val: any) {
            if (pgFailed || !realDb) return localStore.insert(table).values(val);
            const res: any = origValues(val);

            const origReturning = res.returning?.bind(res);
            if (origReturning) {
              res.returning = function (fields?: any) {
                if (pgFailed || !realDb) {
                  return localStore.insert(table).values(val).returning(fields);
                }
                const retPromise = origReturning(fields);
                return wrapQueryPromise(retPromise, () =>
                  localStore.insert(table).values(val).returning(fields)
                );
              };
            }

            const origConflict = res.onConflictDoUpdate?.bind(res);
            if (origConflict) {
              res.onConflictDoUpdate = function (conf: any) {
                if (pgFailed || !realDb) {
                  return localStore.insert(table).values(val).onConflictDoUpdate(conf);
                }
                const confPromise = origConflict(conf);
                return wrapQueryPromise(confPromise, () =>
                  localStore.insert(table).values(val).onConflictDoUpdate(conf)
                );
              };
            }

            const origThen = res.then?.bind(res);
            if (origThen) {
              res.then = function (onFulfilled: any, onRejected: any) {
                return wrapQueryPromise(res, () => localStore.insert(table).values(val)).then(
                  onFulfilled,
                  onRejected
                );
              };
            }

            return res;
          };

          return builder;
        };
      }

      if (prop === "update") {
        return (table: any) => {
          if (pgFailed || !realDb) return localStore.update(table);

          const builder: any = realDb.update(table);
          const origSet = builder.set.bind(builder);

          builder.set = function (val: any) {
            if (pgFailed || !realDb) return localStore.update(table).set(val);
            const res: any = origSet(val);
            const origWhere = res.where.bind(res);

            res.where = function (cond: any) {
              if (pgFailed || !realDb) return localStore.update(table).set(val).where(cond);
              const whereRes: any = origWhere(cond);

              const origReturning = whereRes.returning?.bind(whereRes);
              if (origReturning) {
                whereRes.returning = function (fields?: any) {
                  if (pgFailed || !realDb) {
                    return localStore.update(table).set(val).where(cond).returning(fields);
                  }
                  const retPromise = origReturning(fields);
                  return wrapQueryPromise(retPromise, () =>
                    localStore.update(table).set(val).where(cond).returning(fields)
                  );
                };
              }

              const origThen = whereRes.then?.bind(whereRes);
              if (origThen) {
                whereRes.then = function (onFulfilled: any, onRejected: any) {
                  return wrapQueryPromise(whereRes, () =>
                    localStore.update(table).set(val).where(cond)
                  ).then(onFulfilled, onRejected);
                };
              }

              return whereRes;
            };

            return res;
          };

          return builder;
        };
      }

      if (prop === "delete") {
        return (table: any) => {
          if (pgFailed || !realDb) return localStore.delete(table);

          const builder: any = realDb.delete(table);
          const origWhere = builder.where.bind(builder);

          builder.where = function (cond: any) {
            if (pgFailed || !realDb) return localStore.delete(table).where(cond);
            const res: any = origWhere(cond);

            const origThen = res.then?.bind(res);
            if (origThen) {
              res.then = function (onFulfilled: any, onRejected: any) {
                return wrapQueryPromise(res, () =>
                  localStore.delete(table).where(cond)
                ).then(onFulfilled, onRejected);
              };
            }

            return res;
          };

          return builder;
        };
      }

      if (prop === "execute") {
        return (sql: any) => {
          if (pgFailed || !realDb) return localStore.execute();
          return wrapQueryPromise(realDb.execute(sql), () => localStore.execute());
        };
      }

      return (localStore as any)[prop];
    },
  });
}

export const db: ReturnType<typeof drizzle> =
  globalForDb.__trueselfDbInstance ?? (globalForDb.__trueselfDbInstance = createDbWrapper());
