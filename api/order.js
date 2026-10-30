export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body || {};
    // Telegram is handled solely by the client with the true sequential order ID.
    // Duplicate Telegram sending with random ID is permanently disabled.
    return res.status(200).json({ success: true, orderId: orderId || null });
  } catch (err) {
    console.error('[API Order Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
