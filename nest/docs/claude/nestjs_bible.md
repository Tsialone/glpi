# 📚 Bible NestJS — Référence Complète

> NestJS · TypeScript · Framework Node.js progressif

---

## Table des matières

1. [Installation & Structure](#1-installation--structure)
2. [Modules](#2-modules)
3. [Controllers](#3-controllers)
4. [Providers & Services](#4-providers--services)
5. [Dependency Injection](#5-dependency-injection)
6. [Middleware](#6-middleware)
7. [Guards](#7-guards)
8. [Interceptors](#8-interceptors)
9. [Pipes & Validation](#9-pipes--validation)
10. [Exception Filters](#10-exception-filters)
11. [DTOs & Validation](#11-dtos--validation)
12. [TypeORM Integration](#12-typeorm-integration)
13. [Authentication (JWT)](#13-authentication-jwt)
14. [Configuration (.env)](#14-configuration-env)
15. [Cycle de vie d'une requête](#15-cycle-de-vie-dune-requête)
16. [Cas pratiques & patterns](#16-cas-pratiques--patterns)
17. [Erreurs fréquentes](#17-erreurs-fréquentes)
18. [Aide-mémoire rapide](#18-aide-mémoire-rapide)

---

## 1. Installation & Structure

```bash
# Installer le CLI NestJS
npm install -g @nestjs/cli

# Créer un nouveau projet
nest new mon-projet

# Générer des éléments (CLI)
nest generate module    users          # ou: nest g mo users
nest generate controller users        # ou: nest g co users
nest generate service   users         # ou: nest g s  users
nest generate resource  users         # Génère module + controller + service + DTOs + entity

# Lancer en dev (hot reload)
npm run start:dev

# Build production
npm run build
npm run start:prod
```

### Structure d'un projet NestJS

```
src/
├── app.module.ts          # Module racine
├── main.ts                # Point d'entrée
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── entities/
│       └── user.entity.ts
└── auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    ├── auth.service.ts
    └── guards/
        └── jwt-auth.guard.ts
```

### main.ts

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix("api");

  // Pipe de validation global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // Supprime les propriétés non décorées
    forbidNonWhitelisted: true, // Erreur si propriété inconnue
    transform: true,          // Transforme les types automatiquement
  }));

  // CORS
  app.enableCors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  await app.listen(3000);
  console.log("App running on http://localhost:3000");
}
bootstrap();
```

---

## 2. Modules

Le module est l'unité d'organisation de NestJS. Toute l'app est un arbre de modules.

```typescript
// users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Enregistrer les entités TypeORM
    OtherModule,                        // Importer d'autres modules
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],             // Exporter pour d'autres modules
})
export class UsersModule {}
```

```typescript
// app.module.ts — Module racine
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),   // Variables d'env globales
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,  // DEV seulement
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

### Module Global

```typescript
@Global()   // Disponible dans toute l'app sans import explicite
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedModule {}
```

### Module Dynamique

```typescript
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        { provide: "DB_OPTIONS", useValue: options },
        DatabaseService,
      ],
      exports: [DatabaseService],
      global: true,
    };
  }
}

// Utilisation
DatabaseModule.forRoot({ host: "localhost", port: 5432 })
```

---

## 3. Controllers

Le controller gère les routes HTTP et délègue la logique au service.

```typescript
// users/users.controller.ts
import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, Headers, Req, Res,
  HttpCode, HttpStatus, ParseIntPipe,
  UseGuards, UseInterceptors, UsePipes,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")   // préfixe de route : /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users?page=1&limit=10
  @Get()
  findAll(@Query("page") page: string, @Query("limit") limit: string) {
    return this.usersService.findAll(+page, +limit);
  }

  // GET /users/:id
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // GET /users/:userId/posts/:postId
  @Get(":userId/posts/:postId")
  findPost(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("postId", ParseIntPipe) postId: number,
  ) {
    return this.usersService.findPost(userId, postId);
  }

  // POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED)  // 201 par défaut pour POST
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // PUT /users/:id (remplacement complet)
  @Put(":id")
  replace(@Param("id", ParseIntPipe) id: number, @Body() dto: CreateUserDto) {
    return this.usersService.replace(id, dto);
  }

  // PATCH /users/:id (mise à jour partielle)
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // DELETE /users/:id
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)  // 204
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
```

### Décorateurs de paramètres

```typescript
@Param("id")                    // Route param  : /users/:id
@Param("id", ParseIntPipe)      // Route param typé en number
@Query("page")                  // Query string : ?page=1
@Body()                         // Corps complet de la requête
@Body("name")                   // Propriété spécifique du body
@Headers("authorization")       // Header spécifique
@Req()                          // Objet Request Express complet
@Res()                          // Objet Response Express (attention: bypass NestJS)
@Ip()                           // Adresse IP du client
@HostParam("account")           // Paramètre de sous-domaine
```

### Réponses personnalisées

```typescript
// Changer le code HTTP
@HttpCode(204)
@Delete(":id")
remove() { ... }

// Utiliser @Res() — attention, bypass les interceptors !
@Get()
findAll(@Res() res: Response) {
  const data = this.usersService.findAll();
  return res.status(200).json(data);
}

// Réponse passthrough (garde les interceptors)
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.cookie("token", "abc123");
  return this.usersService.findAll();
}
```

---

## 4. Providers & Services

Un provider = toute classe injectable (service, repository, factory...).

```typescript
// users/users.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
```

### Types de providers

```typescript
// 1. useClass (défaut avec @Injectable())
{ provide: UsersService, useClass: UsersService }

// 2. useValue (valeur statique)
{ provide: "CONFIG", useValue: { apiUrl: "http://api.com" } }

// 3. useFactory (factory function avec injection)
{
  provide: "DB_CONNECTION",
  useFactory: async (config: ConfigService) => {
    return createConnection(config.get("DB_URL"));
  },
  inject: [ConfigService],
}

// 4. useExisting (alias)
{ provide: "AliasService", useExisting: UsersService }
```

---

## 5. Dependency Injection

```typescript
// Injection par constructeur (recommandée)
@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @Inject("CONFIG") private readonly config: Config,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}
}

// Injection optionnelle
constructor(@Optional() @Inject("LOG") private logger?: LogService) {}

// Injection par propriété (moins recommandée)
@Injectable()
export class PostsService {
  @Inject(UsersService)
  private usersService: UsersService;
}
```

### Scopes de provider

```typescript
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.DEFAULT })    // Singleton (défaut) — une instance pour toute l'app
@Injectable({ scope: Scope.REQUEST })    // Une instance par requête HTTP
@Injectable({ scope: Scope.TRANSIENT })  // Une instance à chaque injection
```

---

## 6. Middleware

S'exécute avant le route handler. Accès à `req`, `res`, `next`.

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.url}`);
    next();  // OBLIGATOIRE pour passer au suivant
  }
}

// Middleware fonctionnel (plus simple)
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.url}`);
  next();
}
```

```typescript
// Enregistrement dans le module
@Module({ ... })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes("users");                            // Route spécifique

    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "users", method: RequestMethod.GET }); // Méthode spécifique

    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "users/login", method: RequestMethod.POST })
      .forRoutes(UsersController);                    // Tout le controller sauf exclusions

    consumer
      .apply(LoggerMiddleware)
      .forRoutes("*");                                // Toutes les routes
  }
}
```

---

## 7. Guards

Les Guards décident si une requête peut accéder à une route (authentification, autorisation).  
Retournent `true` (accès) ou `false` (403 Forbidden).

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  private validateRequest(req: Request): boolean {
    return !!req.headers.authorization;
  }
}
```

```typescript
// Utilisation
@UseGuards(AuthGuard)                          // Sur un controller entier
@Controller("users")
export class UsersController { ... }

@UseGuards(AuthGuard)                          // Sur une route
@Get("profile")
getProfile() { ... }

// Guard global (dans main.ts)
app.useGlobalGuards(new AuthGuard());

// Guard global avec injection (dans un module)
@Module({
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }]
})
```

### Décorateur custom avec Reflector (RBAC)

```typescript
// roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) return true;  // Pas de restriction
    const request = context.switchToHttp().getRequest();
    return roles.includes(request.user?.role);
  }
}

// Utilisation
@Roles("admin")
@UseGuards(RolesGuard)
@Delete(":id")
remove() { ... }
```

---

## 8. Interceptors

S'exécutent avant ET après le handler. Permettent de transformer la réponse, mesurer le temps, logger...

```typescript
// logging.interceptor.ts
import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    console.log("Avant le handler...");

    return next.handle().pipe(
      tap(() => console.log(`Après... ${Date.now() - start}ms`)),
    );
  }
}

// Transformer la réponse
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({ success: true, data, timestamp: new Date() })),
    );
  }
}
```

```typescript
// Utilisation
@UseInterceptors(LoggingInterceptor)
@Controller("users")
export class UsersController { ... }

// Global (main.ts)
app.useGlobalInterceptors(new LoggingInterceptor());

// Global avec injection (module)
@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }]
})
```

---

## 9. Pipes & Validation

Les Pipes transforment ou valident les données d'entrée.

### Pipes intégrés

```typescript
// ParseIntPipe — convertit string → number (400 si invalide)
@Get(":id")
findOne(@Param("id", ParseIntPipe) id: number) { ... }

// ParseUUIDPipe
@Get(":id")
findOne(@Param("id", ParseUUIDPipe) id: string) { ... }

// ParseBoolPipe, ParseArrayPipe, ParseFloatPipe
@Get()
findAll(@Query("active", ParseBoolPipe) active: boolean) { ... }

// DefaultValuePipe
@Get()
findAll(
  @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
) { ... }

// ValidationPipe (sur un paramètre)
@Post()
create(@Body(new ValidationPipe()) dto: CreateUserDto) { ... }
```

### Pipe personnalisé

```typescript
// parse-positive-int.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(`${metadata.data} doit être un entier positif`);
    }
    return val;
  }
}
```

---

## 10. Exception Filters

Capturent les exceptions et renvoient une réponse HTTP formatée.

### Exceptions intégrées

```typescript
import {
  BadRequestException,       // 400
  UnauthorizedException,     // 401
  ForbiddenException,        // 403
  NotFoundException,         // 404
  MethodNotAllowedException, // 405
  ConflictException,         // 409
  GoneException,             // 410
  UnprocessableEntityException, // 422
  InternalServerErrorException, // 500
  HttpException,             // Générique
} from "@nestjs/common";

// Utilisation dans un service
throw new NotFoundException("Utilisateur introuvable");
throw new ConflictException("Email déjà utilisé");
throw new BadRequestException(["name must not be empty"]);
throw new HttpException("Erreur custom", 418);
throw new HttpException({ message: "Erreur", code: "MY_ERROR" }, 400);
```

### Filtre personnalisé

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)  // @Catch() sans argument = attrape tout
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any).message,
    });
  }
}
```

```typescript
// Utilisation
@UseFilters(HttpExceptionFilter)
@Controller("users")
export class UsersController { ... }

