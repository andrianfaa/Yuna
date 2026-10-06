import { WAMessage } from "@whiskeysockets/baileys";

export function isFromMe(message: WAMessage): boolean {
  return !!(
    message.key.fromMe ||
    !message.message ||
    (message.message.protocolMessage &&
      message.message.protocolMessage.key?.fromMe) ||
    message.message?.stickerMessage
  );
}

export function getMessageContent({ message }: WAMessage): string {
  return (
    message?.conversation ||
    message?.extendedTextMessage?.text ||
    message?.imageMessage?.caption ||
    message?.videoMessage?.caption ||
    message?.documentMessage?.caption ||
    ""
  );
}

export function getMessageType(message: WAMessage): string {
  if (message.message?.conversation) return "text";
  if (message.message?.extendedTextMessage) return "extendedText";
  if (
    message.message?.imageMessage ||
    message.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.imageMessage
  )
    return "image";
  if (message.message?.videoMessage) return "video";
  if (message.message?.documentMessage) return "document";
  if (message.message?.stickerMessage) return "sticker";
  if (message.message?.audioMessage) return "audio";
  if (message.message?.locationMessage) return "location";
  if (message.message?.contactMessage) return "contact";
  if (message.message?.pollCreationMessage) return "pollCreation";
  if (message.message?.listMessage) return "list";
  if (message.message?.templateMessage) return "template";
  if (message.message?.buttonsResponseMessage) return "buttonsResponse";
  if (message.message?.protocolMessage) return "protocol";
  if (message.message?.reactionMessage) return "reaction";
  if (message.message?.liveLocationMessage) return "liveLocation";
  if (message.message?.viewOnceMessage) return "viewOnce";
  if (message.message?.ephemeralMessage) return "ephemeral";
  if (message.message?.senderKeyDistributionMessage)
    return "senderKeyDistribution";
  if (message.message?.groupInviteMessage) return "groupInvite";

  return "unknown";
}
