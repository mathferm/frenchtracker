import { dirname, importx } from '@discordx/importer'
import type { Interaction } from 'discord.js'
import { IntentsBitField } from 'discord.js'
import { Client } from 'discordx'
import configuration from '../configuration.js'
import { DATA_SOURCE } from './database/index.js'
import { createGuildOptions } from './database/GuildOptions.js'

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildBans,
  ],
  silent: false,
})

bot.once('ready', async () => {
  // Make sure all guilds are cached and optioned
  (await bot.guilds.fetch()).forEach(({id}) => createGuildOptions(id).catch(() => null))
  // Synchronize applications commands with Discord
  await bot.clearApplicationCommands()
  await bot.initApplicationCommands()

  console.log('Bot started')
})

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction)
})

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands,buttons}/**/*.{ts,js}`)

  await DATA_SOURCE.initialize()
  await bot.login(configuration.token)
}

run()
