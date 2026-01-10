# Angular App - Arquitectura Feature-Based

Este proyecto Angular 21 utiliza una arquitectura feature-based organizada en tres módulos principales:

## Estructura del Proyecto

```
src/app/
├── core/                 # Servicios singleton, guards e interceptors
│   ├── guards/          # Guards de autenticación y autorización
│   ├── interceptors/    # Interceptors HTTP
│   ├── services/        # Servicios globales singleton
│   └── models/          # Interfaces y tipos core
│
├── features/            # Módulos funcionales de la aplicación
│   └── [feature-name]/  # Cada feature es un módulo independiente
│       ├── components/  # Componentes del feature
│       ├── services/    # Servicios específicos del feature
│       └── models/      # Modelos específicos del feature
│
└── shared/              # Recursos compartidos entre features
    ├── components/      # Componentes reutilizables
    ├── directives/      # Directivas compartidas
    ├── pipes/           # Pipes personalizadas
    └── utils/           # Utilidades y helpers
```

## Principios de la Arquitectura

### Core Module
- **Propósito**: Servicios singleton y funcionalidad core de la aplicación
- **Reglas**: 
  - Solo debe importarse una vez en `app.config.ts`
  - Contiene servicios globales (autenticación, logging, etc.)
  - Guards e interceptors HTTP
  - Modelos de datos core

### Features Module
- **Propósito**: Módulos funcionales independientes de la aplicación
- **Reglas**:
  - Cada feature es autocontenido y lazy-loaded cuando sea posible
  - No deben tener dependencias entre features
  - Pueden importar shared y core
  - Usar standalone components

### Shared Module
- **Propósito**: Componentes, directivas y pipes reutilizables
- **Reglas**:
  - No debe tener dependencias de features
  - Puede importar desde core
  - Componentes dumb/presentacionales
  - Todos los componentes son standalone

## Comandos Útiles

### Desarrollo
```bash
npm start              # Ejecutar servidor de desarrollo
npm run build          # Build para producción
npm test               # Ejecutar tests unitarios
```

### Generar Nuevos Elementos

#### Feature
```bash
ng generate component features/[feature-name]/components/[component-name]
ng generate service features/[feature-name]/services/[service-name]
```

#### Core
```bash
ng generate service core/services/[service-name]
ng generate guard core/guards/[guard-name]
ng generate interceptor core/interceptors/[interceptor-name]
```

#### Shared
```bash
ng generate component shared/components/[component-name]
ng generate directive shared/directives/[directive-name]
ng generate pipe shared/pipes/[pipe-name]
```

## Best Practices

1. **Standalone Components**: Todos los componentes deben ser standalone (Angular 21 default)
2. **Signals**: Usar signals para manejo de estado reactivo
3. **Lazy Loading**: Implementar lazy loading para features
4. **TypeScript Strict**: Mantener el modo strict habilitado
5. **Change Detection**: Usar `ChangeDetectionStrategy.OnPush`
6. **Accessibility**: Seguir WCAG AA guidelines
