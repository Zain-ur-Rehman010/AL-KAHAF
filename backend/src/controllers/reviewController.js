const { Review, User, Course } = require('../models');
const { Op } = require('sequelize');

const studentAttrs = ['id', 'firstName', 'lastName', 'profileImage'];

// PUBLIC — approved reviews for homepage
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { status: 'approved' },
      include: [{ model: User, as: 'student', attributes: studentAttrs }],
      order: [['createdAt', 'DESC']],
      limit: 9,
    });
    res.json({ success: true, data: reviews });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// STUDENT — get own reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// STUDENT — submit new review
exports.createReview = async (req, res) => {
  try {
    const { message, rating, location, courseId } = req.body;
    if (!message || !rating) {
      return res.status(400).json({ success: false, message: 'Message and rating are required' });
    }
    const review = await Review.create({
      userId: req.user.userId,
      message,
      rating: parseInt(rating),
      location: location || null,
      courseId: courseId || null,
      status: 'pending',
    });
    res.status(201).json({ success: true, data: review, message: 'Review submitted for approval' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// STUDENT — edit own review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ where: { id: req.params.id, userId: req.user.userId } });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const { message, rating, location } = req.body;
    await review.update({ message, rating: parseInt(rating), location, status: 'pending' });
    res.json({ success: true, data: review, message: 'Review updated and re-submitted for approval' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// STUDENT — delete own review
exports.deleteReview = async (req, res) => {
  try {
    const where = req.user.role === 'admin'
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.userId };
    const review = await Review.findOne({ where });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.destroy();
    res.json({ success: true, message: 'Review deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ADMIN — get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const reviews = await Review.findAll({
      where,
      include: [{ model: User, as: 'student', attributes: studentAttrs }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: reviews });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// ADMIN — approve or reject review
exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await review.update({ status });

    // Recalculate course rating when a course review is approved or rejected
    if (review.courseId) {
      const approved = await Review.findAll({
        where: { courseId: review.courseId, status: 'approved' },
        attributes: ['rating'],
      });
      const avg = approved.length
        ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
        : 0;
      await Course.update(
        { rating: Math.round(avg * 10) / 10 },
        { where: { id: review.courseId } }
      );
    }

    res.json({ success: true, data: review });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};