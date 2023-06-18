import { Discord, Guild, Slash, SlashGroup, SlashOption } from 'discordx'
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier, NAME_REGEX, SNOWFLAKE_REGEX, UUID_REGEX } from '../utils/misc.js'
import { getNameForUuid, getUuidForName } from '../utils/mojang.js'
import { addScammer, forceRemoveScammer, getScammer, removeScammer, updateScammer } from '../database/Scammer.js'
import { notifyAllAdd, notifyAllForceRemove, notifyAllRemove } from '../database/GuildOptions.js'
import {
  INVALID_DISCORD_ID_EMBED,
  INVALID_UUID_OR_NAME_EMBED,
  SCAMMER_ACTION_RESPONSE_EMBED,
  SCAMMER_ALREADY_IN_LIST_EMBED,
  SCAMMER_NOT_IN_LIST_EMBED,
  UNKNOWN_ERROR_EMBED,
} from '../utils/embeds.js'

@Discord()
@Guild(configuration.centralServer.id)
@SlashGroup({
  name: 'scamlist',
  nameLocalizations: {
    'en-US': 'scam-list',
    'en-GB': 'scam-list',
    'fr': 'liste-des-arnaqueurs',
  },
  description: 'Commands related to the scam list',
  descriptionLocalizations: {
    'en-US': 'Commands related to the scam list',
    'en-GB': 'Commands related to the scam list',
    'fr': 'Commandes liées à la liste des arnaqueurs',
  },
  defaultMemberPermissions: 'Administrator',
})
export default class ScamListCommand {
  @SlashGroup('scamlist')
  @Slash({
    name: 'add',
    nameLocalizations: {
      'en-US': 'add',
      'en-GB': 'add',
      'fr': 'ajouter',
    },
    description: 'Add a scammer to the scam list',
    descriptionLocalizations: {
      'en-US': 'Add a scammer to the scam list',
      'en-GB': 'Add a scammer to the scam list',
      'fr': 'Ajouter un arnaqueur à la liste des arnaqueurs',
    },
  })
  async add(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'uuid-or-name',
      nameLocalizations: {
        'en-US': 'uuid-or-name',
        'en-GB': 'uuid-or-name',
        'fr': 'uuid-ou-pseudo',
      },
      description: 'The in-game name of the scammer or their UUID',
      descriptionLocalizations: {
        'en-US': 'The in-game name of the scammer or their UUID',
        'en-GB': 'The in-game name of the scammer or their UUID',
        'fr': 'Le pseudo de l\'arnaqueur ou son UUID',
      },
      required: true,
    }) uuidOrName: string,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'discord-id',
      nameLocalizations: {
        'en-US': 'discord-id',
        'en-GB': 'discord-id',
        'fr': 'id-discord',
      },
      description: 'The Discord ID of the scammer',
      descriptionLocalizations: {
        'en-US': 'The Discord ID of the scammer',
        'en-GB': 'The Discord ID of the scammer',
        'fr': 'L\'ID Discord de l\'arnaqueur',
      },
      required: true,
    }) discordId: string,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      nameLocalizations: {
        'en-US': 'reason',
        'en-GB': 'reason',
        'fr': 'raison',
      },
      description: 'The reason of the scam',
      descriptionLocalizations: {
        'en-US': 'The reason of their addition to the scam list',
        'en-GB': 'The reason of their addition to the scam list',
        'fr': 'La raison de son ajout à la liste des arnaqueurs',
      },
      required: false,
    }) reason: string | undefined,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'proof',
      nameLocalizations: {
        'en-US': 'proof',
        'en-GB': 'proof',
        'fr': 'preuves',
      },
      description: 'The proof of the scam',
      descriptionLocalizations: {
        'en-US': 'The proof of the scam',
        'en-GB': 'The proof of the scam',
        'fr': 'Les preuves de l\'arnaque',
      },
      required: false,
    }) proof: string | undefined,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()
    const isUuid = UUID_REGEX.test(uuidOrName)
    const isName = NAME_REGEX.test(uuidOrName)

    if (!isUuid && !isName)
      return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)

    const uuid = isUuid ? uuidOrName : await getUuidForName(uuidOrName)
    const name = isName ? uuidOrName : await getNameForUuid(uuidOrName)

    if (!uuid || !name)
      return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)

    if (!SNOWFLAKE_REGEX.test(discordId))
      return await replier.replyEmbed(INVALID_DISCORD_ID_EMBED)

    try {
      if (await getScammer(uuidOrName, true) && await getScammer(discordId, true))
        return await replier.replyEmbed(SCAMMER_ALREADY_IN_LIST_EMBED(name))
      const scammer = await addScammer(uuid, name, discordId, interaction.user.id, reason, proof)
      await notifyAllAdd(interaction.client, scammer)
      return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammer.initialName, configuration.messages.actions.scammerAdded))
    } catch (error) {
      console.error(error)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
  }

