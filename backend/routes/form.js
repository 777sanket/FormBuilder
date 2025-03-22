const express = require("express");
const Form = require("../models/form.schema");
const Response = require("../models/response.schema");
const router = express.Router();

// Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a form
router.post("/create", async (req, res) => {
  try {
    const { title, formElements } = req.body;
    const newForm = new Form({
      title,
      formElements,
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a form by ID
router.get("/:formId", async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Edit a form
router.put("/:formId/edit", async (req, res) => {
  try {
    const { title, formElements } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.formId,
      { title, formElements },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a form
router.delete("/deleteForm/:formId", async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.formId);
    const deletedResponses = await Response.deleteMany({
      formId: req.params.formId,
    });

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res
      .status(200)
      .json({
        message: "Form deleted successfully",
        deletedForm,
        deletedResponses,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