// Global (main.ts)
app.useGlobalFilters(new HttpExceptionFilter());

// Global avec injection (module)
@Module({
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }]
})
```

---

## 11. DTOs & Validation

```bash
npm install class-validator class-transformer
```

### DTO de création

```typescript
// dto/create-user.dto.ts
import {
  IsString, IsEmail, IsInt, IsBoolean, IsOptional,
  IsNotEmpty, MinLength, MaxLength, Min, Max,
  IsEnum, IsArray, IsDateString, Matches,
  ValidateNested, IsObject,
} from "class-validator";
import { Type } from "class-transformer";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export class AddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: "Le mot de passe doit contenir une majuscule et un chiffre",
  })
  password: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @ValidateNested()       // Valider un objet imbriqué
  @Type(() => AddressDto)
  address?: AddressDto;
}
```

### DTO de mise à jour (PartialType)

```typescript
// dto/update-user.dto.ts
import { PartialType, OmitType, PickType, IntersectionType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

// Toutes les propriétés deviennent optionnelles
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Exclure certains champs
export class UpdateUserDto extends OmitType(CreateUserDto, ["password"] as const) {}

// Garder seulement certains champs
export class UpdateUserDto extends PickType(CreateUserDto, ["firstName", "email"] as const) {}

// Combiner deux DTOs
export class UpdateUserDto extends IntersectionType(CreateUserDto, AdditionalDto) {}
```

### Transformer avec class-transformer

```typescript
import { Exclude, Expose, Transform, Type } from "class-transformer";

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Exclude()           // Ne pas inclure dans la sortie sérialisée
  password: string;

  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Type(() => PostDto) // Transformer les objets imbriqués
  posts: PostDto[];
}
```

```typescript
// Dans main.ts pour utiliser class-transformer avec les réponses
import { ClassSerializerInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

// Dans l'entité User — le mot de passe sera exclu automatiquement
@Exclude()
password: string;
```

---

## 12. TypeORM Integration

```bash
npm install @nestjs/typeorm typeorm better-sqlite3
```

### Configuration dans AppModule

```typescript
// app.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),

    // Avec ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get("DB_TYPE"),
        host: config.get("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get("DB_USER"),
        password: config.get("DB_PASS"),
        database: config.get("DB_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: config.get("NODE_ENV") !== "production",
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### Entité

```typescript
// entities/user.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Post } from "../../posts/entities/post.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Utilisation dans un module feature

```typescript
// users/users.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Enregistre le Repository<User>
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],        // Exporter si besoin dans d'autres modules
})
export class UsersModule {}
```

```typescript
// users/users.service.ts
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}
}
```

---

## 13. Authentication (JWT)

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt
npm install @types/passport-jwt @types/passport-local @types/bcrypt --save-dev
```

