import { tool } from "@langchain/core/tools";
import makeWASocket, { WAMessage } from "@whiskeysockets/baileys";
import { AIMessage } from "langchain";
import { Sticker } from "stickers-formatter";
import z from "zod";
import { DEFAULT_STICKER_PACK } from "../app/config";
import { sessionHistory } from "../helpers/sessionHistory";
import {
  downloadImageBuffer,
  extractImageMessage,
} from "../utils/mediaUtilities";

export const stickerMakerTool = tool(async () => "make_sticker", {
  name: "make_sticker",
  description:
    "WAJIB dipanggil ketika pengguna meminta membuatkan stiker/sticker, mengubah foto/gambar menjadi stiker, atau mengetik kata kunci seperti 'bikin stiker', 'jadikan stiker', 'stikerin', atau 'buatin stiker'.",
  schema: z.object({}),
});

export const stickerMaker = async (imageBuffer: Buffer): Promise<Buffer> => {
  const sticker = new Sticker(imageBuffer, DEFAULT_STICKER_PACK);

  return await sticker.toBuffer();
};

export const handleStickerMaker = async (
  sock: ReturnType<typeof makeWASocket>,
  jid: string,
  message: WAMessage,
) => {
  const imageMessage = extractImageMessage(message);

  if (!imageMessage) {
    await sock.sendMessage(jid, {
      text: "Maaf sayang, gambarnya masih belum ada atau tidak valid 😢. Pastikan kamu mengirimkan gambar yang valid yaa.",
    });

    return true;
  }

  try {
    const buffer = await downloadImageBuffer(message, jid);
    const stickerBUffer = await stickerMaker(buffer);

    await sock.sendMessage(jid, {
      sticker: stickerBUffer,
    });

    sessionHistory.add(
      jid,
      new AIMessage(
        "Bot telah membuatkan stiker untuk pengguna sesuai permintaan. Stiker telah dikirimkan ke pengguna.",
      ),
    );

    return true;
  } catch (error) {
    console.error("Error while making sticker:", error);

    await sock.sendMessage(jid, {
      text: "Maaf sayang, terjadi kesalahan saat membuat stikernya 😢. Coba lagi yaa.",
    });

    return true;
  }
};
