import { ToolCall } from "@langchain/core/messages";
import makeWaSocket, { WAMessage } from "@whiskeysockets/baileys";
// Tools
import { handleInstagramDownloader } from "../tools/instagramDownloader";
import { handlePinterestDownloader } from "../tools/pinterestDownloader";
import { handleStickerMaker } from "../tools/stickerMaker";
import { handleTiktokDownloader } from "../tools/tiktokDownloader";

export const handleToolCall = async (
  sock: ReturnType<typeof makeWaSocket>,
  jid: string,
  message: WAMessage,
  toolCalls: ToolCall[],
) => {
  if (toolCalls.length === 0 || !toolCalls) return false;

  console.log("Tool calls detected:", toolCalls);

  for (const toolCall of toolCalls) {
    const toolName = toolCall.name;

    switch (toolName) {
      case "make_sticker":
        return await handleStickerMaker(sock, jid, message);

      case "tiktok_downloader":
        return await handleTiktokDownloader(sock, jid, toolCall.args);

      case "instagram_downloader":
        return await handleInstagramDownloader(sock, jid, toolCall.args);

      case "pinterest_downloader":
        return await handlePinterestDownloader(sock, jid, toolCall.args);

      default:
        return false;
    }
  }

  return false;
};
