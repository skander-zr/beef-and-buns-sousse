import { ENV } from "./_core/env";

type NotificationKind = "reservation" | "order";

type ReservationNotification = {
  kind: "reservation";
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
};

type OrderNotification = {
  kind: "order";
  id: number;
  customerName: string;
  phone: string;
  orderType: "pickup" | "delivery";
  totalDt: number;
};

export type WhatsAppNotification = ReservationNotification | OrderNotification;

const normalizePhone = (value: string) => value.replace(/[^\d]/g, "");

export function isWhatsAppConfigured() {
  return Boolean(
    ENV.callmebotApiKey ||
    (ENV.whatsappAccessToken && ENV.whatsappPhoneNumberId && ENV.whatsappHostPhone && ENV.whatsappTemplateName)
  );
}

export const templateParameters = (notification: WhatsAppNotification) => {
  if (notification.kind === "reservation") {
    return [
      String(notification.id),
      notification.name,
      `${notification.date} à ${notification.time}`,
      `${notification.guests} personne${notification.guests > 1 ? "s" : ""}`,
      notification.phone,
    ];
  }
  return [
    String(notification.id),
    notification.customerName,
    `${notification.totalDt} DT`,
    notification.orderType === "delivery" ? "Livraison" : "À emporter",
    notification.phone,
  ];
};

export async function notifyHostOnWhatsApp(notification: WhatsAppNotification): Promise<boolean> {
  if (!isWhatsAppConfigured()) {
    console.info(`[WhatsApp] Notification ${notification.kind} #${notification.id} non envoyée : intégration non configurée.`);
    return false;
  }

  // Option 1 : Envoi automatique via CallMeBot (gratuit, sans compte Meta)
  if (ENV.callmebotApiKey) {
    const phone = normalizePhone(ENV.whatsappHostPhone || "21620217090");
    const msg =
      notification.kind === "reservation"
        ? `🍽️ *Nouvelle réservation Per Voi (#${notification.id})*\n👤 Client: ${notification.name}\n📞 Tél: ${notification.phone}\n📅 Date: ${notification.date} à ${notification.time}\n👥 Couverts: ${notification.guests} pers.`
        : `🍕 *Nouvelle commande Per Voi (#${notification.id})*\n👤 Client: ${notification.customerName}\n📞 Tél: ${notification.phone}\n📦 Type: ${notification.orderType === "delivery" ? "Livraison" : "À emporter"}\n💰 Total: ${notification.totalDt} DT`;

    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${phone}&text=${encodeURIComponent(msg)}&apikey=${ENV.callmebotApiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        console.info(`[WhatsApp CallMeBot] Notification ${notification.kind} #${notification.id} envoyée avec succès.`);
        return true;
      }
      console.warn(`[WhatsApp CallMeBot] Échec HTTP (${res.status})`, await res.text().catch(() => ""));
    } catch (err) {
      console.warn("[WhatsApp CallMeBot] Erreur réseau", err);
    }
  }

  // Option 2 : Envoi officiel via Meta WhatsApp Cloud API (si configuré)
  if (ENV.whatsappAccessToken && ENV.whatsappPhoneNumberId) {
    const version = ENV.whatsappApiVersion || "v23.0";
    const endpoint = `https://graph.facebook.com/${version}/${ENV.whatsappPhoneNumberId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: normalizePhone(ENV.whatsappHostPhone),
      type: "template",
      template: {
        name: ENV.whatsappTemplateName,
        language: { code: ENV.whatsappTemplateLanguage || "fr" },
        components: [{ type: "body", parameters: templateParameters(notification).map(text => ({ type: "text", text })) }],
      },
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${ENV.whatsappAccessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.warn(`[WhatsApp Meta] Envoi échoué (${response.status})`, await response.text().catch(() => ""));
        return false;
      }
      return true;
    } catch (error) {
      console.warn("[WhatsApp Meta] Erreur réseau lors de l’envoi", error);
      return false;
    }
  }

  return false;
}