### Auth Module complet

```typescript
// auth/strategies/local.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });  // Utiliser "email" au lieu de "username"
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Identifiants invalides");
    return user;
  }
}
```

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // payload = contenu décodé du JWT
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;  // Disponible dans req.user
  }
}
```

```typescript
// auth/auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({ ...dto, password: hashedPassword });
  }
}
```

```typescript
// auth/guards/local-auth.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}

// auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

```typescript
// auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/login — valide email + password, retourne un JWT
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.authService.login(req.user);  // req.user = retour de LocalStrategy.validate()
  }

  // POST /auth/register
  @Post("register")
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // GET /auth/profile — route protégée par JWT
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;  // req.user = retour de JwtStrategy.validate()
  }
}
```

```typescript
// auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_SECRET"),
        signOptions: { expiresIn: "7d" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Décorateur @CurrentUser

```typescript
// decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// Utilisation
@UseGuards(JwtAuthGuard)
@Get("profile")
getProfile(@CurrentUser() user: User) {
  return user;
}

@UseGuards(JwtAuthGuard)
@Get("my-email")
getEmail(@CurrentUser("email") email: string) {
  return email;
}
```

---

## 14. Configuration (.env)

```bash
npm install @nestjs/config
```

```env
# .env
NODE_ENV=development
PORT=3000
DB_TYPE=sqlite
DB_DATABASE=database.sqlite
JWT_SECRET=super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

