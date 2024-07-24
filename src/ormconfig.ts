import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'shamo-typescript',
  entities: [__dirname + '/entity/*.ts'],
  synchronize: true,
};

export default config;
