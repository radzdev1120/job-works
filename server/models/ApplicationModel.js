import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    expectedSalary: {
      type: Number,
    },
    availability: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one application per job per user
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);

export default Application; 