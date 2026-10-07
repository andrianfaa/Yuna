import { tool } from "@langchain/core/tools";
import makeWASocket from "@whiskeysockets/baileys";
import axios from "axios";
import { AIMessage } from "langchain";
import z from "zod";
import { sessionHistory } from "../helpers/sessionHistory";

export const tiktokDownloaderTool = tool(async () => "tiktok_downloader", {
  name: "tiktok_downloader",
  description:
    "WAJIB dipanggil ketika pengguna mengirimkan link TikTok. Gunakan tool ini untuk mendownload video TikTok dari link yang dikirimkan pengguna.",
  schema: z.string().url(),
});

export const handleTiktokDownloader = async (
  sock: ReturnType<typeof makeWASocket>,
  jid: string,
  { input: tiktokUrl }: Record<string, string>,
) => {
  try {
    const formData = new FormData();

    formData.append("url", tiktokUrl);
    formData.append("count", "12");
    formData.append("cursor", "0");
    formData.append("web", "1");
    formData.append("hd", "1");

    const response = await axios.post("https://www.tikwm.com/api/", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
    const data = response.data;

    if (!data || !data.data) {
      await sock.sendMessage(jid, {
        text: "Maaf sayang, tidak dapat menemukan video TikTok dari link yang kamu kirimkan 😢. Pastikan link yang kamu kirimkan valid yaa.",
      });
      return false;
    }

    const caption = `
Done sayang, video TikTok nya berhasil didownload! 🎉

*Creator:* ${data.data.author.nickname} (@${data.data.author.unique_id})
*Views:* ${data.data.play_count}
*Title*:
${data.data.title}`;

    await sock.sendMessage(jid, {
      video: { url: `https://www.tikwm.com${data.data.hdplay}` },
      mimetype: "video/mp4",
      caption,
    });

    sessionHistory.add(
      jid,
      new AIMessage(
        "Bot telah mendownload video TikTok untuk pengguna sesuai permintaan. Video telah dikirimkan ke pengguna.",
      ),
    );

    return true;
  } catch (error) {
    console.error("Error while downloading TikTok video:", error);

    await sock.sendMessage(jid, {
      text: "Maaf sayang, terjadi kesalahan saat mendownload video TikTok. Pastikan link yang kamu kirimkan valid yaa 😢.",
    });

    return false;
  }
};
