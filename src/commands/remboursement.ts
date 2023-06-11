import { Discord, Slash, SlashOption } from 'discordx'
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
//import { ReportModal } from '../modals/ReportModal.js'
import { InteractionReplier } from '../utils/misc.js'
import { getScammer, scammerrembourse } from '../database/Scammer.js'
import { SCAMMER_NOT_IN_LIST_EMBED, SCAMMER_REMBOURSED } from '../utils/embeds.js'

@Discord()
export class RemboursementCommand {
  @Slash({
    name: 'remboursement',
    nameLocalizations: {
      'en-US': 'remboursement',
      'en-GB': 'remboursement',
      'fr': 'remboursement',
    },
    description: 'Indique q\'un scammer a remboursé',
    descriptionLocalizations: {
      'en-US': 'Indique q\'un scammer a remboursé',
      'en-GB': 'Indique q\'un scammer a remboursé',
      'fr': 'Indique q\'un scammer a remboursé',
    },
  })
  async remboursement(
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
  })name:string,
    interaction:CommandInteraction,
  ){
    const replier=new InteractionReplier(interaction,true)
    await replier.defer()
    console.log(getScammer(name,false))
    if (!(await getScammer(name,false))){
        return await replier.replyEmbed(SCAMMER_NOT_IN_LIST_EMBED)
    }
    else{
        scammerrembourse(name)
        return await replier.replyEmbed(SCAMMER_REMBOURSED)
    }
  }
 /* async report(interaction: CommandInteraction) {
    await interaction.showModal(ReportModal.REPORT_MODAL)
  }*/
}
