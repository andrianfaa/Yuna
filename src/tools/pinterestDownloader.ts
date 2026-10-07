import { tool } from "@langchain/core/tools";
import makeWASocket from "@whiskeysockets/baileys";
import { pinterest } from "btch-downloader";
import type { PinterestApiResponse } from "btch-downloader/Types";
import { AIMessage } from "langchain";
import z from "zod";
import { sessionHistory } from "../helpers/sessionHistory";

export const pinterestDownloaderTool = tool(
  async () => "pinterest_downloader",
  {
    name: "pinterest_downloader",
    description:
      "WAJIB dipanggil ketika pengguna mengirimkan link Pinterest. Gunakan tool ini untuk mendownload video atau foto dari link Pinterest yang dikirimkan pengguna.",
    schema: z.string().url(),
  },
);

export const handlePinterestDownloader = async (
  sock: ReturnType<typeof makeWASocket>,
  jid: string,
  { input: pinterestUrl }: Record<string, string>,
) => {
  try {
    const response = await pinterest(pinterestUrl);

    console.log(
      "Pinterest media download result:",
      JSON.stringify(response, null, 2),
    );

    if (!response || !response.result) {
      await sock.sendMessage(jid, {
        text: "Maaf sayang, tidak dapat menemukan media dari link Pinterest yang kamu kirimkan 😢.",
      });

      return false;
    }

    const result = response.result?.result as PinterestApiResponse;

    if (result.image) {
      await sock.sendMessage(jid, {
        image: { url: result.image },
        caption: "Done sayang, Pinterest nya berhasil didownload! 🎉",
      });
    }

    if (result.video_url) {
      await sock.sendMessage(jid, {
        video: { url: result.video_url },
        mimetype: "video/mp4",
        caption: "Done sayang, Pinterest nya berhasil didownload! 🎉",
      });
    }

    sessionHistory.add(
      jid,
      new AIMessage(
        "Bot telah mendownload media Pinterest untuk pengguna sesuai permintaan. Media telah dikirimkan ke pengguna.",
      ),
    );

    return true;
  } catch (error) {
    console.error("Error while downloading Pinterest media:", error);

    await sock.sendMessage(jid, {
      text: "Maaf sayang, terjadi kesalahan saat mencoba mendownload media dari link Pinterest yang kamu kirimkan 😢.",
    });

    return false;
  }
};
