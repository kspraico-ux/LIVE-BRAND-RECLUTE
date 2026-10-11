# LIVE-BRAND-RECLUTE

Landing morada de reclutamiento + panel de gestión para **Live Brand**, agencia oficial de crecimiento digital para creadores de lives en TikTok (LATAM).

## Stack

- React 18 + Vite + TypeScript estricto
- Tailwind CSS (paleta morada: `#8B5CF6` → `#D946EF`)
- Datos 100% frontend persistidos en `localStorage`
- El formulario de inscripción envía a [Formspree](https://formspree.io/f/mppwnnng) y guarda una copia local para el panel
- Tests: Vitest + Testing Library

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción en dist/
npm run preview  # previsualizar el build
npm run lint     # eslint
npm run typecheck# tsc --noEmit
npm test         # tests (npm run test:watch para watch mode)
```

## Estructura

- `#/` — Landing pública: hero animado (canvas de partículas), formulario de inscripción gratuita en 2 pasos (justo debajo del hero) y plan de reclutamiento con tiempos.
- `#/panel` — Panel interno (enlace "Panel interno" en el navbar o footer): KPIs, distribución de estados, listado de postulantes con búsqueda, filtros y orden persistidos, detalle con acciones masivas, deshacer, exportar CSV y backup/restore.
- Cualquier hash desconocido muestra una 404 con enlace al inicio.

## Funciones

- Formulario de inscripción gratuita: único requisito confirmar la aprobación previa como potencial emergente por TikTok LIVE LATAM; métricas (seguidores, viewers, horas) opcionales; validación en 2 pasos (al salir del campo y con resumen de errores), categorías como chips, atajos rápidos, campos de contacto opcionales colapsables, anti-duplicados por @, envío a Formspree con estado de carga/error reintentable y registro local.
- Estados de postulante: pendiente → contactado → aprobado / rechazado, con historial y deshacer.
- KPIs: total de postulantes, aprobados, conversión, pendientes, seguidores y horas de live acumuladas.
- Exportar CSV, backup/restore en JSON y restaurar datos de demostración.
- Seed de datos de ejemplo para el panel en `src/data/seedApplicants.ts`.

## Despliegue

1. `npm run build` → genera `dist/` (rutas relativas con `base: './'`, sirve en cualquier subdirectorio).
2. **GitHub Pages**: publica la carpeta `dist/` en la rama `gh-pages` (o como `docs/` con Actions). `public/404.html` redirige rutas desconocidas al inicio.
3. **Netlify / Vercel**: build command `npm run build`, output directory `dist`. No se requieren redirects (ruteo por hash).
4. Configura tu dominio definitivo en `index.html` (comentarios `SITE_URL`: `canonical`, `og:url`, `og:image`, JSON-LD) y actualiza `SITE_URL` ahí mismo.
5. El endpoint de Formspree (`https://formspree.io/f/mppwnnng`) está en `src/services/formspree.ts`; cámbialo si usas otro formulario.
