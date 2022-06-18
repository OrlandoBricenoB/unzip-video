import boxen from 'boxen'
import chalk from 'chalk'

export const boxenMessage = message => {
  const options = {
    padding: .5,
    borderColor: '#21c2e1',
    dimBorder: true,
    title: 'Éxito'
  }

  message = `
  ${message}
  - Jo-Sword
  `

  return `\n${boxen(chalk.hex('#21c2e1').dim(message), options)}\n`
}
