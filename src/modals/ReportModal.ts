import { Discord, ModalComponent, SelectMenuComponent } from 'discordx'
import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, SelectMenuBuilder, SelectMenuInteraction, TextInputBuilder, TextInputStyle } from 'discord.js'
import configuration from '../../configuration.js'
import { InteractionReplier, NAME_REGEX, SUCCESS_EMBED, UUID_REGEX } from '../utils/misc.js'
import { getChannelForId, getGuildForId } from '../utils/discord.js'
import { CANNOT_FIND_CENTRAL_SERVER_EMBED, INVALID_UUID_OR_NAME_EMBED, INVALID_PROOF } from '../utils/embeds.js'
import { getNameForUuid, getUuidForName } from '../utils/mojang.js'
import { GetText } from '../menu_deroulant/getcustomtext.js'
import { addScammer } from '../database/Scammer.js'
//import { text } from 'stream/consumers'
//import { MenuScammer } from "../MenuBuilder/Check_Scammer_mere.js"

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
      new ActionRowBuilder<TextInputBuilder>({
        components:[
          new TextInputBuilder({
            customId:'report-links',
            style: TextInputStyle.Paragraph,
            required: true,
            ...configuration.messages.report.modal.prooflink
          })
        ]
      })
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
    const prooflink = interaction.fields.getTextInputValue('report-links')

    if (!prooflink.includes("https://")){
      return await replier.replyEmbed(INVALID_PROOF)
    }

    const name = UUID_REGEX.test(identifier) ? await getNameForUuid(identifier) : identifier
    const uuid = NAME_REGEX.test(identifier) ? await getUuidForName(identifier) : identifier

    if (!uuid || !name)
      return await replier.replyEmbed(INVALID_UUID_OR_NAME_EMBED)
    if (!prooflink.includes("https://")){
      return await replier.replyEmbed(INVALID_PROOF)
    }
    console.log(interaction.user.id)
    console.log("id")
    //const Menu_Scammer=new MenuScammer(await interaction.client.users.fetch(interaction.user.id),name)
    //const actionrow= new ActionRowBuilder<SelectMenuBuilder>(
      //{components:[ Menu_Scammer.Menu_Scammer]}
      //)
    const menusavoir= new SelectMenuBuilder()
      .setCustomId('jesaispas')
      .setPlaceholder('Selectionner une action')
      .addOptions([
        {
            label:configuration.messages.Ban_Menu.option1,
            value: configuration.messages.Ban_Menu.option1,
        },
        {
            label:configuration.messages.Ban_Menu.option2,
            value: configuration.messages.Ban_Menu.option2,
        },
        {
            label:configuration.messages.Ban_Menu.option3,
            value: configuration.messages.Ban_Menu.option3,
        },
        {
            label: configuration.messages.Ban_Menu.option4,
            value: configuration.messages.Ban_Menu.option4,
        }
        ])
    const actionrow= new ActionRowBuilder<SelectMenuBuilder>(
          {components:[menusavoir ]}
          )
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
        footer:({text:JSON.stringify({uuid:uuid,name:name,discordId:discordId,reporterid:interaction.user.id,reason:Buffer.from(proof),proof:Buffer.from(prooflink)})})
      }],
      components:[
        actionrow
      ],
      files: [{
        name: 'preuves.txt',
        attachment: Buffer.concat([Buffer.from(proof),Buffer.from("\n"),Buffer.from(prooflink)]),
      }],
    })
    await replier.replyEmbed({
      description: configuration.messages.reportSent,
      ...SUCCESS_EMBED,
    })}

  @SelectMenuComponent({id:'jesaispas'})
    async c(interaction :SelectMenuInteraction){
      const replier = new InteractionReplier(interaction, true)
      //await replier.defer()
      const selectedOption=interaction.values[0];
      const object=JSON.parse((interaction.message.embeds[0]?.footer?.text+" ").replace(" ",""))
      const player=await interaction.client.users.fetch(object.reporterid)
      if (selectedOption===configuration.messages.Ban_Menu.option1){
        await replier.defer()
        await player.send({
            embeds:[{
                title:configuration.messages.reponse_signalement.titre.replace("%scammer%",object.name),
                description:configuration.messages.reponse_signalement.accepte.replace("%scammer%",object.name)}]
        })
        await replier.replyEmbed({
          description:configuration.messages.ReturnReport.Ban.replace("%joueur%",player.username)
        })
    }
    else if (selectedOption===configuration.messages.Ban_Menu.option2){
        await replier.defer()
        await player.send({
            embeds:[{
                title:configuration.messages.reponse_signalement.titre.replace("%scammer%",object.name),
                description:configuration.messages.reponse_signalement.refus_manque_preuve}]
        })
        await addScammer(object.uuid,object.name,object.discordID,object.reporterid,object.reason,object.proof)
        await replier.replyEmbed({
          description:configuration.messages.ReturnReport.Informationmissing.replace("%joueur%",player.username)
        })
    }
    else if (selectedOption===configuration.messages.Ban_Menu.option3){
        await replier.defer()
        await player.send({
            embeds:[{
                title:configuration.messages.reponse_signalement.titre.replace("%scammer%",object.name),
                description:configuration.messages.reponse_signalement.refus_joueur_innexistant}]
        })
        await replier.replyEmbed({
          description:configuration.messages.ReturnReport.Joueurinnexistant.replace("%joueur%",player.username)
        })
    }
    else if (selectedOption===configuration.messages.Ban_Menu.option4){
      const getTextInstance=new GetText()
      await interaction.showModal(GetText.ReportText)
      const valeurTexte=await getTextInstance.waitForSubmit();
      await player.send({
        embeds:[{
          title:configuration.messages.reponse_signalement.titre.replace("%scammer%",object.name),
          description:valeurTexte
        }]
      })
  }}}
