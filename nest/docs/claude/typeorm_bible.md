# 📚 Bible TypeORM — TypeScript

> TypeORM · TypeScript · Compatible SQLite, PostgreSQL, MySQL, MariaDB...

---

## Table des matières

1. [Installation & Configuration](#1-installation--configuration)
2. [Data Source (connexion)](#2-data-source-connexion)
3. [Entités (Entities)](#3-entités-entities)
4. [Décorateurs de colonnes](#4-décorateurs-de-colonnes)
5. [Relations](#5-relations)
6. [Migrations](#6-migrations)
7. [Repository](#7-repository)
8. [Query Builder](#8-query-builder)
9. [Transactions](#9-transactions)
10. [Listeners & Subscribers](#10-listeners--subscribers)
11. [Index & contraintes](#11-index--contraintes)
12. [Cas pratiques & patterns](#12-cas-pratiques--patterns)
13. [Erreurs fréquentes](#13-erreurs-fréquentes)
14. [Aide-mémoire rapide](#14-aide-mémoire-rapide)

---

## 1. Installation & Configuration

```bash
# Installer TypeORM + pilote de base
npm install typeorm reflect-metadata

# Pilotes selon la base
npm install better-sqlite3        # SQLite
npm install @types/better-sqlite3 --save-dev
npm install pg                    # PostgreSQL
npm install mysql2                # MySQL / MariaDB

# TypeScript
npm install typescript ts-node @types/node --save-dev
```

### tsconfig.json (obligatoire)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "experimentalDecorators": true, // OBLIGATOIRE
    "emitDecoratorMetadata": true, // OBLIGATOIRE
    "strictPropertyInitialization": false // Recommandé avec TypeORM
  }
}
```

### package.json — scripts utiles

```json
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "migration:generate": "typeorm migration:generate -d src/data-source.ts",
    "migration:run": "typeorm migration:run -d src/data-source.ts",
    "migration:revert": "typeorm migration:revert -d src/data-source.ts",
    "schema:sync": "typeorm schema:sync -d src/data-source.ts",
    "schema:drop": "typeorm schema:drop -d src/data-source.ts"
  }
}
```

---

## 2. Data Source (connexion)

```typescript
// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';

export const AppDataSource = new DataSource({
  type: 'sqlite', // 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'better-sqlite3'
  database: 'database.sqlite', // chemin du fichier pour SQLite
  // Pour PostgreSQL :
  // host: "localhost",
  // port: 5432,
  // username: "root",
  // password: "password",
  // database: "mydb",

  synchronize: true, // ⚠️ auto-sync schéma (DEV seulement, jamais en PROD)
  logging: true, // Afficher les requêtes SQL
  entities: [User, Post], // ou chemin glob : ["src/entities/**/*.ts"]
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

// Initialiser la connexion
AppDataSource.initialize()
  .then(() => console.log('Base connectée'))
  .catch((err) => console.error('Erreur connexion :', err));
```

### Utilisation dans l'app

```typescript
// src/index.ts
import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function main() {
  await AppDataSource.initialize();

  // Utiliser les repositories...
  const userRepo = AppDataSource.getRepository(User);
  const users = await userRepo.find();
  console.log(users);

  await AppDataSource.destroy(); // fermer la connexion
}

main();
```

---

## 3. Entités (Entities)

Une entité = une classe TypeScript décorée = une table en base.

```typescript
// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

@Entity('users') // nom de la table (optionnel, défaut = nom de la classe en minuscule)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid') // ou clé UUID
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string | null;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn() // pour le soft-delete
  deletedAt: Date | null;
}
```

---

## 4. Décorateurs de colonnes

### Clés primaires

```typescript
@PrimaryGeneratedColumn()              // INTEGER auto-incrémenté
id: number;

@PrimaryGeneratedColumn("uuid")        // UUID auto-généré
id: string;

@PrimaryColumn()                       // Clé primaire manuelle
id: number;

// Clé primaire composite
@Entity()
export class OrderItem {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productId: number;
}
```

### @Column — options complètes

```typescript
@Column({
  name: "first_name",     // nom réel en base (snake_case)
  type: "varchar",        // type SQL explicite
  length: 100,            // longueur
  nullable: true,         // autorise NULL
  unique: false,          // contrainte unique
  default: "anonymous",   // valeur par défaut
  comment: "Prénom",      // commentaire SQL
  select: true,           // inclure dans SELECT par défaut
  insert: true,           // autorise INSERT
  update: true,           // autorise UPDATE
})
firstName: string;

// Types courants
@Column("text")           content: string;
@Column("int")            age: number;
@Column("float")          price: number;
@Column("decimal", { precision: 10, scale: 2 })  amount: number;
@Column("boolean")        isActive: boolean;
@Column("date")           birthDate: Date;
@Column("datetime")       scheduledAt: Date;
@Column("json")           metadata: object;
@Column("simple-array")   tags: string[];          // stocké comme CSV
@Column("simple-json")    options: Record<string, any>;
```

### Colonnes spéciales

```typescript
@CreateDateColumn()       // Rempli auto à la création
createdAt: Date;

@UpdateDateColumn()       // Mis à jour auto à chaque save()
updatedAt: Date;

@DeleteDateColumn()       // Rempli auto avec softDelete()
deletedAt: Date | null;

@VersionColumn()          // Numéro de version auto-incrémenté (optimistic locking)
version: number;
```

---

## 5. Relations

### One-to-One

```typescript
// Profile.ts
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}

// User.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true, // opérations en cascade
    eager: true, // charger automatiquement (attention aux perfs)
  })
  @JoinColumn() // OBLIGATOIRE du côté qui porte la FK
  profile: Profile;
}
```

### One-to-Many / Many-to-One

```typescript
// User.ts — le "un"
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, (post) => post.author, {
    cascade: true,
  })
  posts: Post[];
}

// Post.ts — le "plusieurs"
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE', // comportement SQL ON DELETE
    nullable: false,
  })
  @JoinColumn({ name: 'author_id' }) // optionnel, pour nommer la FK
  author: User;

  @Column()
  authorId: number; // colonne FK accessible directement
}
```

### Many-to-Many

```typescript
// Post.ts
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable({
    // OBLIGATOIRE sur un seul côté
    name: 'post_tags', // nom de la table de jointure
    joinColumn: { name: 'post_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];
}

// Tag.ts
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
```

### Options de relation

```typescript
{
  cascade: true,         // true = tous : insert, update, remove, soft-remove, recover
  cascade: ["insert", "update"],  // sélectif
  eager: true,           // charger automatiquement (find() inclut la relation)
  lazy: true,            // chargement via Promise
  nullable: false,       // FK NOT NULL
  onDelete: "CASCADE",   // "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION"
  onUpdate: "CASCADE",
}
```

---

## 6. Migrations

Les migrations permettent de faire évoluer le schéma sans `synchronize: true`.

```bash
# Générer une migration (détecte les différences entité <-> base)
npx typeorm migration:generate src/migrations/NomMigration -d src/data-source.ts

# Créer une migration vide
npx typeorm migration:create src/migrations/NomMigration

# Exécuter les migrations en attente
npx typeorm migration:run -d src/data-source.ts

# Annuler la dernière migration
npx typeorm migration:revert -d src/data-source.ts

# Voir le statut des migrations
npx typeorm migration:show -d src/data-source.ts
```

### Structure d'une migration

```typescript
// src/migrations/1700000000000-AddPhoneToUser.ts
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneToUser1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Appliquer les changements
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Ou du SQL brut
    await queryRunner.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Annuler les changements (rollback)
    await queryRunner.dropColumn('users', 'phone');
  }
}
```

### QueryRunner — opérations DDL

```typescript
// Tables
await queryRunner.createTable(
  new Table({
    name: 'categories',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      { name: 'name', type: 'varchar', isNullable: false },
    ],
  }),
  true,
); // true = IF NOT EXISTS

await queryRunner.dropTable('categories', true); // true = IF EXISTS
await queryRunner.renameTable('categories', 'tags');

// Colonnes
await queryRunner.addColumn(
  'users',
  new TableColumn({ name: 'age', type: 'int', isNullable: true }),
);
await queryRunner.changeColumn(
  'users',
  'age',
  new TableColumn({ name: 'age', type: 'bigint' }),
);
await queryRunner.dropColumn('users', 'age');
await queryRunner.renameColumn('users', 'old_name', 'new_name');

// Index
await queryRunner.createIndex(
  'users',
  new TableIndex({ name: 'IDX_USER_EMAIL', columnNames: ['email'] }),
);
await queryRunner.dropIndex('users', 'IDX_USER_EMAIL');

// Clés étrangères
await queryRunner.createForeignKey(
  'posts',
  new TableForeignKey({
    columnNames: ['authorId'],
    referencedTableName: 'users',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
  }),
);
```

---

## 7. Repository

Le Repository est l'interface principale pour les opérations CRUD.

```typescript
import { AppDataSource } from './data-source';
import { User } from './entities/User';

const userRepo = AppDataSource.getRepository(User);
```

### Trouver / Lire

```typescript
// Tous
const users = await userRepo.find();

// Avec options
const users = await userRepo.find({
  where: { isActive: true },
  order: { createdAt: 'DESC' },
  skip: 0,
  take: 10,
  relations: { posts: true }, // charger les relations
  select: { id: true, firstName: true }, // sélectionner seulement certaines colonnes
});

// Un seul (throw si introuvable)
const user = await userRepo.findOneOrFail({ where: { id: 1 } });

// Un seul ou null
const user = await userRepo.findOne({ where: { email: 'a@b.com' } });

// Par clé primaire
const user = await userRepo.findOneBy({ id: 1 });

// Count
const count = await userRepo.count({ where: { isActive: true } });

// Exist
const exists = await userRepo.exist({ where: { email: 'a@b.com' } });
```

### Conditions WHERE avancées (FindOperators)

```typescript
import {
  Equal,
  Not,
  Like,
  ILike,
  In,
  Between,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  IsNull,
  ArrayContains,
  Or,
  And,
  Raw,
} from 'typeorm';

await userRepo.find({
  where: {
    age: Between(18, 65),
    email: Not(IsNull()),
    name: Like('%dupont%'), // sensible à la casse
    name: ILike('%dupont%'), // insensible à la casse (PostgreSQL)
    dept: In([1, 2, 3]),
    salary: MoreThan(3000),
    salary: LessThanOrEqual(5000),
    role: Not(Equal('admin')),
    // Condition personnalisée
    age: Raw((alias) => `${alias} % 2 = 0`), // âge pair
  },
});

// OU entre conditions
await userRepo.find({
  where: [
    { firstName: 'Jean' }, // condition 1
    { lastName: 'Dupont' }, // OU condition 2
  ],
});

// AND explicite
await userRepo.find({
  where: {
    firstName: 'Jean', // implicitement ET
    isActive: true,
  },
});
```

### Créer / Sauvegarder

```typescript
// Créer + sauvegarder en une fois
const user = userRepo.create({
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@dupont.fr',
});
await userRepo.save(user);

// save() fait INSERT si pas d'id, UPDATE si id existant
user.firstName = 'Jean-Pierre';
await userRepo.save(user); // UPDATE

// Sauvegarder plusieurs entités
await userRepo.save([user1, user2, user3]);

// Insert sans retour d'entité (plus rapide, pas de listeners)
await userRepo.insert({ firstName: 'Alice', email: 'alice@mail.com' });

// Upsert
await userRepo.upsert(
  { email: 'alice@mail.com', firstName: 'Alice' },
  ['email'], // colonnes de conflit
);
```

### Mettre à jour

```typescript
// update() par critère (pas de listeners/hooks)
await userRepo.update({ id: 1 }, { isActive: false });
await userRepo.update(1, { firstName: 'Nouveau' }); // par PK

// Avec save() (déclenche les listeners)
const user = await userRepo.findOneByOrFail({ id: 1 });
user.firstName = 'Nouveau';
await userRepo.save(user);
```

### Supprimer

```typescript
// delete() par critère (pas de listeners)
await userRepo.delete(1);
await userRepo.delete({ isActive: false });

// remove() avec l'entité (déclenche les listeners)
const user = await userRepo.findOneByOrFail({ id: 1 });
await userRepo.remove(user);

// Soft delete (remplit deletedAt, ne supprime pas vraiment)
await userRepo.softDelete(1);
await userRepo.softRemove(user);

// Restaurer un soft delete
await userRepo.restore(1);
await userRepo.recover(user);

// Pour inclure les soft-deleted dans les requêtes
await userRepo.find({ withDeleted: true });
```

---

## 8. Query Builder

Le Query Builder permet de construire des requêtes SQL complexes.

```typescript
const qb = AppDataSource.createQueryBuilder();
// ou depuis un repo :
const qb = userRepo.createQueryBuilder('user');
```

### SELECT

```typescript
const users = await userRepo
  .createQueryBuilder('user')
  .select(['user.id', 'user.firstName', 'user.email'])
  .addSelect('UPPER(user.firstName)', 'upperName') // alias
  .where('user.isActive = :active', { active: true })
  .andWhere('user.age > :age', { age: 18 })
  .orWhere('user.role = :role', { role: 'admin' })
  .orderBy('user.createdAt', 'DESC')
  .addOrderBy('user.firstName', 'ASC')
  .skip(0)
  .take(10)
  .getMany(); // retourne User[]

// Une seule entité
const user = await qb.getOne(); // null si pas trouvé
const user = await qb.getOneOrFail(); // throw si pas trouvé

// Résultat brut (pas d'entité)
const raw = await qb.getRawMany();
const raw = await qb.getRawOne();

// Count
const count = await qb.getCount();

// Count + résultats
const [users, count] = await qb.getManyAndCount();
```

### JOIN

```typescript
const users = await userRepo
  .createQueryBuilder('user')
  // Charger la relation (dans l'entité)
  .leftJoinAndSelect('user.posts', 'post')
  .innerJoinAndSelect('user.profile', 'profile')

  // JOIN sur une condition custom
  .leftJoinAndSelect('user.posts', 'post', 'post.isPublished = :pub', {
    pub: true,
  })

  // JOIN sans select (pour filtrer seulement)
  .leftJoin('user.posts', 'post')
  .where('post.title LIKE :title', { title: '%TypeORM%' })

  .getMany();
```

### Sous-requêtes

```typescript
// Sous-requête dans WHERE
const subQuery = AppDataSource.createQueryBuilder()
  .select('post.authorId')
  .from(Post, 'post')
  .where('post.isPublished = true');

const users = await userRepo
  .createQueryBuilder('user')
  .where(`user.id IN (${subQuery.getQuery()})`)
  .setParameters(subQuery.getParameters())
  .getMany();
```

### GROUP BY / HAVING

```typescript
const stats = await userRepo
  .createQueryBuilder('user')
  .select('user.deptId', 'dept')
  .addSelect('COUNT(user.id)', 'count')
  .addSelect('AVG(user.salary)', 'avgSalary')
  .groupBy('user.deptId')
  .having('AVG(user.salary) > :min', { min: 3000 })
  .getRawMany();
```

### INSERT / UPDATE / DELETE avec Query Builder

```typescript
// INSERT
await AppDataSource.createQueryBuilder()
  .insert()
  .into(User)
  .values([
    { firstName: 'Alice', email: 'alice@mail.com' },
    { firstName: 'Bob', email: 'bob@mail.com' },
  ])
  .execute();

// UPDATE
await AppDataSource.createQueryBuilder()
  .update(User)
  .set({ isActive: false, updatedAt: new Date() })
  .where('lastLogin < :date', { date: new Date('2024-01-01') })
  .execute();

// DELETE
await AppDataSource.createQueryBuilder()
  .delete()
  .from(User)
  .where('isActive = :active', { active: false })
  .execute();

// SOFT DELETE
await AppDataSource.createQueryBuilder()
  .softDelete()
  .from(User)
  .where('id = :id', { id: 1 })
  .execute();
```

### Relation Query Builder

```typescript
// Accéder aux relations d'une entité existante
const user = await userRepo.findOneByOrFail({ id: 1 });

const posts = await userRepo
  .createQueryBuilder()
  .relation(User, 'posts')
  .of(user) // ou .of(1) par ID
  .loadMany();

// Ajouter / retirer des relations Many-to-Many
await userRepo
  .createQueryBuilder()
  .relation(User, 'roles')
  .of(userId)
  .add(roleId);

await userRepo
  .createQueryBuilder()
  .relation(User, 'roles')
  .of(userId)
  .remove(roleId);

// Définir une relation One-to-One / Many-to-One
await userRepo
  .createQueryBuilder()
  .relation(User, 'profile')
  .of(userId)
  .set(profileId); // null pour supprimer la relation
```

---

## 9. Transactions

```typescript
// Méthode 1 : transaction() — la plus simple
await AppDataSource.transaction(async (manager) => {
  const user = manager.create(User, { firstName: "Jean", email: "jean@test.com" });
  await manager.save(user);

  const post = manager.create(Post, { title: "Mon post", author: user });
  await manager.save(post);
  // Si une erreur est levée → rollback automatique
});

// Méthode 2 : QueryRunner — contrôle total
const queryRunner = AppDataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  await queryRunner.manager.save(User, { firstName: "Alice", email: "a@b.com" });
  await queryRunner.manager.save(Post, { title: "Post", authorId: 1 });
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw error;
} finally {
  await queryRunner.release();  // TOUJOURS libérer
}

