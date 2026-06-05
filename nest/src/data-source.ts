import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'db.sqlite',
  // On ajuste les chemins pour que le CLI trouve vos entités et vos futures migrations
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // Gardez à false pour utiliser les migrations
});