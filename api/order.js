export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, phone, orderType, neighborhood, address, notes, items, totalDt } = req.body || {};

    const token = process.env.TELEGRAM_BOT_TOKEN || '9194319608:AAFh739rW2GzXpyVB14BCWN1gfKzJ4KQ3_k';
    const chatId = process.env.TELEGRAM_CHAT_ID || '6048748092';
    const orderId = Math.floor(1000 + Math.random() * 9000);

    let text = '🍔 *NOUVELLE COMMANDE BEEF & BUNS (#' + orderId + ')*\n\n';
    text += '👤 *Client :* ' + (customerName || 'Non renseigné') + '\n';
    text += '📞 *Tél :* ' + (phone || 'Non renseigné') + '\n';
    text += '📦 *Mode :* ' + (orderType === 'delivery' ? '🛵 Livraison (' + (neighborhood || 'Sousse') + ')' : '🥡 À emporter') + '\n';
    if (orderType === 'delivery') {
      text += '📍 *Adresse :* ' + (address || 'Non fournie') + '\n';
    }
    if (notes) {
      text += '📝 *Notes :* ' + notes + '\n';
    }

    text += '\n🛒 *ARTICLES COMMANDÉS :*\n';
    if (Array.isArray(items)) {
      items.forEach((item, idx) => {
        text += (idx + 1) + '. *' + item.quantity + 'x ' + item.name + '* (' + Number(item.totalPrice).toFixed(1) + ' DT)\n';
        if (item.pattiesCount && item.pattiesCount > 1) {
          text += '   └ Steaks : ' + (item.pattiesCount === 3 ? 'Triple' : 'Double') + '\n';
        }
        if (Array.isArray(item.selectedExtras) && item.selectedExtras.length > 0) {
          text += '   └ Extras : ' + item.selectedExtras.map(e => e.name).join(', ') + '\n';
        }
      });
    }

    text += '\n💰 *TOTAL COMMANDE : ' + Number(totalDt || 0).toFixed(1) + ' DT*\n';
    text += '⏰ *Heure :* ' + new Date().toLocaleTimeString('fr-FR', { timeZone: 'Africa/Tunis' }) + '\n';
    text += '\n👉 _Commande passée sur le site beef-and-buns-sousse.vercel.app_';

    const telegramRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });

    const data = await telegramRes.json();
    return res.status(200).json({ success: true, orderId, telegramOk: data.ok });
  } catch (err) {
    console.error('[API Order Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