// Méthode 3 : SAVEPOINT
await queryRunner.startTransaction();
await queryRunner.manager.save(User, { ... });
await queryRunner.setSavepoint("sp1");

try {
  await queryRunner.manager.save(Post, { ... });
} catch {
  await queryRunner.rollbackToSavepoint("sp1");
}

await queryRunner.commitTransaction();
await queryRunner.release();
```

---

## 10. Listeners & Subscribers

### Listeners (dans l'entité)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  AfterInsert,
  BeforeUpdate,
  AfterUpdate,
  BeforeRemove,
  AfterRemove,
  AfterLoad,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @AfterLoad()
  setFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  @AfterInsert()
  logInsert() {
    console.log('User inséré :', this.id);
  }
}
```

### Subscribers (classe séparée)

```typescript
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { User } from '../entities/User';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User; // entité écoutée
  }

  beforeInsert(event: InsertEvent<User>) {
    console.log('Avant insert:', event.entity);
  }

  afterInsert(event: InsertEvent<User>) {
    console.log('Après insert, id:', event.entity.id);
  }

  beforeUpdate(event: UpdateEvent<User>) {
    console.log('Avant update:', event.entity);
  }

  beforeRemove(event: RemoveEvent<User>) {
    console.log('Avant suppression:', event.entityId);
  }
}
```

