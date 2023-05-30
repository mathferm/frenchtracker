import { Discord, ModalComponent } from 'discordx'
import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier, NAME_REGEX, SUCCESS_EMBED, UUID_REGEX } from '../utils/misc.js'
import { getChannelForId, getGuildForId } from '../utils/discord.js'
import { CANNOT_FIND_CENTRAL_SERVER_EMBED, INVALID_UUID_OR_NAME_EMBED } from '../utils/embeds.js'
import { getNameForUuid, getUuidForName } from '../utils/mojang.js'

@Discord()
export class ReportModal {
  static readonly REPORT_MODAL = new ModalBuilder()
    .setCustomId('report')
    .setTitle(configuration.messages.report.modal.title)
    .setComponents([
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: 'report-uuid-or-username',
            style: TextInputStyle.Short,
            required: true,
            maxLength: 32,
            minLength: 3,
            ...configuration.messages.report.modal.uuidOrName,
          }),
        ],
      }),
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: 'report-discord-id',
            style: TextInputStyle.Short,
            required: true,
            ...configuration.messages.report.modal.discordId,
          }),
        ],
      }),
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: 'report-proof',
            style: TextInputStyle.Paragraph,
            required: true,
            ...configuration.messages.report.modal.proof,
          }),
        ],
      }),
    ])

  @ModalComponent({
    id: 'report',
  })
  async onReportSubmit(interaction: ModalSubmitInteraction) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()
    const centralServer = await getGuildForId(interaction.client, configuration.centralServer.id)

    if (!centralServer)
      return await replier.replyEmbed(CANNOT_FIND_CENTRAL_SERVER_EMBED)
    const reportsLogChannel = await getChannelForId(interaction.client, configuration.centralServer.reportsLogChannelId)

    if (!reportsLogChannel?.isTextBased()) {
      console.error('Cannot find reports log channel or the channel is not a text channel')
      return await replier.replyEmbed(CANNOT_FIND_CENTRAL_SERVER_EMBED)
    }

    const identifier = interaction.fields.getTextInputValue('report-uuid-or-username')
    const discordId = interaction.fields.getTextInputValue('report-discord-id')
    const proof = interaction.fields.getTextInputValue('report-proof')

    const name = UUID_REGEX.test(identifier) ? await getNameForUuid(identifier) : identifier
    const uuid = NAME_REGEX.test(identifier) ? await getUuidForName(identifier) : identifier

    if (!uuid || !name)
      return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)

    reportsLogChannel.send({
      embeds: [{
        title: configuration.messages.report.logEmbed.title
          .replaceAll('%scammerUuid%', uuid)
          .replaceAll('%scammerName%', name)
          .replaceAll('%scammerId%', discordId)
          .replaceAll('%reporterId%', interaction.user.id),
        description: configuration.messages.report.logEmbed.description
          .replaceAll('%scammerUuid%', uuid)
          .replaceAll('%scammerName%', name)
          .replaceAll('%scammerId%', discordId)
          .replaceAll('%reporterId%', interaction.user.id),
      }],
      files: [{
        name: 'preuves.txt',
        attachment: Buffer.from(proof),
      }],
    })
    await replier.replyEmbed({
      description: configuration.messages.reportSent,
      ...SUCCESS_EMBED,
    })
  }
}