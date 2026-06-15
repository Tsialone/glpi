# 📚 Bible class-validator — Référence Complète

> class-validator · class-transformer · TypeScript

---

## Table des matières

1. [Installation & Setup](#1-installation--setup)
2. [Décorateurs — Communs](#2-décorateurs--communs)
3. [Décorateurs — Strings](#3-décorateurs--strings)
4. [Décorateurs — Nombres](#4-décorateurs--nombres)
5. [Décorateurs — Dates](#5-décorateurs--dates)
6. [Décorateurs — Tableaux](#6-décorateurs--tableaux)
7. [Décorateurs — Objets & imbriqués](#7-décorateurs--objets--imbriqués)
8. [Décorateurs — Types & formats spéciaux](#8-décorateurs--types--formats-spéciaux)
9. [Options des décorateurs](#9-options-des-décorateurs)
10. [validate() & validateSync()](#10-validate--validatesync)
11. [Groupes de validation](#11-groupes-de-validation)
12. [Validateurs personnalisés](#12-validateurs-personnalisés)
13. [class-transformer](#13-class-transformer)
14. [Intégration NestJS](#14-intégration-nestjs)
15. [Patterns courants](#15-patterns-courants)
16. [Aide-mémoire rapide](#16-aide-mémoire-rapide)

---

## 1. Installation & Setup

```bash
npm install class-validator class-transformer
```

> ⚠️ Les deux packages vont toujours ensemble.

```typescript
// tsconfig.json — obligatoire
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Utilisation de base

```typescript
import { IsString, IsEmail, IsInt, Min, validate } from "class-validator";
import { plainToInstance } from "class-transformer";

class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  age: number;
}

// Valider un objet plain (JSON)
const dto = plainToInstance(CreateUserDto, { name: "Jean", email: "jean@test.com", age: 25 });
const errors = await validate(dto);

if (errors.length > 0) {
  console.log(errors);  // tableau de ValidationError
} else {
  console.log("Valide !");
}
```

---

## 2. Décorateurs — Communs

Ces décorateurs fonctionnent sur tous les types.

```typescript
@IsDefined()          // Pas undefined (null est accepté)
@IsNotEmpty()         // Pas vide : '', null, undefined, 0, false, [] sont rejetés
@IsEmpty()            // Doit être vide
@IsOptional()         // Si la valeur est null ou undefined, ignore toutes les autres validations
@IsNotEmptyObject()   // Objet non vide ({} est rejeté)

@Equals("valeur")           // Égalité stricte
@NotEquals("valeur")        // Différent de la valeur
@IsIn(["a", "b", "c"])      // Doit être dans la liste
@IsNotIn(["x", "y"])        // Ne doit pas être dans la liste
```

---

## 3. Décorateurs — Strings

```typescript
@IsString()                   // Doit être une chaîne
@IsNotEmpty()                 // Chaîne non vide (après trim implicite)
@MinLength(3)                 // Longueur minimale
@MaxLength(100)               // Longueur maximale
@Length(3, 50)                // Entre 3 et 50 caractères

@IsAlpha()                    // Uniquement lettres (a-z, A-Z)
@IsAlpha("fr-FR")             // Avec accents français
@IsAlphanumeric()             // Lettres et chiffres uniquement
@IsAlphanumeric("fr-FR")

@IsLowercase()                // Tout en minuscules
@IsUppercase()                // Tout en majuscules

@Contains("mot")              // Doit contenir "mot"
@NotContains("mot")           // Ne doit pas contenir "mot"

@IsEmail()                    // Format email valide
@IsUrl()                      // URL valide
@IsUrl({ protocols: ["http", "https"], require_tld: true })

@IsFQDN()                     // Nom de domaine valide (ex: example.com)
@IsIP()                       // Adresse IP (v4 ou v6)
@IsIP("4")                    // IPv4 seulement
@IsIP("6")                    // IPv6 seulement

@IsUUID()                     // UUID (toutes versions)
@IsUUID("4")                  // UUID v4 spécifiquement

@IsISO8601()                  // Date ISO 8601 (ex: "2025-06-11T12:00:00Z")
@IsDateString()               // Alias de IsISO8601()

@IsMobilePhone("fr-FR")       // Numéro de téléphone français
@IsMobilePhone()              // Numéro de téléphone (tous pays)

@IsPostalCode("FR")           // Code postal français
@IsCreditCard()               // Numéro de carte bancaire
@IsIBAN()                     // Numéro IBAN

@IsHexColor()                 // Couleur hex (#FFF ou #FFFFFF)
@IsRgbColor()                 // Couleur RGB (rgb(0,0,0))

@IsBase64()                   // Chaîne encodée en Base64
@IsHexadecimal()              // Chaîne hexadécimale

@IsJSON()                     // JSON valide (string)
@IsJWT()                      // Token JWT valide
@IsSemVer()                   // Version sémantique (1.0.0)
@IsISBN()                     // ISBN livre
@IsISBN("10")                 // ISBN-10
@IsISBN("13")                 // ISBN-13

@Matches(/^[A-Z]{3}$/)                              // Regex
@Matches(/^[A-Z]{3}$/, { message: "3 majuscules" }) // Regex + message custom
```

---

## 4. Décorateurs — Nombres

```typescript
@IsNumber()                      // Nombre (integer ou float), rejette NaN
@IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
@IsInt()                         // Entier (pas de décimales)
@IsPositive()                    // > 0
@IsNegative()                    // < 0
@Min(0)                          // >= 0
@Max(100)                        // <= 100
@IsDivisibleBy(5)                // Divisible par 5

@IsNumberString()                // Chaîne qui représente un nombre ("42", "3.14")

// Booléens
@IsBoolean()                     // true ou false
@IsBooleanString()               // "true" ou "false"
```

---

## 5. Décorateurs — Dates

```typescript
@IsDate()           // Instance de Date JavaScript
@IsDateString()     // Chaîne ISO 8601 : "2025-06-11" ou "2025-06-11T12:00:00Z"
@MinDate(new Date("2000-01-01"))    // Date >= à la date donnée
@MaxDate(new Date())               // Date <= à la date donnée
```

---

## 6. Décorateurs — Tableaux

```typescript
@IsArray()                    // Doit être un tableau
@ArrayNotEmpty()              // Tableau non vide
@ArrayMinSize(1)              // Au moins 1 élément
@ArrayMaxSize(10)             // Au plus 10 éléments
@ArrayUnique()                // Pas de doublons

// Valider chaque élément du tableau avec { each: true }
@IsString({ each: true })     // Chaque élément doit être une string
@IsInt({ each: true })        // Chaque élément doit être un entier
@IsEmail({ each: true })      // Chaque élément doit être un email
@Min(0, { each: true })       // Chaque élément >= 0
@IsIn(["a", "b"], { each: true })  // Chaque élément dans la liste

// Exemple complet
class Dto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MinLength(2, { each: true })
  tags: string[];
}
```

---

## 7. Décorateurs — Objets & imbriqués

```typescript
import { ValidateNested, ValidateIf } from "class-validator";
import { Type } from "class-transformer";

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  city: string;

  @IsPostalCode("FR")
  zipCode: string;
}

class CreateUserDto {
  @IsString()
  name: string;

  // Objet imbriqué simple
  @ValidateNested()
  @Type(() => AddressDto)   // OBLIGATOIRE pour que la transformation fonctionne
  address: AddressDto;

  // Tableau d'objets imbriqués
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];

  // Validation conditionnelle
  @ValidateIf((o) => o.role === "admin")   // Valider seulement si role === "admin"
  @IsString()
  @IsNotEmpty()
  adminCode?: string;

  // Valider seulement si le champ n'est pas null/undefined
  @IsOptional()
  @IsString()
  nickname?: string;
}
```

---

## 8. Décorateurs — Types & formats spéciaux

```typescript
// Enum
import { IsEnum } from "class-validator";

enum UserRole { ADMIN = "admin", USER = "user", MODERATOR = "mod" }

class Dto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(UserRole, { message: "role doit être : admin, user ou mod" })
  role: UserRole;
}

// Instance d'une classe
@IsInstance(Date)
birthDate: Date;

// Types primitifs
@IsString()
@IsNumber()
@IsBoolean()
@IsInt()
@IsArray()
@IsObject()

// Valeurs spéciales
@IsNull()        // Doit être null
@IsUndefined()   // Doit être undefined
@IsNaN()         // Doit être NaN
```

---

## 9. Options des décorateurs

Tous les décorateurs acceptent un objet d'options en dernier paramètre.

```typescript
// Message d'erreur personnalisé
@IsEmail({}, { message: "Adresse email invalide" })
email: string;

// Message dynamique avec accès aux infos
@Min(18, {
  message: (args) =>
    `${args.property} doit être >= ${args.constraints[0]}, reçu: ${args.value}`,
})
age: number;

// args contient :
// args.targetName  → nom de la classe
// args.property    → nom de la propriété
// args.value       → valeur reçue
// args.constraints → tableau des contraintes du décorateur

// Groupes de validation
@IsEmail({}, { groups: ["create", "update"] })
email: string;

// Toujours valider (même si d'autres validations ont échoué)
@IsString({ always: true })
name: string;

// Contexte personnalisé (récupérable dans l'erreur)
@IsEmail({}, { context: { errorCode: "INVALID_EMAIL", httpStatus: 400 } })
email: string;
```

---

## 10. validate() & validateSync()

```typescript
import { validate, validateSync, validateOrReject } from "class-validator";

// Asynchrone — retourne Promise<ValidationError[]>
const errors = await validate(dto);
const errors = await validate(dto, {
  skipMissingProperties: false,  // Valider les props manquantes (défaut: false)
  whitelist: true,               // Supprimer les props sans décorateur
  forbidNonWhitelisted: true,    // Lever une erreur si props inconnues
  groups: ["create"],            // Valider seulement ce groupe
  forbidUnknownValues: true,     // Rejeter les objets inconnus
  stopAtFirstError: false,       // S'arrêter à la première erreur par propriété
});

// Synchrone — retourne ValidationError[]
const errors = validateSync(dto);

// Lance une exception si invalide
await validateOrReject(dto);
// try/catch :
try {
  await validateOrReject(dto);
} catch (errors) {
  console.log(errors); // ValidationError[]
}
```

### Structure d'une ValidationError

```typescript
interface ValidationError {
  target: object;                        // L'objet validé
  property: string;                      // Nom de la propriété
  value: any;                            // Valeur reçue
  constraints: {                         // Contraintes violées
    isEmail: "email must be an email",
    minLength: "name must be longer than or equal to 3 characters",
  };
  children?: ValidationError[];          // Erreurs imbriquées
  contexts?: object;                     // Contextes personnalisés
}

// Extraire les messages d'erreur
function getErrorMessages(errors: ValidationError[]): string[] {
  return errors.flatMap((err) =>
    err.constraints ? Object.values(err.constraints) : []
  );
}
```

---

## 11. Groupes de validation

Les groupes permettent d'appliquer des règles différentes selon le contexte (création vs mise à jour).

```typescript
import { IsString, IsEmail, IsOptional, MinLength, validate } from "class-validator";

class UserDto {
  @IsString({ groups: ["create", "update"] })
  @MinLength(2, { groups: ["create", "update"] })
  name: string;

  @IsEmail({}, { groups: ["create"] })   // Requis seulement à la création
  email: string;

  @IsOptional({ groups: ["update"] })    // Optionnel à la mise à jour
  @MinLength(8, { groups: ["create", "update"] })
  password: string;

  // Sans groupe = toujours validé (groupe "default")
  @IsString()
  role: string;
}

// Valider avec un groupe spécifique
const dto = plainToInstance(UserDto, data);
const errors = await validate(dto, { groups: ["create"] });
```

---

## 12. Validateurs personnalisés

### Avec @ValidatorConstraint + @Validate

```typescript
import {
  ValidatorConstraint, ValidatorConstraintInterface,
  ValidationArguments, Validate
} from "class-validator";

@ValidatorConstraint({ name: "isStrongPassword", async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} doit contenir majuscule, minuscule, chiffre et symbole`;
  }
}

// Utilisation
class Dto {
  @Validate(IsStrongPasswordConstraint)
  password: string;
}
```

### Avec @ValidatorConstraint async (ex: vérifier unicité en base)

```typescript
@ValidatorConstraint({ name: "isEmailUnique", async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const user = await this.usersService.findByEmail(email);
    return !user;  // true = valide (email pas encore utilisé)
  }

  defaultMessage(): string {
    return "Cet email est déjà utilisé";
  }
}

// Dans NestJS — enregistrer comme provider dans le module
// Et dans main.ts :
useContainer(app.select(AppModule), { fallbackOnErrors: true });
```

### Décorateur personnalisé (avec registerDecorator)

```typescript
import {
  registerDecorator, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

// 1. Définir la contrainte
@ValidatorConstraint({ async: false })
export class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return confirmPassword === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    return "Les mots de passe ne correspondent pas";
  }
}

// 2. Créer le décorateur
export function IsPasswordMatch(property: string, options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [property],
      validator: IsPasswordMatchConstraint,
    });
  };
}

// 3. Utilisation
class RegisterDto {
  @IsString()
  @MinLength(8)
  password: string;

  @IsPasswordMatch("password")
  confirmPassword: string;
}
```

---

## 13. class-transformer

class-transformer transforme des objets plain (JSON) en instances de classe et vice-versa.

### plainToInstance (JSON → classe)

```typescript
import { plainToInstance, instanceToPlain } from "class-transformer";

class UserDto {
  id: number;
  firstName: string;
}

const plain = { id: 1, firstName: "Jean", password: "secret" };
const user = plainToInstance(UserDto, plain);  // instance de UserDto

// Tableau
const users = plainToInstance(UserDto, [plain, plain]);
```

### instanceToPlain (classe → JSON)

```typescript
const plain = instanceToPlain(userInstance);
// Retourne un objet JavaScript ordinaire (respecte @Exclude, @Expose)
```

### @Expose et @Exclude

```typescript
import { Expose, Exclude } from "class-transformer";

class UserDto {
  @Expose() id: number;
  @Expose() firstName: string;

  @Exclude()           // Exclu de la sérialisation
  password: string;
}

// excludeExtraneousValues: true → exclut tout ce qui n'a pas @Expose
const user = plainToInstance(UserDto, plain, {
  excludeExtraneousValues: true,
});

// @Expose avec nom alternatif (lecture depuis "first_name" JSON)
@Expose({ name: "first_name" })
firstName: string;

// Groupes sur @Expose
@Expose({ groups: ["admin"] })
secretField: string;

const dto = plainToInstance(UserDto, plain, { groups: ["admin"] });
```

### @Transform

```typescript
import { Transform } from "class-transformer";

class Dto {
  // Convertir en majuscules
  @Transform(({ value }) => value?.toUpperCase())
  name: string;

  // Trim automatique
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  email: string;

  // Valeur par défaut si null/undefined
  @Transform(({ value }) => value ?? "anonyme")
  displayName: string;

  // Accéder à l'objet complet
  @Transform(({ value, obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;
}
```

### @Type (objets imbriqués & conversions)

```typescript
import { Type } from "class-transformer";

class PostDto {
  @Type(() => Date)         // Convertir string → Date
  publishedAt: Date;

  @Type(() => AddressDto)   // Convertir objet imbriqué
  address: AddressDto;

  @Type(() => TagDto)       // Convertir tableau d'objets
  tags: TagDto[];
}
```

### Options de plainToInstance

```typescript
plainToInstance(UserDto, plain, {
  excludeExtraneousValues: true,  // Exclure ce qui n'a pas @Expose
  enableImplicitConversion: true, // Convertir automatiquement selon les types TS
  groups: ["public"],             // Groupes à exposer
  strategy: "excludeAll",         // "excludeAll" | "exposeAll" (défaut)
  excludePrefixes: ["_"],         // Exclure les propriétés commençant par "_"
});
```

### enableImplicitConversion

```typescript
// Avec enableImplicitConversion: true :
// les types TypeScript guident la conversion automatique

class Dto {
  age: number;       // "25" → 25 automatiquement
  active: boolean;   // "true" → true automatiquement
}

const dto = plainToInstance(Dto, { age: "25", active: "true" }, {
  enableImplicitConversion: true,
});
```

---

## 14. Intégration NestJS

### ValidationPipe global

```typescript
// main.ts
import { ValidationPipe } from "@nestjs/common";

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,              // Supprime les propriétés sans décorateur dans le DTO
  forbidNonWhitelisted: true,   // Retourne 400 si propriétés inconnues
  transform: true,              // Convertit automatiquement les types
  transformOptions: {
    enableImplicitConversion: true,
  },
  stopAtFirstError: false,
  exceptionFactory: (errors) => {
    const messages = errors.map((err) => ({
      field: err.property,
      errors: Object.values(err.constraints || {}),
    }));
    return new BadRequestException({ message: "Validation échouée", errors: messages });
  },
}));
```

### Validator async avec DI (useContainer)

```typescript
// main.ts
import { useContainer } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  // ...
}
```

### DTO complet pour NestJS

```typescript
import {
  IsString, IsEmail, IsInt, IsOptional, IsNotEmpty,
  MinLength, MaxLength, Min, Max, IsEnum, IsArray,
  Matches, ValidateNested,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

export enum Role { USER = "user", ADMIN = "admin" }

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: "Email invalide" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: "Le mot de passe doit contenir au moins une majuscule et un chiffre",
  })
  password: string;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  @Type(() => Number)
  age?: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.USER;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  tags?: string[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

---

## 15. Patterns courants

### DTO de pagination

```typescript
import { Type } from "class-transformer";
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from "class-validator";

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

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc" = "asc";

  @IsOptional()
  @IsString()
  search?: string;
}
```

### Valider une query string (params toujours strings)

```typescript
class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  // Tableau depuis query string (?tags=a&tags=b)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];
}
```

### Sanitization + validation

```typescript
class CreatePostDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Transform(({ value }) => value?.replace(/<[^>]*>/g, ""))  // Supprimer les balises HTML
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Transform(({ value }) =>
    value?.map((tag: string) => tag.toLowerCase().trim())
  )
  tags?: string[];
}
```

### Réponse d'erreur formatée

```typescript
function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  return errors.reduce((acc, err) => {
    if (err.constraints) {
      acc[err.property] = Object.values(err.constraints);
    }
    if (err.children?.length) {
      const nested = formatValidationErrors(err.children);
      Object.entries(nested).forEach(([key, messages]) => {
        acc[`${err.property}.${key}`] = messages;
      });
    }
    return acc;
  }, {} as Record<string, string[]>);
}

// Résultat :
// {
//   "email": ["email must be an email"],
//   "address.zipCode": ["zipCode must be a valid postal code"]
// }
```

---

## 16. Aide-mémoire rapide

### Décorateurs les plus utilisés

```typescript
// Obligatoire / optionnel
@IsNotEmpty()         // Pas vide
@IsOptional()         // Optionnel (ignore si null/undefined)

// Types
@IsString()
@IsNumber()
@IsInt()
@IsBoolean()
@IsArray()
@IsDate()
@IsEnum(MyEnum)

// Strings
@MinLength(n)
@MaxLength(n)
@Length(min, max)
@IsEmail()
@IsUrl()
@IsUUID()
@Matches(/regex/)

// Nombres
@Min(n)
@Max(n)
@IsPositive()
@IsNegative()
@IsDivisibleBy(n)

// Tableaux
@ArrayMinSize(n)
@ArrayMaxSize(n)
@ArrayUnique()
@IsString({ each: true })   // Valider chaque élément

// Objets imbriqués
@ValidateNested()
@Type(() => MyClass)        // Toujours avec ValidateNested

// Conditionnel
@ValidateIf((o) => condition)

// Transformation (class-transformer)
@Type(() => Number)            // Convertir pour query params
@Transform(({ value }) => ...) // Transformation custom
@Expose()                      // Inclure dans la sortie
@Exclude()                     // Exclure de la sortie

@DeleteDateColumn({ name: 'date_suppression' })
deletedAt: Date; 
```

### Checklist DTO NestJS

```
✅ @IsOptional() sur les propriétés optionnelles (ne remplace pas le ? TypeScript)
✅ @Type(() => Number) sur les nombres venant de @Query / @Param (toujours des strings)
✅ @ValidateNested() + @Type(() => ClassName) pour les objets imbriqués
✅ { each: true } pour valider les éléments d'un tableau
✅ ValidationPipe avec transform: true dans main.ts
✅ useContainer() si validators asynchrones avec DI NestJS
✅ import "reflect-metadata" en point d'entrée
```

---

*Bonne chance pour ton exam ! 🎯*

