import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import { Cart, CartItem } from "../cart/services/entities";


console.log(process.env.DATABASE_USERNAME);

export const getDatabaseConfig = async (
): Promise<ConnectionOptions> => {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Cart, CartItem],
    migrations: [path.join(__dirname, '../migrations/**/*{.ts, .js}')],
    logging: true
  }
};

export default getDatabaseConfig();