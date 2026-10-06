import { tool } from "@langchain/core/tools";
import { Sticker, StickerTypes } from "stickers-formatter";
import z from "zod";

export const stickerMaker = async (imageBuffer: Buffer): Promise<Buffer> => {
  const sticker = new Sticker(imageBuffer, {
    pack: "Yuna's Sticker Pack",
    author: "Yuna",
    type: StickerTypes.FULL,
    quality: 100,
  });

  return await sticker.toBuffer();
};

export const stickerMakerTool = tool(async () => "make_sticker", {
  name: "make_sticker",
  description: "Membuat stiker dari gambar yang dikirim oleh pengguna.",
  schema: z.object({}),
});
