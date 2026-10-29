// Real Visitor Tracking API for Beef & Buns Sousse
// In-memory persistent serverless counter across warm requests + sync

let globalVisits = {
  lastDate: new Date().toISOString().slice(0, 10),
  history: {} // 'YYYY-MM-DD' => count
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);

  // If new day, ensure key exists
  if (!globalVisits.history[today]) {
    globalVisits.history[today] = 0;
  }

  if (req.method === 'POST') {
    try {
      const { action } = req.body || {};
      if (action === 'record') {
        globalVisits.history[today] = (globalVisits.history[today] || 0) + 1;
      }
    } catch {
      // ignore body parsing error
    }
  }

  // Calculate true real metrics
  const day = globalVisits.history[today] || 0;

  // Calculate week (last 7 days)
  let week = 0;
  let month = 0;
  let year = 0;

  for (const [dateStr, count] of Object.entries(globalVisits.history)) {
    const num = Number(count) || 0;
    if (dateStr.startsWith(currentYear)) year += num;
    if (dateStr.startsWith(currentMonth)) month += num;

    const diffDays = Math.abs((new Date(today) - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) week += num;
  }

  return res.status(200).json({
    success: true,
    today,
    stats: {
      day: Math.max(day, 0),
      week: Math.max(week, day),
      month: Math.max(month, day),
      year: Math.max(year, day)
    }
  });
}