---

## 11. Index & contraintes

```typescript
import {
  Entity,
  Index,
  Unique,
  Check,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

// Index simple
@Index(['firstName', 'lastName'])
// Index unique
@Unique(['email'])
// Contrainte CHECK (SQLite)
@Check(`"salary" >= 0`)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Index sur une colonne
  @Index()
  @Column()
  email: string;

  // Index unique sur une colonne
  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  salary: number;
}
```

---

## 12. Cas pratiques & patterns

### Repository personnalisé

```typescript
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User';

export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findActiveByDept(deptId: number): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.deptId = :deptId', { deptId })
      .andWhere('user.isActive = true')
      .orderBy('user.lastName', 'ASC')
      .getMany();
  }

  async findWithPostCount(): Promise<any[]> {
    return this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.postCount', 'user.posts')
      .getMany();
  }
}

// Instanciation
const userRepo = new UserRepository(AppDataSource);
```

### Pagination

```typescript
async function paginate<T>(
  repo: Repository<T>,
  page: number, // commence à 1
  limit: number,
  options = {},
): Promise<{ data: T[]; total: number; page: number; lastPage: number }> {
  const [data, total] = await repo.findAndCount({
    ...options,
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data, total, page, lastPage: Math.ceil(total / limit) };
}

// Utilisation
const result = await paginate(userRepo, 1, 10, {
  where: { isActive: true },
  order: { createdAt: 'DESC' },
});
```

