import { chat } from "./ai/groq";
import { handleToolCall } from "./ai/toolExecutor";
import connectWhatsApp from "./connectWhatsApp";
import {
  getMessageContent,
  getMessageType,
  isFromMe,
} from "./helpers/messageHelper";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const client = await connectWhatsApp();

  /**
   * Handle incoming calls and messages.
   *
   * Reject incoming calls and send a message to the caller
   * Process incoming messages, generate AI responses, and handle tool calls
   */
  client.ev.on("call", async (event) => {
    console.log("Incoming call event:", event);

    for (const call of event) {
      if (call.status !== "offer") continue;

      await client.rejectCall(call.id, call.from);

      const response = await chat(
        call.from,
        "Pengguna baru saja melakukan panggilan, tolong beri tahu bahwa kamu tidak bisa menerima panggilan, hanya bisa menerima pesan teks.",
        false,
      );
      await client.sendMessage(call.from, {
        text: response.text,
      });
    }
  });

  /**
   * Handle incoming messages.
   *
   * Ignore messages sent by the bot itself.
   */
  client.ev.on("messages.upsert", async (event) => {
    if (event.type !== "notify") return;

    for (const message of event.messages) {
      if (isFromMe(message)) continue;

      const jid = message.key.remoteJid!;
      const messageContent = getMessageContent(message);
      const hasImage = getMessageType(message) === "image";

      await client.sendPresenceUpdate("composing", jid);

      const response = await chat(jid, messageContent, hasImage);
      const isToolExecuted = await handleToolCall(
        client,
        jid,
        message,
        response.tool_calls || [],
      );

      if (!isToolExecuted && response.text) {
        await client.sendMessage(jid, {
          text: response.text,
        });
      }

      await client.sendPresenceUpdate("paused", jid);
    }
  });
})();
