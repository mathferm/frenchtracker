import { Discord, Slash, SlashGroup } from 'discordx'
import { ActionRowBuilder, ButtonBuilder, CommandInteraction, EmbedBuilder } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier } from '../utils/misc.js'
import { CheckButton } from '../buttons/CheckButton.js'
import { ReportButton } from '../buttons/ReportButton.js'
import { CANNOT_FIND_GUILD_EMBED, UNKNOWN_ERROR_EMBED } from '../utils/embeds.js'

@Discord()
@SlashGroup({
  name: 'check',
  nameLocalizations: {
    'en-US': 'check',
    'en-GB': 'check',
    'fr': 'vérifier',
  },
  description: 'Check related commands',
  descriptionLocalizations: {
    'en-US': 'User check related commands',
    'en-GB': 'User check related commands',
    'fr': 'Commandes liées à la vérification des utilisateurs',
  },
})
export class CheckCommand {
  static readonly CHECK_EMBED = new EmbedBuilder()
    .setColor(configuration.colors.info)
    .setDescription(configuration.messages.check.embedDescription)

  @SlashGroup('check')
  @Slash({
    name: 'show-embed',
    nameLocalizations: {
      'en-US': 'show-embed',
      'en-GB': 'show-embed',
      'fr': 'afficher-embed',
    },
    description: 'Show the check embed',
    descriptionLocalizations: {
      'en-US': 'Show the check embed',
      'en-GB': 'Show the check embed',
      'fr': 'Affiche l\'embed de vérification',
    },
    defaultMemberPermissions: 'ManageChannels',
  })
  async showEmbed(interaction: CommandInteraction) {
    const replier = new InteractionReplier(interaction)
    await replier.defer()

    if (!interaction.guild)
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)

    if (!interaction.channel)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)

    return await replier.replyEmbed(CheckCommand.CHECK_EMBED.toJSON(), {
      components: [new ActionRowBuilder<ButtonBuilder>({components: [CheckButton.CHECK_BUTTON,ReportButton.ReportButton]})],
    })
  }
}