### Charger les relations sélectivement

```typescript
// Option 1 : find avec relations
const user = await userRepo.findOne({
  where: { id: 1 },
  relations: {
    posts: {
      comments: true, // relations imbriquées
    },
    profile: true,
  },
});

// Option 2 : Query Builder (plus de contrôle)
const user = await userRepo
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post', 'post.isPublished = true')
  .leftJoinAndSelect('post.tags', 'tag')
  .where('user.id = :id', { id: 1 })
  .getOneOrFail();
```

### Compter les relations sans les charger

```typescript
const users = await userRepo
  .createQueryBuilder('user')
  .loadRelationCountAndMap('user.postCount', 'user.posts')
  .loadRelationCountAndMap(
    'user.publishedPostCount',
    'user.posts',
    'post',
    (qb) => qb.where('post.isPublished = true'),
  )
  .getMany();

// users[0].postCount → 5
```

### SQL brut

```typescript
// Query brute via DataSource
const result = await AppDataSource.query(
  `SELECT * FROM users WHERE salary > $1 AND dept_id = $2`,
  [3000, 1],
);

// Via QueryRunner
await queryRunner.query(`CREATE INDEX idx_email ON users(email)`);
```

### Entité avec héritage

```typescript
import { Entity, TableInheritance, ChildEntity, Column } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}

@ChildEntity()
export class Post extends Content {
  @Column()
  body: string;
}

@ChildEntity()
export class Question extends Content {
  @Column()
  answersCount: number;
}
```

