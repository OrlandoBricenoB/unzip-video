import path from 'path'
import fs from 'fs'
import unzipper from 'unzipper'
const fsPromises = fs.promises

export const listFiles = async (directoryPath) => {
  // * Leer el directorio.
  const foundFiles = await fsPromises.readdir(directoryPath, (error) => {
    // * Manejando el error
    if (error) {
      return console.log('No puedo escanear esta carpeta: ' + error)
    }
  })

  // * Si hubo un error cancelar la ejecución.
  if (!foundFiles) return []

  // * Añadir al listado de archivos de formato .zip
  const filterByZip = foundFiles.filter(file => {
    const format = file.split('.')[1]
    if (format === 'zip') {
      return true
    }
    return false
  })

  return filterByZip
}

export const unzip = async ({
  currentPath,
  zip,
  deleteZip,
  increaseCountFiles
}) => {
  // * Leer zip.
  const readableZip = fs
    .createReadStream(path.join(currentPath, zip))
    .pipe(unzipper.Parse({ forceStream: true }))

  // * Recorrer cada archivo dentro del zip.
  for await (const entry of readableZip) {
    // * Ruta del archivo dentro del zip.
    const entryPath = entry.path

    // * Obtener el último elemento del arreglo con pop.
    const fileName = entryPath.split('/').pop()

    // * Obtener el formato del archivo.
    const format = fileName.split('.').pop()

    // * Guardar el archivo en la carpeta raíz si es un vídeo.
    if (format === 'mp4' || format === 'mkv') {
      // * Incrementar contador de archivos.
      increaseCountFiles()

      // * Guardar el archivo.
      entry.pipe(fs.createWriteStream(path.join(currentPath + '/', fileName)))

      // * Si el usuario pidió eliminar los zips, hacerlo:
      if (deleteZip) {
        fs.unlink(path.join(currentPath, zip), err => {
          if (err) {
            console.log('Hubo un error eliminando ' + zip)
          }
        })
      }
      return true
    // * Si no, ignorar este archivo (entry).
    } else {
      entry.autodrain()
    }
  }
  return false
}
