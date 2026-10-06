import { ToolCall } from "@langchain/core/messages";
import makeWaSocket, { WAMessage } from "@whiskeysockets/baileys";
import { handleStickerMaker } from "../tools/stickerMaker";

export const handleToolCall = async (
  sock: ReturnType<typeof makeWaSocket>,
  jid: string,
  message: WAMessage,
  toolCalls: ToolCall[],
) => {
  if (toolCalls.length === 0 || !toolCalls) return false;

  for (const toolCall of toolCalls) {
    const toolName = toolCall.name;

    switch (toolName) {
      case "make_sticker":
        return await handleStickerMaker(sock, jid, message);

      default:
        return false;
    }
  }

  return false;
};
