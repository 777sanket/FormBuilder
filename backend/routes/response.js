const express = require("express");
const Response = require("../models/response.schema");
const Form = require("../models/form.schema");

const router = express.Router();

// Submit form
router.post("/submit/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;

    const formExists = await Form.findById(formId);
    if (!formExists) {
      return res.status(404).json({ message: "Form not found" });
    }

    const newResponse = new Response({
      formId,
      responses,
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get responses
router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const responses = await Response.find({ formId }).sort({ createdAt: -1 });

    res.status(200).json({
      form,
      responses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
