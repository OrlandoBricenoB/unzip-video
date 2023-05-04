import path from 'path'
import fs from 'fs'
import unzipper from 'unzipper'
import AdmZip from 'adm-zip'
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
  // * Ruta del zip
  const zipPath = path.join(currentPath, zip)

  const zipFile = new AdmZip(zipPath, 'hackstore.ac')

  console.log({ zipFile }, zipFile.getEntries().map(d => d.entryName))

  // * Leer zip.
  const readableZip = fs
    .createReadStream(zipPath)
    .pipe(unzipper.Parse({ forceStream: true }))

  // * Recorrer cada archivo dentro del zip.
  for await (const entry of readableZip) {
    // * Ruta del archivo dentro del zip.
    const entryPath = entry.path

    // * Obtener el último elemento del arreglo con pop.
    const fileName = entryPath.split('/').pop()

    // * Obtener el formato del archivo.
    const format = fileName.split('.').pop()

    // * Si es un vídeo, guardar el archivo en la carpeta raíz.
    if (format === 'mp4' || format === 'mkv') {
      // * Almacenar la ruta del archivo.
      const filePath = path.join(currentPath, fileName)

      // * Incrementar contador de archivos.
      increaseCountFiles()

      // * Guardar el archivo.
      entry.pipe(fs.createWriteStream(filePath))

      // * Opción de usuario: Eliminar los archivos comprimidos.
      if (deleteZip) {
        fs.unlink(zipPath, err => {
          if (err) {
            console.log('Hubo un error eliminando ' + zip)
          }
        })
      }
    // * Si no, ignorar este archivo (entry).
    } else {
      entry.autodrain()
    }
  }
}
