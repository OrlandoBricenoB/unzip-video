const fs = require('fs')
const { exec } = require('child_process')
const { uniqueNamesGenerator, adjectives, names } = require('unique-names-generator')
const path = require('path')

const generateRandomNumber = () => Math.trunc(Math.random()*1000)
const generateRandomName = () => uniqueNamesGenerator({
  dictionaries: [adjectives, names],
  length: 2
})

const pushToMain = () => {
  exec('git add .')
  exec(`git commit -m "feat: Added atom of Issue #${generateRandomNumber()}"`)
  exec('git push origin main')
}

const modifyFile = (path) => {
  if (!fs.existsSync(path)) return
  const fileContent = fs.readFileSync(path, 'utf8')
  fs.writeFileSync(path, fileContent + `\n@${generateRandomName()}`)
}

setInterval(() => {
  console.log('--- Modify file.')
  modifyFile(path.join(__dirname, './text.txt'))
  console.log('--- Do push to main branch')
  pushToMain()
}, 43200 * 1000) // * Cada medio día.
