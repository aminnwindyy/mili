// Reporting controller (no DB dependencies for now)

const getSummaryReport = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const summary = {
      period,
      users: { total: 2450, new: 120 },
      properties: { total: 178, new: 6 },
      investments: { total: 942, volume_irr: 78500000000 },
      transactions: { total: 3120, volume_irr: 154000000000 },
      trefs: { total: 14 }
    };
    res.json({ success: true, data: summary });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در تهیه گزارش خلاصه' });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const { period = '30d', group_by = 'day' } = req.query;
    const data = Array.from({ length: 7 }, (_, i) => ({
      label: `D${i + 1}`,
      revenue_irr: 5000000000 + i * 1000000000,
      transactions: 100 + i * 15
    }));
    res.json({ success: true, data: { period, group_by, series: data } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در گزارش درآمد' });
  }
};

const getUserGrowthReport = async (req, res) => {
  try {
    const data = Array.from({ length: 6 }, (_, i) => ({ month: `M${i + 1}`, users: 200 + i * 50 }));
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در گزارش رشد کاربران' });
  }
};

const exportReport = async (req, res) => {
  try {
    const { format = 'json', type = 'summary' } = req.query;
    const payload = { type, generated_at: new Date().toISOString(), items: [{ k: 'sample', v: 1 }] };

    if (format === 'csv') {
      const csv = 'key,value\n' + payload.items.map(i => `${i.k},${i.v}`).join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
      return res.status(200).send(csv);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({ success: true, data: payload });
  } catch (e) {
    res.status(500).json({ success: false, message: 'خطا در خروجی گرفتن گزارش' });
  }
};

module.exports = {
  getSummaryReport,
  getRevenueReport,
  getUserGrowthReport,
  exportReport
};


