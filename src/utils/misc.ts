import {
  APIEmbed,
  CommandInteraction,
  InteractionReplyOptions,
  MessageComponentInteraction,
  ModalSubmitInteraction,
} from 'discord.js'
import configuration from '../../configuration.js'

export const SNOWFLAKE_REGEX = /^\d{18,}$/
export const UUID_REGEX = /^[0-9a-f]{32}$/
export const NAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/

export const SUCCESS_EMBED = {
  color: configuration.colors.success,
} as const

type RepliableInteraction =
  | CommandInteraction
  | MessageComponentInteraction
  | ModalSubmitInteraction

export class InteractionReplier {
  private nextIsEphemeral: boolean

  constructor(
    private interaction: RepliableInteraction,
    private ephemeral: boolean = false,
  ) {
    this.nextIsEphemeral = this.ephemeral
  }

  async defer() {
    await this.interaction.deferReply({ephemeral: this.ephemeral})
  }

  async replyMessage(message: string, options?: Omit<InteractionReplyOptions, 'content' | 'ephemeral'>) {
    const ephemeral = this.nextIsEphemeral || this.ephemeral
    if (this.interaction.deferred)
      await this.interaction.editReply({content: message, ...options})
    else
      await this.interaction.reply({content: message, ephemeral: ephemeral, ...options})
    this.nextIsEphemeral = this.ephemeral
  }

  async replyEmbed(embed: APIEmbed, options?: Omit<InteractionReplyOptions, 'embeds' | 'ephemeral'>) {
    const ephemeral = this.nextIsEphemeral || this.ephemeral
    if (this.interaction.deferred)
      await this.interaction.editReply({embeds: [embed], ...options})
    else
      await this.interaction.reply({embeds: [embed], ephemeral: ephemeral, ...options})
    this.nextIsEphemeral = this.ephemeral
  }

  async replyEmbeds(embeds: APIEmbed[], options?: Omit<InteractionReplyOptions, 'embeds' | 'ephemeral'>) {
    const ephemeral = this.nextIsEphemeral || this.ephemeral
    if (this.interaction.deferred)
      await this.interaction.editReply({embeds, ...options})
    else
      await this.interaction.reply({embeds, ephemeral: ephemeral, ...options})
    this.nextIsEphemeral = this.ephemeral
  }
}