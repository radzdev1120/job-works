import express from "express";
import { createJob, getJobs, getJobsByUser,searchJobs, applyJob,likeJob, } from "../controllers/jobController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/jobs",protect, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/user/:id", protect, getJobsByUser);


// job search
router.get("/jobs/search", searchJobs);

// apply for jobs
router.put("/jobs/apply/:id", protect, applyJob);

// like job and unlike job
router.put("/jobs/like/:id", protect, likeJob);

export default router;
