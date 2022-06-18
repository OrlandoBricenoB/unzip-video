# Unzip Video

## Descripción

Este proyecto fue desarrollador con la inteción de descomprimir automáticamente varios archivos zip en la misma carpeta y sacar únicamente los archivos de vídeo dentro de ella.

Por ahora es algo muy sencillo, trabaja 
solo con los formatos: zip, mp4 y mkv.

## ¿Cómo se usa?

Debes clonar el proyecto e instalar las dependencias:

```bash
yarn
```

Luego, instalar globalmente el CLI:
```bash
npm link
```
Cabe destacar que no es necesario ejecutar npm link cada vez que se cambie el código del CLI.

Y ahora, prueba el CLI en cualquier directorio ejecutando:
```bash
unz
```

## Características futuras

En el caso de las series, hay muchos casos donde el archivo tiene un nombre parecido a este:

``
Rikei ga Koi ni Ochita no de Shoumei shitemita. Heart - 04 [PS]
``

Sería ideal agregar yargs al proyecto y con un argumento, eliminar texto innecesario en el nombre del archivo como lo sería [PS] en este caso.

También organizar los nombres de archivo por número de capítulos de una serie.

> Si tiene 100 capítulos, empezar por 001, sino, 01.

