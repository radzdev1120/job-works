import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

// Submit a new application
export const submitApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, expectedSalary, availability, notes } = req.body;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      coverLetter,
      expectedSalary,
      availability,
      notes,
    });

    // Update job's applicants array
    await Job.findByIdAndUpdate(jobId, {
      $push: { applicants: userId },
    });

    // Update user's appliedJobs array
    await User.findByIdAndUpdate(userId, {
      $push: { appliedJobs: jobId },
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a job (for recruiters)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email profilePicture profession")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a user
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ applicant: userId })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 