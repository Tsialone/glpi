# Documentation Complète : NestJS et TypeORM

TypeORM est l'ORM le plus utilisé dans l'écosystème TypeScript.

---

## 1. Configuration Avancée (`TypeOrmModule.forRoot`)
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'my_database',
  autoLoadEntities: true, 
  synchronize: false, // JAMAIS 'true' en production
  logging: true,
  maxQueryExecutionTime: 1000,
  migrationsRun: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  poolSize: 10,
})
```

---

## 2. Définition des Entités et Colonnes

### `@Entity()`
```typescript
@Entity('nom_de_la_table_personnalise', {
  orderBy: { createdAt: 'DESC' }
})
```

### Clés Primaires
```typescript
@PrimaryGeneratedColumn() id: number;
@PrimaryGeneratedColumn('uuid') id: string;
```

### `@Column()` Exhaustif
```typescript
@Column({
  type: 'varchar', length: 255, precision: 10, scale: 2, array: true,
  nullable: true, default: 'valeur', unique: true,
  select: false, insert: false, update: false,
  enum: ['admin', 'user'],
  name: 'nom_colonne_en_bdd'
})
monChamp: string;
```

### Spéciales
```typescript
@CreateDateColumn() createdAt: Date;
@UpdateDateColumn() updatedAt: Date;
@DeleteDateColumn() deletedAt: Date; 
@VersionColumn() version: number; 
```

---

## 3. Les Relations et Cascades

```typescript
@ManyToOne(() => User, (user) => user.posts, {
  cascade: true, // Sauvegarde les enfants automatiquement
  onDelete: 'CASCADE', // Supprime cet enfant si parent supprimé
  onUpdate: 'CASCADE',
  eager: true, // Chargement automatique (attention perf)
  lazy: true, 
  nullable: false, 
  orphanedRowAction: 'delete' 
})
```

---

## 4. Repositories et QueryBuilder

### CRUD de base
```typescript
await repo.find({ where: { isActive: true }, relations: ['profile'] });
const [users, count] = await repo.findAndCount({ skip: 10, take: 10 });

// Écriture
const user = repo.create({ name: 'John' }); 
await repo.save(user); // Fait un INSERT ou UPDATE
await repo.insert({ name: 'John' }); // Rapide
await repo.update(1, { name: 'John Doe' }); 

// Suppression
await repo.delete(1); 
await repo.softDelete(1); 
```

### QueryBuilder
```typescript
const users = await repo.createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .where('user.isActive = :isActive', { isActive: true })
  .andWhere('user.age > :minAge', { minAge: 18 })
  .select(['user.id', 'user.name'])
  .orderBy('user.createdAt', 'DESC')
  .getMany();
```

---

## 5. Transactions
```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
  await queryRunner.manager.save(User, userData);
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
} finally {
  await queryRunner.release();
}
```
