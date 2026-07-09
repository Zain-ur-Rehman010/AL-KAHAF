const { Lesson, Module, Course } = require('../models');

exports.createLesson = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { title, videoUrl, description, status, order, attachments } = req.body;

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
      attachments: attachments || null,
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const lesson = await Lesson.findOne({ where: { id: lessonId, moduleId, courseId } });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const { title, videoUrl, description, status, order, attachments } = req.body;
    await lesson.update({
      ...(title !== undefined && { title }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(order !== undefined && { order }),
      ...(attachments !== undefined && { attachments }),
    });

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
