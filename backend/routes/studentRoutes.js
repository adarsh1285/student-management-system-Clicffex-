const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

// POST /api/students - Add new student with validation
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("age")
      .isInt({ min: 1 })
      .withMessage("Age must be a number greater than 0"),
    body("course").notEmpty().withMessage("Course is required"),
  ],
  async (req, res) => {
    // validationResult se errors nikalte hain
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(), // array of error objects
      });
    }

    try {
      const { name, email, age, course } = req.body;

      const newStudent = new Student({ name, email, age, course });
      await newStudent.save();

      res.status(201).json({ message: "Student added successfully" });
    } catch (error) {
      console.error("Error saving student:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/students - Fetch all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
});

// GET /api/students/search?name=ad
router.get("/search", async (req, res) => {
  const { name } = req.query;

  try {
    const students = await Student.find({
      name: { $regex: name, $options: "i" } // case-insensitive search
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});




module.exports = router;
