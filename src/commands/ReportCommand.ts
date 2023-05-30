import { Discord, Slash } from 'discordx'
import { CommandInteraction } from 'discord.js'
import { ReportModal } from '../modals/ReportModal.js'

@Discord()
export class ReportCommand {
  @Slash({
    name: 'report',
    nameLocalizations: {
      'en-US': 'report',
      'en-GB': 'report',
      'fr': 'signaler',
    },
    description: 'Report a scammer',
    descriptionLocalizations: {
      'en-US': 'Report a scammer',
      'en-GB': 'Report a scammer',
      'fr': 'Signaler un arnaqueur',
    },
  })
  async report(interaction: CommandInteraction) {
    await interaction.showModal(ReportModal.REPORT_MODAL)
  }
}