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
  return Boolean(ENV.whatsappAccessToken && ENV.whatsappPhoneNumberId && ENV.whatsappHostPhone && ENV.whatsappTemplateName);
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
      console.warn(`[WhatsApp] Envoi échoué (${response.status})`, await response.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[WhatsApp] Erreur réseau lors de l’envoi", error);
    return false;
  }
}
