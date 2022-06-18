#! /usr/bin/env node
import yesno from 'yesno'

// * Utilidades
import { boxenMessage } from './helpers/utils.mjs'
import { listFiles, unzip } from './helpers/handleFiles.mjs'

// * Consultar si desea hacerlo en la ubicación actual.
(async () => {
  // * Obtener la carpeta desde donde se ejecutó el CLI.
  const currentPath = process.cwd()

  // * Mostrar al usuario su ubicación.
  console.log(`Ubicación actual: ${currentPath}\n`)

  // * Consultar al usuario si desea hacerlo en este directorio.
  const unzipInCurrent = await yesno({
    question: '¿Seguro que quieres descomprimir y obtener los vídeos?',
    yesValues: [
      's', 'si'
    ],
    invalid: () => {
      process.stdout.write('\nEsta respuesta es inválida, acepto:\nAceptar: s |si\nCancelar: n | no\n')
      process.exit(1)
    },
    defaultValue: true
  })

  // * Si aceptó, comenzar la descompresión en la ubicación actual.
  if (unzipInCurrent) {
    startUnzip(currentPath)
  }
})()

// * Iniciar el proceso.
const startUnzip = async (currentPath) => {
  // * Guardar fecha de inicio.
  const startAt = Date.now()

  // * Obtener los archivos .zip de este directorio.
  const zips = await listFiles(currentPath)

  // * Contar los archivos obtenidos.
  let countFiles = 0

  // * Consultar al usuario si desea eliminar los archivos comprimidos.
  const deleteZip = await yesno({
    question: '¿Desea eliminar los archivos comprimidos automáticamente?',
    yesValues: [
      's', 'si'
    ],
    invalid: () => {
      process.stdout.write('\nEsta respuesta es inválida, acepto:\nAceptar: s |si\nCancelar: n | no\n')
      process.exit(1)
    }
  })

  // * Recorrer cada zip.
  for (const zip of zips) {
    // * Descomprimir zip, await para esperar que se descompriman todos.
    await unzip({
      currentPath,
      zip,
      deleteZip,
      increaseCountFiles: () => (countFiles += 1)
    })
  }

  // * Mostrar cuántos vídeos se obtuvieron y el tiempo que tardaron.
  const endAt = Date.now()
  const timeAt = (endAt - startAt) / 1000

  // * Salto de línea al inicio para separar de las preguntas.
  console.log(`\n${countFiles} archivos en ${timeAt.toFixed(2)} segundos.`)

  // * Caja de mensaje de éxito.
  console.log(boxenMessage('Descompresión completada'))
}
