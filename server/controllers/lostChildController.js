const LostChildReport = require('../models/LostChildReport');

// -------------------------------------------------------
// @route   POST /api/lostchild/report
// @desc    F12 — Submit a new lost-child report
// @access  Private (any logged-in role)
// -------------------------------------------------------
const submitReport = async (req, res) => {
  try {
    const { description, lastSeenZone, photoUrl } = req.body;

    if (!description || !lastSeenZone) {
      return res.status(400).json({ message: 'Description and last-seen zone are required' });
    }

    const report = await LostChildReport.create({
      submittedBy: req.user._id,
      description,
      lastSeenZone,
      photoUrl: photoUrl || null,
      status: 'open',
    });

    const populated = await report.populate('submittedBy', 'name email');

    res.status(201).json({
      message: '🚨 Lost-child alert submitted. All staff have been notified.',
      report: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/lostchild/active
// @desc    F13 — Get all currently OPEN reports (staff polls this)
// @access  Private — staff/admin only
// -------------------------------------------------------
const getActiveReports = async (req, res) => {
  try {
    const reports = await LostChildReport.find({ status: 'open' })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   PATCH /api/lostchild/:id/found
// @desc    F14 — Mark a report as found, clearing the alert
// @access  Private — staff/admin only
// -------------------------------------------------------
const markFound = async (req, res) => {
  try {
    const report = await LostChildReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.status === 'found') {
      return res.status(400).json({ message: 'This report is already marked as found' });
    }

    report.status = 'found';
    report.foundAt = new Date();
    report.foundBy = req.user._id;
    await report.save();

    res.json({ message: '✅ Marked as found. Alert cleared for all staff.', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// @route   GET /api/lostchild/history
// @desc    Optional — all reports (open + found), for admin visibility
// @access  Private — admin only
// -------------------------------------------------------
const getAllReports = async (req, res) => {
  try {
    const reports = await LostChildReport.find()
      .populate('submittedBy', 'name email')
      .populate('foundBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitReport, getActiveReports, markFound, getAllReports };