import { createTranscript } from 'discord-html-transcripts';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Ticket } from '../../models/ticket/ticket';
import { Button } from '../../structures/Button';

export default new Button({
  customId: 'tr_ticket',
  run: async (client, interaction) => {
    let TicketDocument = await Ticket.findOne({
      TicketChannelID: interaction.channel.id,
    });
    if (TicketDocument) {
      if (TicketDocument.TicketStatus !== 'Closed') return;
      let attach = await createTranscript(interaction.channel as TextChannel, {
        fileName: `${
          (interaction.channel as TextChannel).name
        }_transcript.html`,
      });
      let reply = (await interaction.reply({
        embeds: [
          new MessageEmbed().setColor('#075FFF').setAuthor({
            name: 'Transcripting...',
            iconURL:
              'https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1',
          }),
        ],
        fetchReply: true,
      })) as Message;

      setTimeout(async () => {
        await reply.edit({ files: [attach], embeds: [] });
      }, 3000);
    }
  },
});
