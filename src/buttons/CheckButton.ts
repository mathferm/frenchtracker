import { ButtonComponent, Discord } from 'discordx'
import { ButtonBuilder, ButtonStyle, MessageComponentInteraction } from 'discord.js'
import configuration from '../../configuration.js'
import { CheckModal } from '../modals/CheckModal.js'

@Discord()
export class CheckButton {
  static readonly CHECK_BUTTON = new ButtonBuilder()
    .setLabel(configuration.messages.check.buttonLabel)
    .setCustomId('check')
    .setEmoji('🔍')
    .setStyle(ButtonStyle.Primary)

  @ButtonComponent({id: 'check'})
  async check(interaction: MessageComponentInteraction) {
    await interaction.showModal(CheckModal.CHECK_MODAL)
  }
}