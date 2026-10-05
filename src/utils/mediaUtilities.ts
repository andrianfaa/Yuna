import { downloadMediaMessage, WAMessage } from "@whiskeysockets/baileys";

export const extractImageMessage = ({ message }: WAMessage) => {
  return (
    message?.imageMessage ||
    message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
  );
};

export const downloadImageBuffer = async (
  message: WAMessage,
  jid: string,
): Promise<Buffer> => {
  const targetMessage: WAMessage = message.message?.imageMessage
    ? message
    : {
        key: {
          remoteJid: jid,
          id: message.message?.extendedTextMessage?.contextInfo?.stanzaId,
        },
        message:
          message.message?.extendedTextMessage?.contextInfo?.quotedMessage,
      };

  return (await downloadMediaMessage(targetMessage, "buffer", {})) as Buffer;
};
