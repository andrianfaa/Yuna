import makeWaSocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeWASocket,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";

async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({
    // can provide additional config here
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect,
      );

      // reconnect if not logged out
      if (shouldReconnect) {
        connectWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  // sock.ev.on("messages.upsert", async (event) => messageUpsert(sock, event));

  sock.ev.on("connection.update", async ({ qr, connection }) => {
    if (qr) {
      const qrcode = await import("qrcode-terminal");
      qrcode.default.generate(qr, { small: true });

      await QRCode.toFile("qr.png", qr);
    }

    if (connection === "open") {
      console.log("WhatsApp connected!");
    }
  });

  return sock;
}

export default connectWhatsApp;
