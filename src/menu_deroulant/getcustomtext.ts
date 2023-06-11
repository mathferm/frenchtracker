import { ActionRowBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { Discord, ModalComponent } from "discordx"
import configuration from '../../configuration.js'
import { InteractionReplier } from "../utils/misc.js"


@Discord()
export class GetText{
    static readonly ReportText=new ModalBuilder()
    .setCustomId('texteenvoie')
    .setTitle(configuration.messages.ReturnReport.customMessage.title)
    //.setTitle(JSON.stringify(object))
    .setComponents([
      new ActionRowBuilder<TextInputBuilder>({
        components: [
          new TextInputBuilder({
            customId: 'texte_envoie',
            style: TextInputStyle.Short,
            required: true,
            maxLength: 32,
            minLength: 3,
            ...configuration.messages.ReturnReport.customMessage.description,
          }),
        ],
      })])
    public static resolveCallback: ((texte: string) => void) | null = null;

    async waitForSubmit(): Promise<string> {
        return new Promise<string>((resolve) => {
          GetText.resolveCallback = resolve;
        });
      }
  @ModalComponent({
      id:"texteenvoie"
  
    })
  async ReportSubmit(interaction: ModalSubmitInteraction){
    const replier=new InteractionReplier(interaction,true)
    await replier.defer()
    const texte=interaction.fields.getTextInputValue('texte_envoie')
    if (GetText.resolveCallback) {
        GetText.resolveCallback(texte);
        GetText.resolveCallback = null;
      }
    }}
