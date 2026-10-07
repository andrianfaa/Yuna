import { tool } from "@langchain/core/tools";
import makeWASocket from "@whiskeysockets/baileys";
import axios from "axios";
import { igdl } from "btch-downloader";
import { AIMessage } from "langchain";
import z from "zod";
import { sessionHistory } from "../helpers/sessionHistory";

export const instagramDownloaderTool = tool(
  async () => "instagram_downloader",
  {
    name: "instagram_downloader",
    description:
      "WAJIB dipanggil ketika pengguna mengirimkan link Instagram. Gunakan tool ini untuk mendownload video atau foto dari link Instagram yang dikirimkan pengguna.",
    schema: z.string().url(),
  },
);

export const handleInstagramDownloader = async (
  sock: ReturnType<typeof makeWASocket>,
  jid: string,
  { input: instagramUrl }: Record<string, string>,
) => {
  try {
    const response = await igdl(instagramUrl);

    if (!response || response.result?.length === 0) {
      await sock.sendMessage(jid, {
        text: "Maaf sayang, tidak dapat menemukan media dari link Instagram yang kamu kirimkan 😢.",
      });
      return false;
    }

    if (response.result && response.result.length > 0) {
      for (const media of response.result) {
        if (!media.thumbnail && !media.url) {
          await sock.sendMessage(jid, {
            text: "Maaf sayang, media dari link Instagram yang kamu kirimkan tidak valid atau tidak dapat diakses 😢.",
          });

          return false;
        }

        const content = await axios.get(media.url || media.thumbnail);
        const filename = content.headers["content-disposition"].includes(
          "filename=",
        )
          ? content.headers["content-disposition"].split("filename=")[1]
          : "unknown";

        if (filename.endsWith(".mp4")) {
          await sock.sendMessage(jid, {
            video: { url: media.url || media.thumbnail },
            mimetype: "video/mp4",
            caption: "Done sayang, video Instagram nya berhasil didownload! 🎉",
          });
        } else {
          await sock.sendMessage(jid, {
            image: { url: media.url || media.thumbnail },
            caption: "Done sayang, foto Instagram nya berhasil didownload! 🎉",
          });
        }

        sessionHistory.add(
          jid,
          new AIMessage(
            "Bot telah mendownload media dari link Instagram untuk pengguna sesuai permintaan. Media telah dikirimkan ke pengguna.",
          ),
        );

        return true;
      }
    }

    await sock.sendMessage(jid, {
      text: "Maaf sayang, tidak dapat menemukan media dari link Instagram yang kamu kirimkan 😢.",
    });

    return false;
  } catch (error) {
    console.error("Error while downloading Instagram media:", error);

    await sock.sendMessage(jid, {
      text: "Maaf sayang, terjadi kesalahan saat mencoba mendownload media dari link Instagram yang kamu kirimkan 😢. Coba lagi nanti yaa.",
    });

    return false;
  }
};