### Find avec options avancées

```typescript
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

const options: FindManyOptions<User> = {
  where: {
    isActive: true,
  },
  select: {
    id: true,
    firstName: true,
    email: true,
  },
  relations: {
    posts: true,
  },
  order: {
    createdAt: 'DESC',
  },
  skip: 0,
  take: 20,
  cache: true, // mise en cache de la requête
  lock: {
    // verrou de ligne
    mode: 'pessimistic_read', // ou "pessimistic_write" | "optimistic"
  },
  withDeleted: false, // inclure les soft-deleted
};

const [users, count] = await userRepo.findAndCount(options);
```

---

## 13. Erreurs fréquentes

| Erreur                                               | Cause                                         | Solution                                                                                   |
| ---------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `experimentalDecorators` manquant                    | tsconfig incomplet                            | Ajouter `"experimentalDecorators": true` et `"emitDecoratorMetadata": true`                |
| `reflect-metadata` non importé                       | Oubli d'import                                | Ajouter `import "reflect-metadata"` au tout début du point d'entrée                        |
| `Entity metadata not found`                          | Entité non déclarée dans DataSource           | L'ajouter dans `entities: [...]`                                                           |
| `FOREIGN KEY constraint failed`                      | `foreign_keys` désactivé (SQLite)             | Ajouter `PRAGMA foreign_keys = ON` ou utiliser `extra: { foreign_keys: 1 }` dans la config |
| `Cannot use 'synchronize' in production`             | `synchronize: true` en prod                   | Utiliser les migrations en production                                                      |
| `QueryFailedError: UNIQUE constraint failed`         | Valeur dupliquée                              | Vérifier les données ou utiliser `upsert()`                                                |
| `EntityNotFoundError`                                | `findOneOrFail` ne trouve rien                | Utiliser `findOne()` et vérifier le null, ou gérer l'exception                             |
| `Cannot read properties of undefined (reading 'id')` | Relation non chargée                          | Ajouter la relation dans `relations: {}` ou `leftJoinAndSelect`                            |
| `release()` non appelé                               | QueryRunner non libéré                        | Toujours appeler `release()` dans un `finally`                                             |
| Les `@BeforeInsert` ne se déclenchent pas            | Utilisation de `insert()` au lieu de `save()` | Utiliser `save()` pour déclencher les listeners                                            |

