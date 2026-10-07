import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "langchain";
import { DEFAULT_AI_PROFILE, DEFAULT_FEATURES_AND_TOOLS } from "../app/config";
import { sessionHistory } from "../helpers/sessionHistory";
import { getFormattedIndoDate } from "../utils/dateUtils";
// Tools
import { instagramDownloaderTool } from "../tools/instagramDownloader";
import { stickerMakerTool } from "../tools/stickerMaker";
import { tiktokDownloaderTool } from "../tools/tiktokDownloader";
import { pinterestDownloaderTool } from "../tools/pinterestDownloader";

const initModel = async () => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "qwen/qwen3.8-27b",
    temperature: 0.7,
    maxTokens: 1000,
  });
  // Attach tools to the model
  const modelWithTools = model.bindTools([
    stickerMakerTool,
    instagramDownloaderTool,
    tiktokDownloaderTool,
    pinterestDownloaderTool,
    // Add more tools here as needed
  ]);
  const promptTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(DEFAULT_AI_PROFILE),
    new SystemMessage(DEFAULT_FEATURES_AND_TOOLS),
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
  ]);
  const chain = promptTemplate.pipe(modelWithTools);

  return chain;
};

export const chat = async (
  jid: string,
  message: string,
  hasImage: boolean = false,
) => {
  const currentDate = getFormattedIndoDate();
  const userPrompt = hasImage
    ? `[Waktu saat ini: ${currentDate}] 
[Sistem: Pengguna mengirim gambar/media.] 

Pesan: 
${message || "Pengguna mengirim gambar/media, tetapi tidak ada teks yang menyertainya. Ikuti konteks chat sebelumnya. Jika User sedang membuat stiker, langsung gunakan tool 'make_sticker' untuk membuat stiker dari gambar yang dikirimkan pengguna."}`
    : `[Waktu saat ini: ${currentDate}] 

Pesan: 
${message}
    `;
  const chatHistory: BaseMessage[] = sessionHistory.get(jid);

  try {
    const chain = await initModel();
    const response = await chain.invoke({
      input: userPrompt,
      history: chatHistory,
    });

    const responseText = response.text;

    sessionHistory.add(jid, new HumanMessage(userPrompt));
    sessionHistory.add(jid, new AIMessage(responseText));

    return response;
  } catch (error) {
    console.error("Error during chat processing:", error);

    return {
      text: "Maaf sayang, terjadi kesalahan saat memproses pesanmu. Silakan coba lagi nanti 😢.",
      tool_calls: [],
    };
  }
};
