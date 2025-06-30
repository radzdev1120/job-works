import asycHandler from 'express-async-handler';
import User from  "../models/UserModel.js";


export const getUserProfile = asycHandler(async (req, res) => {
    try {
      const { id } = req.params;
      
      const user = await User.findOne({ auth0Id: id });

      if(!user){
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfile: ", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

export const createUser= (async(req, res) => {
  try {
    const user = req.body
  } catch (error) {
    
  }
}) 