//fin de commande pour add normalement

  @SlashGroup('scamlist') 
  @Slash({
    name: 'add_ratter',
    nameLocalizations: {
      'en-US': 'add_ratter',
      'en-GB': 'add_ratter',
      'fr': 'ajouter_ratter',
    },
    description: 'Add a ratter to the scam list',
    descriptionLocalizations: {
      'en-US': 'Add a ratter to the scam list',
      'en-GB': 'Add a ratter to the scam list',
      'fr': 'Ajouter un ratter à la liste des arnaqueurs',
    },
  })
  async add_ratter(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'discord-id',
      nameLocalizations: {
        'en-US': 'discord-id',
        'en-GB': 'discord-id',
        'fr': 'id-discord',
      },
      description: 'The Discord ID of the scammer',
      descriptionLocalizations: {
        'en-US': 'The Discord ID of the scammer',
        'en-GB': 'The Discord ID of the scammer',
        'fr': 'L\'ID Discord de l\'arnaqueur',
      },
      required: true,
    }) discordId: string,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      nameLocalizations: {
        'en-US': 'reason',
        'en-GB': 'reason',
        'fr': 'raison',
      },
      description: 'The reason of the scam',
      descriptionLocalizations: {
        'en-US': 'The reason of their addition to the scam list',
        'en-GB': 'The reason of their addition to the scam list',
        'fr': 'La raison de son ajout à la liste des arnaqueurs',
      },
      required: false,
    }) reason: string | undefined,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'proof',
      nameLocalizations: {
        'en-US': 'proof',
        'en-GB': 'proof',
        'fr': 'preuves',
      },
      description: 'The proof of the scam',
      descriptionLocalizations: {
        'en-US': 'The proof of the scam',
        'en-GB': 'The proof of the scam',
        'fr': 'Les preuves de l\'arnaque',
      },
      required: false,
    }) proof: string | undefined,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()

    if (!SNOWFLAKE_REGEX.test(discordId))
      return await replier.replyEmbed(INVALID_DISCORD_ID_EMBED)

    try {
      if ( await getScammer(discordId, true))
        return await replier.replyEmbed(SCAMMER_ALREADY_IN_LIST_EMBED(discordId))
      const scammer = await addScammer("inconnue", "inconnue", discordId, interaction.user.id, reason, proof)
      await notifyAllAdd(interaction.client, scammer)
      return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammer.initialName, configuration.messages.actions.scammerAdded))
    } catch (error) {
      console.error(error)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
  }


//fin commande pour add un ratter
@SlashGroup('scamlist')
@Slash({
  name: 'add_without_discord',
  nameLocalizations: {
    'en-US': 'add_without_discord',
    'en-GB': 'add_without_discord',
    'fr': 'ajouter_sans_pseudo_discord',
  },
  description: 'Add a scammer to the scam list',
  descriptionLocalizations: {
    'en-US': 'Add a scammer to the scam list',
    'en-GB': 'Add a scammer to the scam list',
    'fr': 'Ajouter un arnaqueur à la liste des arnaqueurs',
  },
})
async add_without_discord(
  @SlashOption({
    type: ApplicationCommandOptionType.String,
    name: 'uuid-or-name',
    nameLocalizations: {
      'en-US': 'uuid-or-name',
      'en-GB': 'uuid-or-name',
      'fr': 'uuid-ou-pseudo',
    },
    description: 'The in-game name of the scammer or their UUID',
    descriptionLocalizations: {
      'en-US': 'The in-game name of the scammer or their UUID',
      'en-GB': 'The in-game name of the scammer or their UUID',
      'fr': 'Le pseudo de l\'arnaqueur ou son UUID',
    },
    required: true,
  }) uuidOrName: string,
  @SlashOption({
    type: ApplicationCommandOptionType.String,
    name: 'reason',
    nameLocalizations: {
      'en-US': 'reason',
      'en-GB': 'reason',
      'fr': 'raison',
    },
    description: 'The reason of the scam',
    descriptionLocalizations: {
      'en-US': 'The reason of their addition to the scam list',
      'en-GB': 'The reason of their addition to the scam list',
      'fr': 'La raison de son ajout à la liste des arnaqueurs',
    },
    required: false,
  }) reason: string | undefined,
  @SlashOption({
    type: ApplicationCommandOptionType.String,
    name: 'proof',
    nameLocalizations: {
      'en-US': 'proof',
      'en-GB': 'proof',
      'fr': 'preuves',
    },
    description: 'The proof of the scam',
    descriptionLocalizations: {
      'en-US': 'The proof of the scam',
      'en-GB': 'The proof of the scam',
      'fr': 'Les preuves de l\'arnaque',
    },
    required: false,
  }) proof: string | undefined,
  interaction: CommandInteraction,
) {
  const replier = new InteractionReplier(interaction, true)
  await replier.defer()
  const isUuid = UUID_REGEX.test(uuidOrName)
  const isName = NAME_REGEX.test(uuidOrName)

  if (!isUuid && !isName)
    return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)

  const uuid = isUuid ? uuidOrName : await getUuidForName(uuidOrName)
  const name = isName ? uuidOrName : await getNameForUuid(uuidOrName)

  if (!uuid || !name)
    return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)


  try {
    if (await getScammer(uuidOrName, true))
      return await replier.replyEmbed(SCAMMER_ALREADY_IN_LIST_EMBED(name))
    const scammer = await addScammer(uuid, name, "unkown", interaction.user.id, reason, proof)
    await notifyAllAdd(interaction.client, scammer)
    return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammer.initialName, configuration.messages.actions.scammerAdded))
  } catch (error) {
    console.error(error)
    return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
  }
}