```typescript
// app.module.ts
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,          // Pas besoin d'importer dans chaque module
      envFilePath: ".env",     // Chemin du fichier .env
      // envFilePath: [".env.local", ".env"],  // Plusieurs fichiers (priorité)
    }),
  ],
})
export class AppModule {}
```

```typescript
// Utilisation dans un service
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>("DB_DATABASE");
  }

  getPort(): number {
    return this.configService.get<number>("PORT", 3000);  // 3000 = valeur par défaut
  }
}

// Dans main.ts
const port = app.get(ConfigService).get<number>("PORT", 3000);
await app.listen(port);
```

### Configuration typée

```typescript
// config/database.config.ts
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => ({
  type: process.env.DB_TYPE || "sqlite",
  database: process.env.DB_DATABASE || "db.sqlite",
  synchronize: process.env.NODE_ENV !== "production",
}));

// app.module.ts
ConfigModule.forRoot({
  load: [databaseConfig],
})

// Utilisation
this.configService.get("database.type")     // "sqlite"
this.configService.get("database.database") // "db.sqlite"
```

---

## 15. Cycle de vie d'une requête

```
Requête HTTP entrante
       │
       ▼
  Middleware          → logger, cors, body-parser...
       │
       ▼
    Guards            → AuthGuard, RolesGuard... (canActivate)
       │
       ▼
  Interceptors        → avant le handler (before)
       │
       ▼
    Pipes             → validation et transformation des paramètres
       │
       ▼
 Route Handler        → méthode du Controller (@Get, @Post...)
       │
       ▼
  Interceptors        → après le handler (pipe(map(...)))
       │
       ▼
Exception Filters     → si une exception a été levée
       │
       ▼
  Réponse HTTP
```

### Hooks de cycle de vie des providers

```typescript
import {
  OnModuleInit, OnModuleDestroy,
  OnApplicationBootstrap, OnApplicationShutdown,
  BeforeApplicationShutdown,
} from "@nestjs/common";

@Injectable()
export class UsersService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log("Module initialisé — connexions, seeds...");
  }

  async onModuleDestroy() {
    console.log("Module détruit — nettoyage...");
  }
}

// Dans main.ts — activer le graceful shutdown
app.enableShutdownHooks();
```

---

## 16. Cas pratiques & patterns

### Décorateur combiné personnalisé

```typescript
// decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "./roles.decorator";

export function Auth(...roles: string[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}

// Utilisation
@Auth("admin")
@Delete(":id")
remove(@Param("id") id: string) { ... }
```

### Réponse paginée

