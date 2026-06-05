# Documentation Complète : Class-Validator avec NestJS

## 1. Installation et Configuration

`class-validator` permet de valider les objets (DTOs) via des décorateurs.

### Installation
```bash
npm install class-validator class-transformer
```

### Configuration Globale (`main.ts`)
```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime automatiquement les champs non définis dans le DTO
    forbidNonWhitelisted: true, // Jette une erreur si des champs non autorisés sont envoyés
    transform: true, // Transforme automatiquement les payloads en instances des classes DTO
    disableErrorMessages: process.env.NODE_ENV === 'production', 
  }));

  await app.listen(3000);
}
bootstrap();
```

---

## 2. Tous les Décorateurs

Voici les décorateurs les plus utilisés pour valider vos DTOs.

### Types Communs et Base
```typescript
@IsString()
@IsInt() // Entier
@IsNumber() // Nombre (entier ou décimal)
@IsBoolean()
@IsDate() // Date objet (nécessite @Type(() => Date))
@IsDateString() // Chaîne de caractères au format ISO 8601
@IsArray()
@IsEnum(RoleEnum) // Doit correspondre à une valeur de l'enum
```

### Chaînes de caractères (Strings)
```typescript
@IsEmail()
@MinLength(10, { message: 'Le titre est trop court' })
@MaxLength(50)
@IsNotEmpty() // Interdit '', null, undefined
@IsOptional() // Si absent, passe la validation sans vérifier les autres règles
@IsUUID('4') // Doit être un UUID version 4
@IsUrl()
@IsHexColor()
@IsAlphanumeric()
@Matches(/^[a-zA-Z0-9_]+$/) // Regex
```

### Nombres
```typescript
@Min(0) // Valeur minimale (ex: âge)
@Max(120) // Valeur maximale
@IsPositive() // Strictement > 0
@IsNegative()
```

### Tableaux et Objets Imbriqués
```typescript
@IsArray()
@IsString({ each: true }) // Chaque élément doit être une string
tags: string[];

@ValidateNested() // Demande de valider cet objet interne
@Type(() => ProfileDto) 
profile: ProfileDto;
```

---

## 3. Validateurs Personnalisés

Si les décorateurs de base ne suffisent pas, voici comment créer le vôtre.

### Exemple : Décorateur `@IsUserAlreadyExist`
**1. La contrainte**
```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findByEmail(email);
    return !user; 
  }

  defaultMessage(args: ValidationArguments) {
    return 'L\'email $value est déjà utilisé.';
  }
}
```

**2. Le Décorateur**
```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
```
