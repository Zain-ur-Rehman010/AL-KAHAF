const { Module, Lesson, Course } = require('../models');

exports.createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const module = await Module.create({ courseId, title, description, order });
    res.status(201).json({ message: 'Module created successfully', module });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const modules = await Module.findAll({
      where: { courseId },
      include: [{ model: Lesson, as: 'lessons', order: [['order', 'ASC']] }],
      order: [['order', 'ASC']],
    });

    res.json({ modules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