---

## 14. Aide-mémoire rapide

### CRUD minimal

```typescript
const repo = AppDataSource.getRepository(MyEntity);

// CREATE
const entity = repo.create({ name: 'test' });
await repo.save(entity);

// READ
const all = await repo.find();
const one = await repo.findOneBy({ id: 1 });
const strict = await repo.findOneByOrFail({ id: 1 });

// UPDATE
await repo.update(1, { name: 'nouveau' });
// ou :
entity.name = 'nouveau';
await repo.save(entity);

// DELETE
await repo.delete(1);
await repo.softDelete(1); // soft delete
```

### Query Builder minimal

```typescript
const results = await repo
  .createQueryBuilder('e')
  .where('e.name LIKE :name', { name: '%test%' })
  .andWhere('e.isActive = :active', { active: true })
  .leftJoinAndSelect('e.category', 'cat')
  .orderBy('e.createdAt', 'DESC')
  .take(10)
  .getMany();
```

### Config DataSource minimale (SQLite)

```typescript
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './db.sqlite',
  synchronize: true, // DEV seulement
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
});
```

### Activer les FK pour SQLite

```typescript
// Dans la config DataSource :
{
  type: "better-sqlite3",
  database: "db.sqlite",
  entities: [...],
  // Activer les foreign keys automatiquement
  nativeBinding: undefined,
  prepareDatabase: (db) => {
    db.pragma("foreign_keys = ON");
  },  
}
```

---

## soft delete

```typescript
update simple
  await userRepository.update(id, { isActive: false });
filtrer les disponible
  await userRepository.find({ where: { isActive: true } });

```

_Bonne chance pour ton exam ! 🎯_