```typescript
// common/dto/pagination.dto.ts
import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

// Dans le service
async findAll(dto: PaginationDto) {
  const { page = 1, limit = 10 } = dto;
  const [data, total] = await this.userRepo.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data, total, page, lastPage: Math.ceil(total / limit) };
}
```

### Service avec DataSource (transactions)

```typescript
@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  async createOrder(dto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, dto);
      await manager.save(order);

      await manager.update(Product, dto.productId, {
        stock: () => `stock - ${dto.quantity}`,
      });

      return order;
    });
  }
}
```

### Interceptor de mise en cache simple

```typescript
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const key = context.switchToHttp().getRequest().url;
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }
    return next.handle().pipe(
      tap((data) => this.cache.set(key, data)),
    );
  }
}
```

### Guard JWT global avec route publique

```typescript
// decorators/public.decorator.ts
import { SetMetadata } from "@nestjs/common";
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// Enregistrer comme guard global dans AppModule
{ provide: APP_GUARD, useClass: JwtAuthGuard }

// Utilisation — cette route bypass le guard global
@Public()
@Post("login")
login() { ... }
```

---

## 17. Erreurs fréquentes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Nest can't resolve dependencies` | Injection manquante ou module non importé | Vérifier que le provider est dans `providers[]` et le module dans `imports[]` |
| `Cannot GET /route` | Route mal définie ou module non importé dans AppModule | Vérifier `@Controller("prefix")` et que le module est dans AppModule |
| `ValidationPipe` n'a pas d'effet | `class-validator` non installé ou pipe non activé | `npm install class-validator class-transformer` + activer globalement |
| `@Exclude()` n'a pas d'effet | `ClassSerializerInterceptor` non activé | `app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))` |
| JWT invalide / non reconnu | Mauvais secret ou `JwtStrategy` non dans providers | Vérifier `JWT_SECRET` et que `JwtStrategy` est dans `providers[]` du AuthModule |
| `req.user` est undefined | JwtAuthGuard non appliqué ou JwtStrategy non configurée | Appliquer `@UseGuards(JwtAuthGuard)` sur la route |
| `Entity metadata not found` | Entité non déclarée dans `TypeOrmModule.forFeature()` | Ajouter l'entité dans `forFeature([User])` du module |
| Circular dependency | Deux modules s'importent mutuellement | Utiliser `forwardRef(() => ModuleA)` dans les imports et injections |
| `Cannot use import statement` | Module ES vs CommonJS | Vérifier `"module": "commonjs"` dans tsconfig |

### Circular Dependency

```typescript
// Si UsersModule et AuthModule s'importent mutuellement :

// users.module.ts
@Module({
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}

// auth.module.ts
@Module({
  imports: [forwardRef(() => UsersModule)],
})
export class AuthModule {}

// Dans les services :
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
}
```

---

## 18. Aide-mémoire rapide

### Commandes CLI

```bash
nest g mo nom          # Module
nest g co nom          # Controller
nest g s  nom          # Service
nest g gu nom          # Guard
nest g mi nom          # Middleware
nest g in nom          # Interceptor
nest g pi nom          # Pipe
nest g f  nom          # Filter
nest g d  nom          # Decorator
nest g resource nom    # CRUD complet (module + controller + service + DTOs)
```

### Structure minimale d'un module CRUD

```typescript
// ── entity ──────────────────────────────────────
@Entity()
export class Item {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
}

// ── DTO ─────────────────────────────────────────
export class CreateItemDto {
  @IsNotEmpty() @IsString() name: string;
}
export class UpdateItemDto extends PartialType(CreateItemDto) {}

// ── Service ─────────────────────────────────────
@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Item) private repo: Repository<Item>) {}
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOneByOrFail({ id }); }
  create(dto: CreateItemDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: UpdateItemDto) {
    const item = await this.findOne(id);
    return this.repo.save(Object.assign(item, dto));
  }
  async remove(id: number) { await this.repo.delete(id); }
}

// ── Controller ──────────────────────────────────
@Controller("items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  @Get()              findAll() { return this.itemsService.findAll(); }
  @Get(":id")         findOne(@Param("id", ParseIntPipe) id: number) { return this.itemsService.findOne(id); }
  @Post()             create(@Body() dto: CreateItemDto) { return this.itemsService.create(dto); }
  @Patch(":id")       update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateItemDto) { return this.itemsService.update(id, dto); }
  @Delete(":id") @HttpCode(204) remove(@Param("id", ParseIntPipe) id: number) { return this.itemsService.remove(id); }
}

// ── Module ──────────────────────────────────────
@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
```

---

*Bonne chance pour ton exam ! 🎯*
