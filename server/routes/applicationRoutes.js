import express from "express";
import {
  submitApplication,
  getJobApplications,
  getUserApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

// Submit a new application
router.post("/jobs/:jobId/apply", protect, submitApplication);

// Get all applications for a specific job (for recruiters)
router.get("/jobs/:jobId/applications", protect, getJobApplications);

// Get all applications for the current user
router.get("/applications", protect, getUserApplications);

// Update application status
router.put("/applications/:applicationId/status", protect, updateApplicationStatus);

export default router; 