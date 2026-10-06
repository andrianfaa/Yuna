import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "langchain";
import { DEFAULT_AI_PROFILE } from "../app/config";
import { sessionHistory } from "../helpers/sessionHistory";
import { stickerMakerTool } from "../tools/stickerMaker";
import { getFormattedIndoDate } from "../utils/dateUtils";

const initModel = async () => {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "qwen/qwen3.8-27b",
    temperature: 0.7,
    maxTokens: 1000,
  });
  const modelWithTools = model.bindTools([stickerMakerTool]);
  const promptTemplate = ChatPromptTemplate.fromMessages([
    new SystemMessage(DEFAULT_AI_PROFILE),
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
${message || "Pengguna mengirim gambar, tetapi tidak ada teks yang menyertainya. Ikuti konteks chat sebelumnya. Jika User sedang membuat stiker, langsung gunakan tool 'make_sticker' untuk membuat stiker dari gambar yang dikirimkan pengguna."}`
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
