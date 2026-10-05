import connectWhatsApp from "./connectWhatsApp";
import { getMessageContent, isFromMe } from "./helpers/messageHelper";
import { extractImageMessage } from "./utils/mediaUtilities";

(async () => {
  const client = await connectWhatsApp();

  client.ev.on("messages.upsert", async (event) => {
    console.log("Received message:", event);

    if (event.type !== "notify") return;

    for (const message of event.messages) {
      if (!isFromMe(message)) continue;

      const jid = message.key.remoteJid!;
      const messageContent = getMessageContent(message);
      const hasImage = !!extractImageMessage(message);

      await client.sendPresenceUpdate("composing", jid);

      await client.sendMessage(jid, {
        text: `You sent: ${messageContent}\nHas image: ${hasImage}`,
      });

      await client.sendPresenceUpdate("paused", jid);
    }
  });
})();
