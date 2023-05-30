import { Discord, ModalComponent } from 'discordx'
import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier } from '../utils/misc.js'
import { getScammer } from '../database/Scammer.js'
import { getNameForUuid } from '../utils/mojang.js'
import { CANNOT_FIND_GUILD_EMBED, SCAMMER_NOT_IN_LIST_EMBED } from '../utils/embeds.js'
import { dateToDiscordTimeStamp } from '../utils/discord.js'

@Discord()
export class CheckModal {

  static readonly CHECK_MODAL = new ModalBuilder()
    .setCustomId('check-modal')
    .setTitle(configuration.messages.report.modal.title)
    .setComponents([
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: 'check-uuid-or-username-or-discord-id',
            style: TextInputStyle.Short,
            required: true,
            maxLength: 32,
            minLength: 3,
            ...configuration.messages.check.modal.uuidOrNameOrDiscordId,
          }),
        ],
      }),
    ])

  @ModalComponent({
    id: 'check-modal',
  })
  async onReportSubmit(interaction: ModalSubmitInteraction) {
    const replier = new InteractionReplier(interaction, true)
    const identifier = interaction.fields.getTextInputValue('check-uuid-or-username-or-discord-id')
    await replier.defer()

    const scammer = await getScammer(identifier, true)

    if (!interaction.guild)
      return await replier.replyEmbed(CANNOT_FIND_GUILD_EMBED)

    if (!scammer)
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)

    return await replier.replyEmbed({
      title: (await getNameForUuid(scammer.uuid)) ?? configuration.messages.error.cannotFindCurrentName,
      description: (
          !scammer.removedAt ?
            `Ajouté le ${dateToDiscordTimeStamp(scammer.addedAt)}\n` +
            `par <@${scammer.adderDiscordId}> (${scammer.adderDiscordId})\n` +
            `pour: ${scammer.addReason}`
            :
            `Retiré le ${dateToDiscordTimeStamp(scammer.removedAt)}\n` +
            `pour: ${scammer.removeReason}\n` +
            `Raison de l'ajout: ${scammer.addReason}`
        ) + '\n\n' +
        `Pseudo initial: ${scammer.initialName}\n` +
        `UUID: ${scammer.uuid}\n` +
        `Discord: <@${scammer.discordId}> (${scammer.discordId})`,
    }, {
      files: scammer.proof ? [
        {
          name: 'preuves.txt',
          attachment: Buffer.from(scammer.proof, 'utf-8'),
        }] : [],
    })
  }
}