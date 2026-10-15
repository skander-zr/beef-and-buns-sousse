import { ENV } from "./_core/env";

type TelegramNotification =
  | {
      kind: "order";
      id: number;
      customerName: string;
      phone: string;
      orderType: "pickup" | "delivery";
      totalDt: number;
      address?: string;
      notes?: string;
    }
  | {
      kind: "reservation";
      id: number;
      name: string;
      phone: string;
      date: string;
      time: string;
      guests: number;
      notes?: string;
    };

export async function notifyOnTelegram(notification: TelegramNotification): Promise<boolean> {
  const token = ENV.telegramBotToken;
  const chatId = ENV.telegramChatId;
  if (!token || !chatId) return false;

  let text = "";
  if (notification.kind === "order") {
    text = `🍕 *NOUVELLE COMMANDE PER VOI (#${notification.id})*

👤 *Client :* ${notification.customerName}
📞 *Tél :* ${notification.phone}
📦 *Mode :* ${notification.orderType === "delivery" ? `Livraison 🛵 (${notification.address || "Adresse non fournie"})` : "À emporter 🥡"}
💰 *Total :* ${notification.totalDt} DT
${notification.notes ? `📝 *Note :* ${notification.notes}\n` : ""}
👉 [Ouvrir l'Espace Gérant](https://per-voi-sousse-2.onrender.com/hote)`;
  } else {
    text = `🍽️ *NOUVELLE RÉSERVATION PER VOI (#${notification.id})*

👤 *Client :* ${notification.name}
📞 *Tél :* ${notification.phone}
📅 *Date :* ${notification.date} à ${notification.time}
👥 *Couverts :* ${notification.guests} personnes
${notification.notes ? `📝 *Notes :* ${notification.notes}\n` : ""}
👉 [Ouvrir l'Espace Gérant](https://per-voi-sousse-2.onrender.com/hote)`;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
    if (!response.ok) {
      console.warn(`[Telegram] Erreur envoi (${response.status})`, await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Telegram] Erreur réseau", err);
    return false;
  }
}
