import { Section } from "../models/sectionModel.js";
import { Course } from "../models/courseModel.js";
import { errorHandler } from "../utils/error.js";

export const createSection = async (req, res, next) => {
  try {
    const { sectionName } = req.body;
    const { courseId } = req.params;

    if (!sectionName) {
      return next(new errorHandler("Section name is required"));
    }

    if (!courseId) {
      return next(new errorHandler("Course ID not provided"));
    }

    // Create new section
    const section = await Section.create({ sectionName });

    // Update course to include the new section
    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: section._id } },
      { new: true }
    )
      .populate("Section") // Make sure your Course schema supports this
      .populate("Subsection"); // Make sure your Course schema supports this

    if (!updateCourseDetails) {
      return next(new errorHandler("Course not found or update failed"));
    }

    return res.status(200).json({
      success: true,
      message: "Section created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const { sectionName } = req.body;
    const { sectionId } = req.params;

    if (!sectionName) {
      return next(new errorHandler(400, "Section name is required"));
    }

    if (!sectionId) {
      return next(new errorHandler(400, "Section ID not provided"));
    }

    // Update section
    const updateSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if (!updateSection) {
      return next(new errorHandler(404, "Section not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSection = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return next(new errorHandler("Section ID not provided"));
    }

    // Delete section
    const deleteSection = await Section.findByIdAndDelete(sectionId);

    if (!deleteSection) {
      return next(new errorHandler(404, "Section not found"));
    }

    // Optional: Remove the section from any course that references it
    await Course.updateMany(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
