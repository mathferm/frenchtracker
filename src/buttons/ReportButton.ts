import { ButtonComponent, Discord } from 'discordx'
import { ButtonBuilder, ButtonStyle, MessageComponentInteraction } from 'discord.js'
import configuration from '../../configuration.js'
import { ReportModal } from '../modals/ReportModal.js'

@Discord()
export class ReportButton {
  static readonly ReportButton = new ButtonBuilder()
    .setLabel(configuration.messages.report.buttonLabel)
    .setCustomId('report')
    .setEmoji('⚠️')
    .setStyle(ButtonStyle.Danger)

  @ButtonComponent({id: 'report'})
  async check(interaction: MessageComponentInteraction) {
    await interaction.showModal(ReportModal.REPORT_MODAL)
  }
}
