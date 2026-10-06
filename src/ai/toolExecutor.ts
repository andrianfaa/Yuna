import { ToolCall } from "@langchain/core/messages";
import makeWaSocket, { WAMessage } from "@whiskeysockets/baileys";
import { extractImageMessage } from "../utils/mediaUtilities";

export const handleToolCall = async (
  sock: ReturnType<typeof makeWaSocket>,
  jid: string,
  message: WAMessage,
  toolCalls: ToolCall[],
) => {
  if (toolCalls.length === 0 || !toolCalls) {
    console.log("No tool calls to handle.");
    return false;
  }

  for (const toolCall of toolCalls) {
    const toolName = toolCall.name;

    switch (toolName) {
      // case "make_sticker":
      //   const imageMessage = extractImageMessage(message);

      //   if (!imageMessage) {
      //     sock.sendMessage(jid, {
      //       text: "Tidak ada gambar yang ditemukan dalam pesan ini untuk dibuat menjadi stiker.",
      //     });

      //     return false;
      //   }

      default:
        return false;
    }
  }

  return false;
};
