# Guide NestJS de A à Z

Bienvenue dans ce guide complet de **NestJS**, un framework Node.js particulièrement populaire pour créer des applications backend scalables, maintenables et fortement typées. Fortement inspiré d'Angular, il apporte une vraie architecture logicielle à Node.js.

---

## 1. Introduction et Concepts Clés

NestJS utilise **Express** par défaut (mais peut être configuré avec Fastify pour plus de performances). Il est construit avec et supporte entièrement **TypeScript**.

### Les 3 piliers de NestJS :
- **Les Contrôleurs (Controllers)** : Gèrent les requêtes HTTP entrantes et renvoient les réponses au client.
- **Les Fournisseurs (Providers/Services)** : Contiennent la logique métier (business logic) de l'application. Ils peuvent être injectés dans les contrôleurs.
- **Les Modules** : Permettent d'organiser l'application en blocs fonctionnels isolés (ex: module Utilisateur, module Paiement).

---

## 2. Installation et Création de projet

Le moyen le plus simple de démarrer est d'utiliser le CLI officiel de Nest.

```bash
# Installation du CLI globalement
npm i -g @nestjs/cli

# Création d'un nouveau projet
nest new mon-projet-nest
```

Une fois le projet créé, pour lancer le serveur en mode développement :
```bash
cd mon-projet-nest
npm run start:dev
```
L'application écoute par défaut sur le port `3000` (http://localhost:3000).

---

## 3. L'Architecture de Base

Voici à quoi ressemble un module de base généré par le CLI (`src/app.module.ts`) :

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // Autres modules importés
  controllers: [AppController], // Les contrôleurs de ce module
  providers: [AppService], // Les services de ce module
})
export class AppModule {}
```

---

## 4. Les Contrôleurs (Routage)

Les contrôleurs utilisent des **décorateurs** pour définir les routes.
Pour générer un contrôleur : `nest g controller users`

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  
  @Get() // GET /users
  findAll(): string {
    return 'Retourne tous les utilisateurs';
  }

  @Get(':id') // GET /users/1
  findOne(@Param('id') id: string): string {
    return `Retourne l'utilisateur avec l'ID ${id}`;
  }

  @Post() // POST /users
  create(@Body() createUserDto: CreateUserDto): string {
    return 'Ajoute un nouvel utilisateur';
  }
}
```

---

## 5. Les Services (Injection de Dépendance)

Un service gère la logique complexe. Il est décoré avec `@Injectable()`.
Pour générer un service : `nest g service users`

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [];

  findAll() {
    return this.users;
  }

  create(user) {
    this.users.push(user);
  }
}
```

Pour utiliser ce service dans le contrôleur, on l'injecte dans le constructeur :

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

---

## 6. Validation (DTO et Pipes)

NestJS utilise des **DTO (Data Transfer Object)** et le package `class-validator` pour valider les données entrantes.

1. Installer les dépendances :
```bash
npm i class-validator class-transformer
```

2. Créer un DTO :
```typescript
import { IsString, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

3. Activer la validation globale dans `main.ts` :
```typescript
import { ValidationPipe } from '@nestjs/common';
// ...
app.useGlobalPipes(new ValidationPipe());
```

---

## 7. Base de Données (TypeORM / Prisma)

NestJS est agnostique, mais **TypeORM** est souvent utilisé avec lui.

1. Installation de TypeORM et du driver (ex: PostgreSQL) :
```bash
npm install @nestjs/typeorm typeorm pg
```

2. Configuration dans `app.module.ts` :
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mabase',
      autoLoadEntities: true,
      synchronize: true, // Désactiver en production !
    }),
  ],
})
export class AppModule {}
```

---

## 8. Authentification et Autorisation (Guards)

Pour protéger une route, on utilise un **Guard**. Les Guards déterminent si une requête sera traitée par le routeur en fonction de certaines conditions (permissions, rôles, etc.).

Exemple d'un Guard simple :
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request); // Fonction personnalisée
  }
}
```

Utilisation sur un contrôleur :
```typescript
import { UseGuards } from '@nestjs/common';

@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {}
```
(NestJS s'intègre très bien avec Passport pour le JWT).

---

## 9. Middleware, Interceptors et Exception Filters

- **Middleware** : Exécuté avant le routage (identique aux middlewares Express).
- **Exception Filters** : Attrapent et formatent les exceptions non gérées pour envoyer une réponse propre (ex: page d'erreur personnalisée).
- **Interceptors** : Permettent d'intercepter l'entrée et la sortie d'une route (ex: logger le temps d'exécution, transformer les données retournées).

---

## 10. Commandes CLI Utiles

Le CLI Nest est extrêmement puissant pour générer le boilerplate (code de base).

- `nest g module [nom]` : Génère un Module
- `nest g controller [nom]` : Génère un Controller
- `nest g service [nom]` : Génère un Service
- `nest g resource [nom]` : Génère un CRUD complet (Module, Controller, Service, DTOs, Entité). C'est la commande la plus pratique !

---

## Conclusion

NestJS impose une structure stricte qui empêche le code spaghetti, rendant les projets extrêmement maintenables à long terme, en particulier sur de grosses applications. Maîtriser l'injection de dépendances et les décorateurs est la clé pour bien utiliser ce framework.
