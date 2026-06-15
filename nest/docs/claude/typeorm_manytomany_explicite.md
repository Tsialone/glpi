# 📚 TypeORM — ManyToMany Explicite (Table Intermédiaire)

> Meilleure pratique : remplacer `@ManyToMany` par une entité intermédiaire explicite

---

## Pourquoi éviter @ManyToMany natif ?

Le décorateur `@ManyToMany()` natif de TypeORM gère la table de liaison de manière **invisible**, ce qui empêche d'y ajouter des colonnes personnalisées.

La meilleure pratique est de **créer explicitement l'entité intermédiaire** et de remplacer :
- `@ManyToMany` → deux `@ManyToOne` dans la table intermédiaire
- `@ManyToMany` → deux `@OneToMany` dans les entités principales

**Avantages :**
- Ajouter des colonnes personnalisées dans la liaison (`role`, `joinedAt`, `quantity`, `status`...)
- Requêtes plus lisibles et contrôlées
- Possibilité de faire des opérations CRUD directement sur la liaison

---

## Exemple : User ↔ Group via UserGroup

### Schéma de la relation

```
User ──────< UserGroup >────── Group
              - id
              - role
              - joinedAt
```

---

## 1. L'entité intermédiaire : `UserGroup`

C'est elle qui fait le pont. Elle possède ses propres colonnes et pointe vers les deux autres entités.

```typescript
// user-group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity()
export class UserGroup {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string; // Colonne personnalisée (ex: 'admin', 'membre')

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date; // Autre colonne personnalisée

  // Relation vers User
  @ManyToOne(() => User, (user) => user.userGroups, { onDelete: 'CASCADE' })
  user: User;

  // Relation vers Group
  @ManyToOne(() => Group, (group) => group.userGroups, { onDelete: 'CASCADE' })
  group: Group;
}
```

---

## 2. L'entité : `User`

Au lieu d'un `@ManyToMany` vers `Group`, on fait un `@OneToMany` vers `UserGroup`.

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Lien vers la table intermédiaire
  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];
}
```

---

## 3. L'entité : `Group`

De la même manière, un `@OneToMany` vers `UserGroup`.

```typescript
// group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Lien vers la table intermédiaire
  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
```

---

## 4. Utilisation — Exemples de requêtes

### Récupérer un user avec ses groupes

```typescript
const userWithGroups = await userRepository.findOne({
  where: { id: 1 },
  relations: ['userGroups', 'userGroups.group'],
});

// Accéder aux données
console.log(userWithGroups.name);

userWithGroups.userGroups.forEach((ug) => {
  console.log(`Groupe   : ${ug.group.name}`);
  console.log(`Rôle     : ${ug.role}`);
  console.log(`Rejoint  : ${ug.joinedAt}`);
});
```

### Récupérer un groupe avec ses membres

```typescript
const groupWithMembers = await groupRepository.findOne({
  where: { id: 1 },
  relations: ['userGroups', 'userGroups.user'],
});

groupWithMembers.userGroups.forEach((ug) => {
  console.log(`Membre : ${ug.user.name} (${ug.role})`);
});
```

### Ajouter un user dans un groupe

```typescript
const userGroupRepo = dataSource.getRepository(UserGroup);

const liaison = userGroupRepo.create({
  user: { id: 1 },    // ou l'instance User complète
  group: { id: 2 },   // ou l'instance Group complète
  role: 'membre',
  joinedAt: new Date(),
});

await userGroupRepo.save(liaison);
```

### Retirer un user d'un groupe

```typescript
await userGroupRepo.delete({ user: { id: 1 }, group: { id: 2 } });
```

### Changer le rôle d'un user dans un groupe

```typescript
await userGroupRepo.update(
  { user: { id: 1 }, group: { id: 2 } },
  { role: 'admin' }
);
```

### Query Builder — requête avancée

```typescript
const usersInGroup = await userGroupRepo
  .createQueryBuilder('ug')
  .leftJoinAndSelect('ug.user', 'user')
  .leftJoinAndSelect('ug.group', 'group')
  .where('group.id = :groupId', { groupId: 2 })
  .andWhere('ug.role = :role', { role: 'admin' })
  .getMany();

usersInGroup.forEach((ug) => {
  console.log(`Admin : ${ug.user.name}`);
});
```

---

## Résumé visuel

| Entité       | Décorateur utilisé | Pointe vers  |
|--------------|--------------------|--------------|
| `User`       | `@OneToMany`       | `UserGroup`  |
| `Group`      | `@OneToMany`       | `UserGroup`  |
| `UserGroup`  | `@ManyToOne` × 2   | `User` + `Group` |

> ⚠️ Ne pas oublier d'enregistrer `UserGroup` dans `TypeOrmModule.forFeature([User, Group, UserGroup])` et dans les `entities[]` de la DataSource.

---

*Bonne chance pour ton exam ! 🎯*
