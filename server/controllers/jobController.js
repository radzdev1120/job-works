import asyncHandler from "express-async-handler";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

export const createJob = asyncHandler(async (req, res) => {
    try {

        const user = await User.findOne({auth0Id: req.oidc.user.sub});
        const isAuth = req.oidc.isAuthenticated() || user.email;

        if(!isAuth){
            return res.status(401).json({message: "Not Authorized"});
        }

      const { title, description, location, salary, jobType, tags, skills, salaryType, negotiable,} = req.body;

      if(!title){
        return res.status(400).json({ message: "Title is required" });
      }

      if(!description){
        return res.status(400).json({ message: "description is required" });
      }

      if(!location){
        return res.status(400).json({ message: "location is required" });
      }

      if(!salary){
        return res.status(400).json({ message: "Salary is required" });
      }

      if(!jobType){
        return res.status(400).json({ message: "Job Type is required" });
      }

      if(!tags){
        return res.status(400).json({ message: "Tags is required" });
      }

      if(!skills){
        return res.status(400).json({ message: "Skills is required" });
      }
        const job = new Job({
            title, description, location, salary, jobType, tags, skills, salaryType, negotiable, createdBy: user._id,
        }
    );

    await job.save();

    return res.status(201).json(job);
    } catch (error) {
        console.log("Error in createJob:", error);
        return res.status(500).json({
            message: "Server Error",
        });
        
    }
});

// get Jobs
export const getJobs = asyncHandler(async (req, res) => {
    try {
        const jobs =  await Job.find({}).populate(
            "createdBy", "name profilePicture").sort({ createdAt: -1 });

        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getJobs: ", error);
        return res.status(500).json({
            message: "Server Error",
        });
        
    }

});

// get your by user

export const getJobsByUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById( req.params.id);
        
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const jobs = await Job.find({createdBy: user._id}).populate("createdBy", "name profilePicture");

        return res.status(200).json(jobs);
    } catch (error) {
        console.log("Error in getJobsByUser: ", error);
        return res.status(500).json({
            message: "Server Error",
        });
    }
});

// search jobs

export const searchJobs = asyncHandler(async ( req, res) => {
  try {
    const {tags, location, title} = req.query;

    let query = {};

    if (tags){
      query.tags = { $in: tags.split(",") };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(query).populate("createdBy", "name profilePicture");

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in searchJobs: ", error);
    return res.status(500).json({
      message: "Server error",
    });
    
  }
});

// apply for job
export const applyJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if(!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if(!user) {
      return res.status(404).json({ message:  "User not found" });
    }

    if (job.applicants.includes(user._id)) {
      return res.status(400).json({ message: "Already applied in this job" });
    }

    job.applicants.push(user._id);

    await job.save();

    return res.status(200).json(job);
    
  } catch (error) {
    console.log("Error in applyJob: ", error);
    return res.status(500).json({
      message: "Server Error",
    });
    
  }
});

// like and unlike job

export const likeJob = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isLiked = job.likes.includes(user._id);

    if (isLiked) {
      job.likes = job.likes.filter((like) => !like.equals(user._id));

    }else {
      job.likes.push(user._id);
    }

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error in likeJob: ", error);
    return res.status(500).json({
      message: "server Error",
    });
  }
});