# Documentation Complète : Fondations de NestJS

NestJS est un framework Node.js fortement inspiré par Angular.

---

## 1. Modules (`@Module()`)
Les modules structurent le code par domaine.

```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [], // Autres modules requis (ex: TypeOrmModule)
  controllers: [UserController], // Contrôleurs de ce module
  providers: [UserService], // Services, Guard, Strategies de ce module
  exports: [UserService] // Rendre UserService disponible aux autres modules
})
export class UserModule {}
```

---

## 2. Contrôleurs (`@Controller()`)
Gèrent les requêtes HTTP entrantes.

```typescript
import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';

@Controller('users') // Route de base: /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // GET /users
  findAll(@Query('role') role: string) {
    return this.userService.findAll(role);
  }

  @Get(':id') // GET /users/123
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post() // POST /users
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id') // PATCH /users/123
  update(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.userService.update(id, updateData);
  }
}
```

---

## 3. Services / Providers (`@Injectable()`)
Contiennent la logique métier.

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User introuvable');
    return user;
  }
}
```

---

## 4. Les Gardes (Guards)
Servent principalement à l'authentification/autorisation.

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.role === 'admin';
  }
}
```
**Utilisation:** `@UseGuards(RolesGuard)` sur un contrôleur ou une route.

---

## 5. Les Intercepteurs (Interceptors)
Permettent de modifier la requête entrante ou la réponse sortante (ex: log, formatage).

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```
**Utilisation:** `@UseInterceptors(TransformInterceptor)`

---

## 6. Les Pipes
Servent à la validation et transformation (ex: `ValidationPipe` ou `ParseIntPipe`).

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id est garanti d'être un nombre
}
```
