import { Discord, Slash } from 'discordx'
import { CommandInteraction } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier } from '../utils/misc.js'

@Discord()
export class liste_serveur_Command {
  @Slash({
    name: 'number_server',
    nameLocalizations: {
      'en-US': 'number_server',
      'en-GB': 'number_server',
      'fr': 'number_server',
    },
    description: 'le nombre de serveur sur lequel le bot est présent',
    descriptionLocalizations: {
      'en-US': 'the number of server the bot is on',
      'en-GB': 'the number of server the bot is on',
      'fr': 'le nombre de serveur sur lequel le bot est présent',
    },
  })
  async toggle(interaction: CommandInteraction) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()
    try{
        const guildCount = interaction.client.guilds.cache.size;
        return await replier.replyEmbed({
          title: configuration.messages.listeserver.nombre_serveur,
          description: `${guildCount} serveurs`
      });
    }
catch(error){
    console.log(error)
    console.log("erreur lors de le recupération de la liste des serveurs et du calcul de leur nombre")
}
  }
}


