# DanielaFit PWA

App privada de entrenamiento para iPhone, hecha como Progressive Web App para poder usarla desde Windows sin Mac ni Xcode.

## Qué incluye el MVP

- Pantalla Hoy con score diario 0-100.
- Check-in diario: sueño, energía, motivación, tiempo disponible, dolor espalda/cuello, peso, pasos, hidratación y desayuno.
- Rutina automática por día:
  - Lunes: pierna + glúteos.
  - Martes: tenis + movilidad.
  - Miércoles: torso + postura.
  - Jueves: tenis + core.
  - Viernes: full body funcional.
  - Sábado/domingo: descanso.
- Ajuste automático de rutina:
  - Modo normal.
  - Modo rápido si hay poco tiempo.
  - Versión ligera si hay mal sueño/baja energía.
  - Recuperación activa si hay dolor alto.
- Pesos recomendados y progresión automática.
- Registro de peso usado, reps y esfuerzo.
- Historial de entrenamientos.
- Progreso con gráfico simple de peso corporal.
- Datos locales en el navegador del iPhone.
- Botón para borrar todos los datos.
- PWA con manifest e ícono para Home Screen.
- Service worker para cache/offline cuando se publique por HTTPS.

## Límites del MVP

- No tiene integración automática con Fitbit todavía.
- No tiene notificaciones push reales con servidor.
- No tiene videos reales de ejercicios; incluye guías de técnica en texto.
- No sube datos a la nube.

## Instalación recomendada en iPhone

La forma más práctica es publicarla con GitHub Pages y abrirla desde Safari en el iPhone.

### Publicar en GitHub Pages

1. Crea una cuenta en GitHub si no tienes una.
2. Crea un repositorio nuevo llamado `danielafit`.
3. Sube todos los archivos de esta carpeta al repositorio.
4. Entra a Settings > Pages.
5. En Source, selecciona Deploy from a branch.
6. Selecciona la rama `main` y carpeta `/root`.
7. Guarda.
8. GitHub te dará una URL tipo `https://tuusuario.github.io/danielafit/`.
9. Abre esa URL en Safari desde tu iPhone.
10. Usa Share > Add to Home Screen.

## Uso diario

1. Abre DanielaFit después de las 5:00 PM.
2. Llena el check-in.
3. Presiona Guardar y ajustar rutina.
4. Ve a Rutina.
5. Usa el peso recomendado.
6. Al terminar cada ejercicio, registra peso usado, reps y esfuerzo.
7. Presiona Finalizar entrenamiento.
8. La app ajusta la próxima carga.

## Regla de carga

- Si logras 12+ reps con esfuerzo 7/10 o menor: sube peso la próxima vez.
- Si logras 10-12 reps con esfuerzo 8/10 o menor: mantiene peso.
- Si hay dolor, esfuerzo 9/10 o reps bajas: baja peso.

## Estructura de archivos

- `index.html`: estructura de la app.
- `styles.css`: diseño visual.
- `app.js`: lógica de entrenamiento, progresión y datos locales.
- `manifest.json`: configuración PWA.
- `service-worker.js`: cache/offline.
- `icons/`: íconos de la app.


Versión v8: cada ejercicio muestra una foto real de referencia dentro de la app.


Versión v9: las fotos reales están embebidas dentro de app.js. No depende de la carpeta exercise-images ni de rutas externas.
