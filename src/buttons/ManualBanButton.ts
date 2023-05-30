import { ButtonComponent, Discord } from 'discordx'
import { ButtonBuilder, ButtonStyle, MessageComponentInteraction, PermissionsBitField } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier, SUCCESS_EMBED } from '../utils/misc.js'
import { getScammer } from '../database/Scammer.js'
import {
  CANNOT_FIND_GUILD_EMBED,
  ERROR_EMBED,
  SCAMMER_NOT_IN_LIST_EMBED,
  UNKNOWN_ERROR_EMBED,
} from '../utils/embeds.js'
import { banScammerFromGuild, getMemberForId, unBanScammerFromGuild } from '../utils/discord.js'

@Discord()
export class ManualBanButton {
  static readonly MANUAL_BAN_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel(configuration.messages.manualBan.ban.buttonLabel)
    .setCustomId('manual-ban')

  static readonly MANUAL_UNBAN_BUTTON = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setLabel(configuration.messages.manualBan.unban.buttonLabel)
    .setCustomId('manual-unban')

  @ButtonComponent({id: 'manual-ban'})
  async manualBanButton(interaction: MessageComponentInteraction) {
    const replier = new InteractionReplier(interaction, true)
    const userToBanId = interaction.message.embeds[0]?.footer?.text
    await replier.defer()

    if (!interaction.guild)
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)

    const author = await getMemberForId(interaction.guild, interaction.user.id)

    if (!userToBanId) {
      console.error('Cannot get the user to ban\'s id from the embed.')
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
    const scammerToBan = await getScammer(userToBanId)

    if (!scammerToBan) {
      await interaction.message.edit({components: [], embeds: interaction.message.embeds})
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)
    }

    if (!author.permissions.has(PermissionsBitField.Flags.BanMembers))
      return await replier.replyEmbed({
        description: configuration.messages.error.tooFewPermissions,
        ...ERROR_EMBED,
      })

    await interaction.message.edit({components: [], embeds: interaction.message.embeds})
    return await replier.replyEmbed(await banScammerFromGuild(interaction.guild, scammerToBan) ? {
      description: configuration.messages.manualBan.ban.success.replace('%scammer%', scammerToBan.initialName),
      ...SUCCESS_EMBED,
    } : {
      description: configuration.messages.manualBan.ban.error.replace('%scammer%', scammerToBan.initialName),
      ...ERROR_EMBED,
    })
  }

  @ButtonComponent({id: 'manual-unban'})
  async manualUnBanButton(interaction: MessageComponentInteraction) {
    const replier = new InteractionReplier(interaction, true)
    const userToUnBanId = interaction.message.embeds[0]?.footer?.text
    await replier.defer()

    if (!interaction.guild)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)

    const author = await getMemberForId(interaction.guild, interaction.user.id)

    if (!userToUnBanId) {
      console.error('Cannot get the user to unban\'s id from the embed.')
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
    const scammerToUnBan = await getScammer(userToUnBanId, true)

    if (!scammerToUnBan) {
      await interaction.message.edit({components: [], embeds: interaction.message.embeds})
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)
    }

    if (!author.permissions.has(PermissionsBitField.Flags.BanMembers))
      return await replier.replyEmbed({
        description: configuration.messages.error.tooFewPermissions,
        ...ERROR_EMBED,
      })

    await interaction.message.edit({components: [], embeds: interaction.message.embeds})
    return await replier.replyEmbed(await unBanScammerFromGuild(interaction.guild, scammerToUnBan) ? {
      description: configuration.messages.manualBan.unban.success.replace('%scammer%', scammerToUnBan.initialName),
      ...SUCCESS_EMBED,
    } : {
      description: configuration.messages.manualBan.unban.error.replace('%scammer%', scammerToUnBan.initialName),
      ...ERROR_EMBED,
    })
  }
}