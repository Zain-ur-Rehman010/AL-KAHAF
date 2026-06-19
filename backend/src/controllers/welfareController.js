const { Op } = require('sequelize');
const WelfareProgram = require('../models/WelfareProgram');
const WelfareDonation = require('../models/WelfareDonation');

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── PROGRAMS ─────────────────────────────────────────────────────────────────

exports.getPrograms = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status)   where.status   = status;
    if (category) where.category = category;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await WelfareProgram.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ success: true, total: count, programs: rows });
  } catch (err) {
    console.error('getPrograms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    // Accept both UUID primary key and slug
    const { id } = req.params;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const prog = uuidPattern.test(id)
      ? await WelfareProgram.findByPk(id)
      : await WelfareProgram.findOne({ where: { slug: id } });
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, program: prog });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const { title, category, description, goal, location, beneficiaries, thumbnail, banner, gallery, impact, fundUse, milestones, urgent, status, startedDate } = req.body;
    if (!title || !category || !goal) {
      return res.status(400).json({ success: false, message: 'title, category and goal are required' });
    }

    // Ensure unique slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let i = 1;
    while (await WelfareProgram.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const prog = await WelfareProgram.create({
      title, slug, category, description, goal,
      location, beneficiaries, thumbnail: thumbnail || null, banner,
      gallery:    Array.isArray(gallery)    ? gallery    : [],
      impact:     Array.isArray(impact)     ? impact     : [],
      fundUse:    fundUse    || null,
      milestones: Array.isArray(milestones) ? milestones : [],
      urgent: !!urgent,
      status: status || 'active',
      startedDate: startedDate || null,
    });

    res.status(201).json({ success: true, program: prog });
  } catch (err) {
    console.error('createProgram error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const prog = await WelfareProgram.findByPk(req.params.id);
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });

    const allowed = ['title', 'category', 'description', 'goal', 'raised', 'donors', 'location', 'beneficiaries', 'thumbnail', 'banner', 'gallery', 'impact', 'fundUse', 'milestones', 'urgent', 'status', 'startedDate'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) prog[key] = req.body[key];
    }

    // Regenerate slug if title changed
    if (req.body.title && req.body.title !== prog.title) {
      let baseSlug = slugify(req.body.title);
      let slug = baseSlug;
      let i = 1;
      while (await WelfareProgram.findOne({ where: { slug, id: { [Op.ne]: prog.id } } })) {
        slug = `${baseSlug}-${i++}`;
      }
      prog.slug = slug;
    }

    await prog.save();
    res.json({ success: true, program: prog });
  } catch (err) {
    console.error('updateProgram error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const prog = await WelfareProgram.findByPk(req.params.id);
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });
    await prog.destroy();
    res.json({ success: true, message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── DONATIONS ─────────────────────────────────────────────────────────────────

exports.getDonations = async (req, res) => {
  try {
    const { programId, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (programId) where.programId = programId;
    if (status)    where.status    = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await WelfareDonation.findAndCountAll({
      where,
      include: [{ model: WelfareProgram, as: 'program', attributes: ['id', 'title', 'slug'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ success: true, total: count, donations: rows });
  } catch (err) {
    console.error('getDonations error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const { programId, donorName, donorPhone, donorEmail, amount, payMethod, anonymous, notes, transactionId } = req.body;
    if (!programId || !donorName || !amount) {
      return res.status(400).json({ success: false, message: 'programId, donorName and amount are required' });
    }

    const prog = await WelfareProgram.findByPk(programId);
    if (!prog) return res.status(404).json({ success: false, message: 'Program not found' });

    const donation = await WelfareDonation.create({
      programId, donorName, donorPhone, donorEmail,
      amount, payMethod: payMethod || 'jazzcash',
      anonymous: !!anonymous, notes, transactionId,
      status: 'completed',
    });

    // Update program raised amount and donor count
    await prog.increment({ raised: parseFloat(amount), donors: 1 });

    res.status(201).json({ success: true, donation });
  } catch (err) {
    console.error('createDonation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateDonationStatus = async (req, res) => {
  try {
    const donation = await WelfareDonation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });

    const { status } = req.body;
    if (!['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    donation.status = status;
    await donation.save();
    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── STATS ─────────────────────────────────────────────────────────────────────

exports.getWelfareStats = async (req, res) => {
  try {
    const { sequelize } = require('../models');

    const totalPrograms  = await WelfareProgram.count();
    const activePrograms = await WelfareProgram.count({ where: { status: 'active' } });
    const totalDonations = await WelfareDonation.count({ where: { status: 'completed' } });

    const totalRaisedRow = await WelfareDonation.findOne({
      where: { status: 'completed' },
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      raw: true,
    });
    const totalRaised = parseFloat(totalRaisedRow?.total || 0);

    const recentDonations = await WelfareDonation.findAll({
      where: { status: 'completed' },
      include: [{ model: WelfareProgram, as: 'program', attributes: ['title'] }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.json({
      success: true,
      stats: { totalPrograms, activePrograms, totalDonations, totalRaised },
      recentDonations,
    });
  } catch (err) {
    console.error('getWelfareStats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};