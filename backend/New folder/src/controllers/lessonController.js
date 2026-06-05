const { Lesson, Module, Course } = require('../models');

exports.createLesson = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, videoUrl, description, status, order } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const module = await Module.findOne({ where: { id: moduleId, courseId } });
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const lesson = await Lesson.create({
      courseId,
      moduleId,
      title,
      videoUrl: videoUrl || null,
      description: description || null,
      status: status || 'draft',
      order,
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
