# Formularios: listado, edición y encuestas

## Estado actual
- Admin solo edita `forms[0]`.
- `/encuesta` exige `published=true`; el único form está en `false`.
- No hay borrar ni listar.

## Estado final
- Admin: lista, crear, editar, publicar, borrar.
- `/encuesta` lista publicadas; `/encuesta/[id]` abre una.
- Landing muestra encuestas publicadas.