//fin de la commande pour add qq sans pseudo discord


  @SlashGroup('scamlist')
  @Slash({
    name: 'remove',
    nameLocalizations: {
      'en-US': 'remove',
      'en-GB': 'remove',
      'fr': 'retirer',
    },
    description: 'Remove a scammer from the scam list',
    descriptionLocalizations: {
      'en-US': 'Remove a scammer from the scam list',
      'en-GB': 'Remove a scammer from the scam list',
      'fr': 'Retirer un arnaqueur de la liste des arnaqueurs',
    },
  })
  async remove(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'uuid-or-name-or-discord-id',
      nameLocalizations: {
        'en-US': 'uuid-or-name-or-discord-id',
        'en-GB': 'uuid-or-name-or-discord-id',
        'fr': 'uuid-ou-pseudo-ou-id-discord',
      },
      description: 'The in-game name of the scammer, their UUID or their Discord ID',
      descriptionLocalizations: {
        'en-US': 'The in-game name of the scammer, their UUID or their Discord ID',
        'en-GB': 'The in-game name of the scammer, their UUID or their Discord ID',
        'fr': 'Le pseudo de l\'arnaqueur, son UUID ou son ID Discord',
      },
      required: true,
    }) uuidOrNameOrDiscordId: string,
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'reason',
      nameLocalizations: {
        'en-US': 'reason',
        'en-GB': 'reason',
        'fr': 'raison',
      },
      description: 'The reason of the removal of the scammer from the scam list',
      descriptionLocalizations: {
        'en-US': 'The reason of the removal of the scammer from the scam list',
        'en-GB': 'The reason of the removal of the scammer from the scam list',
        'fr': 'La raison du retrait du scammer de la liste des arnaqueurs',
      },
      required: false,
    }) reason: string | undefined,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()
    const scammerToRemove = await getScammer(uuidOrNameOrDiscordId)

    if (!scammerToRemove)
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)
    try {
      await removeScammer(scammerToRemove.uuid, reason)
      await notifyAllRemove(interaction.client, scammerToRemove)
      return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammerToRemove.initialName, configuration.messages.actions.scammerRemoved))
    } catch (error) {
      console.error(error)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
  }

  @SlashGroup('scamlist')
  @Slash({
    name: 'edit',
    nameLocalizations: {
      'en-US': 'edit',
      'en-GB': 'edit',
      'fr': 'modifier',
    },
    description: 'Edit a scammer from the scam list',
    descriptionLocalizations: {
      'en-US': 'Edit a scammer from the scam list',
      'en-GB': 'Edit a scammer from the scam list',
      'fr': 'Modifier un arnaqueur de la liste des arnaqueurs',
    },
  })
  async edit(
    @SlashOption({
      name: 'uuid-or-name-or-discord-id',
      nameLocalizations: {
        'en-US': 'uuid-or-name-or-discord-id',
        'en-GB': 'uuid-or-name-or-discord-id',
        'fr': 'uuid-ou-pseudo-ou-id-discord',
      },
      description: 'The in-game name of the scammer, their UUID or their Discord ID',
      descriptionLocalizations: {
        'en-US': 'The in-game name of the scammer, their UUID or their Discord ID',
        'en-GB': 'The in-game name of the scammer, their UUID or their Discord ID',
        'fr': 'Le pseudo de l\'arnaqueur, son UUID ou son ID Discord',
      },
      required: true,
      minLength: 3,
      maxLength: 32,
      type: ApplicationCommandOptionType.String,
    }) uuidOrNameOrDiscordId: string,
    @SlashOption({
      name: 'add-reason',
      nameLocalizations: {
        'en-US': 'add-reason',
        'en-GB': 'add-reason',
        'fr': 'raison-ajout',
      },
      description: 'The reason of the addition of the scammer to the scam list',
      descriptionLocalizations: {
        'en-US': 'The reason of the addition of the scammer to the scam list',
        'en-GB': 'The reason of the addition of the scammer to the scam list',
        'fr': 'La raison de l\'ajout de l\'arnaqueur à la liste des arnaqueurs',
      },
      required: false,
      type: ApplicationCommandOptionType.String,
    }) addReason: string | undefined,
    @SlashOption({
      name: 'remove-reason',
      nameLocalizations: {
        'en-US': 'remove-reason',
        'en-GB': 'remove-reason',
        'fr': 'raison-retrait',
      },
      description: 'The reason of the remove of the scammer from the scam list',
      descriptionLocalizations: {
        'en-US': 'The reason of the remove of the scammer from the scam list',
        'en-GB': 'The reason of the remove of the scammer from the scam list',
        'fr': 'La raison du retrait de l\'arnaqueur de la liste des arnaqueurs',
      },
      required: false,
      type: ApplicationCommandOptionType.String,
    }) removeReason: string | undefined,
    @SlashOption({
      name: 'proof',
      nameLocalizations: {
        'en-US': 'proof',
        'en-GB': 'proof',
        'fr': 'preuve',
      },
      description: 'The proof of the scam',
      descriptionLocalizations: {
        'en-US': 'The proof of the scam',
        'en-GB': 'The proof of the scam',
        'fr': 'La preuve de l\'arnaque',
      },
      required: false,
      type: ApplicationCommandOptionType.String,
    }) proof: string | undefined,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()

    const scammerToEdit = await getScammer(uuidOrNameOrDiscordId, true)

    if (!scammerToEdit)
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)

    try {
      await updateScammer(scammerToEdit.uuid, addReason, removeReason, proof)
      return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammerToEdit.initialName, configuration.messages.actions.scammerEdited))
    } catch (error) {
      console.error(error)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
  }

  @SlashGroup('scamlist')
  @Slash({
    name: 'force-remove',
    nameLocalizations: {
      'en-US': 'force-remove',
      'en-GB': 'force-remove',
      'fr': 'retirer-de-force',
    },
    description: 'Remove entirely a scammer from the scam list bypassing off auto-bans.',
    descriptionLocalizations: {
      'en-US': 'Remove entirely a scammer from the scam list bypassing off auto-bans.',
      'en-GB': 'Remove entirely a scammer from the scam list bypassing off auto-bans.',
      'fr': 'Retirer entièrement un arnaqueur de la liste des arnaqueurs en contournant les auto-bans.',
    },
  })
  async forceRemove(
    @SlashOption({
      type: ApplicationCommandOptionType.String,
      name: 'uuid-or-name-or-discord-id',
      nameLocalizations: {
        'en-US': 'uuid-or-name-or-discord-id',
        'en-GB': 'uuid-or-name-or-discord-id',
        'fr': 'uuid-ou-pseudo-ou-id-discord',
      },
      description: 'The in-game name of the scammer, their UUID or their Discord ID',
      descriptionLocalizations: {
        'en-US': 'The in-game name of the scammer, their UUID or their Discord ID',
        'en-GB': 'The in-game name of the scammer, their UUID or their Discord ID',
        'fr': 'Le pseudo de l\'arnaqueur, son UUID ou son ID Discord',
      },
      required: true,
    }) uuidOrNameOrDiscordId: string,
    interaction: CommandInteraction,
  ) {
    const replier = new InteractionReplier(interaction, true)
    await replier.defer()
    const scammerToRemove = await getScammer(uuidOrNameOrDiscordId, true)

    if (!scammerToRemove)
      return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)
    try {
      await forceRemoveScammer(scammerToRemove.uuid)
      await notifyAllForceRemove(interaction.client, scammerToRemove)
      return await replier.replyEmbed(SCAMMER_ACTION_RESPONSE_EMBED(scammerToRemove.initialName, configuration.messages.actions.scammerForceRemoved))
    } catch (error) {
      console.error(error)
      return await replier.replyEmbed(UNKNOWN_ERROR_EMBED)
    }
  }
}
