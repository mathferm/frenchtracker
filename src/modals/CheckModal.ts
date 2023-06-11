import { Discord, ModalComponent } from 'discordx'
import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier } from '../utils/misc.js'
import { getScammer } from '../database/Scammer.js'
import { getNameForUuid, getUuidForName } from '../utils/mojang.js'
import { CANNOT_FIND_GUILD_EMBED } from '../utils/embeds.js'
import { dateToDiscordTimeStamp } from '../utils/discord.js'
import { getskyblocklvl,getguild,online,discordfromignmc } from '../utils/stats.js'
//import { idtonamediscord } from '../utils/stats.js'
//import { namefromiddiscord } from '../main.js'

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

    if (!scammer){
      const uuid=await getUuidForName(identifier)+""
      return await replier.replyEmbed({
        title:configuration.messages.scammer_not_found.titre_embed,
        url:"https://sky.shiiyu/moe/stats/"+identifier,
        thumbnail:{url:'https://crafatar.com/renders/body/'+uuid+".png"},
        description:configuration.messages.scammer_not_found.message_description,
        fields:[{
          name:configuration.messages.scammer_found.soustitre_level,
          value:await getskyblocklvl(identifier),
        },
        {
          name:configuration.messages.scammer_found.soustitre_guild,
          value:await getguild(identifier),
        },
        {
          name:configuration.messages.scammer_found.soustutre_discord,
          value:  await discordfromignmc(identifier)+" "
        },
        {
          name:"\n",
          value:await online(uuid)+"connecté sur hypixel"
        }
        ],
      })}

    const name=(await getNameForUuid(scammer.uuid)) ?? configuration.messages.error.cannotFindCurrentName
    return await replier.replyEmbed({
      //title: (await getNameForUuid(scammer.uuid)) ?? configuration.messages.error.cannotFindCurrentName,
      title: configuration.messages.scammer_found.titre_emebd,
      url:"https://sky.shiiyu/moe/stats/"+name,
      //title: `[$(Information du joueur : (https://sky.shiiyu.moe/stats/${name})`,
      thumbnail:{url:'https://crafatar.com/renders/body/'+scammer.uuid+".png"},
      description:configuration.messages.scammer_found.message_description+"\n\n"+

      configuration.messages.scammer_found.soustitre_scam_list+"\n"+
      //}],
      //description: (
          "**"+name+"**\n\n"+
          (!scammer.removedAt ?
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
    fields:[{
      name:configuration.messages.scammer_found.soustitre_level,
      value:await getskyblocklvl(name),
    },
    {
      name:configuration.messages.scammer_found.soustitre_guild,
      value:await getguild(name),
    },
    /*{
      name:configuration.messages.scammer_found.soustutre_discord,
      value:await namefromiddiscord(scammer.discordId)
    },*/
    {
      name:"\n",
      value:await online(scammer.uuid)+"connecté sur hypixel"
    }
    ],
  }, {
      files: scammer.proof ? [
        {
          name: 'preuves.txt',
          attachment: Buffer.from(scammer.proof, 'utf-8'),
        }] : [],
    })
  }
}
