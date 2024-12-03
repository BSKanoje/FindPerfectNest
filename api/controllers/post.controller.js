import prisma from "../lib/prisma.js";
import { ObjectId } from 'mongodb';  // Import MongoDB's ObjectId for validation
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) =>{
    const query = req.query;
    try{

        const posts = await prisma.post.findMany({
            where:{
                city:query.city || undefined,
                type:query.type || undefined,
                property:query.property || undefined,
                bedroom:parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000000,
                }
            }
        });

        //setTimeout(() => {
            res.status(200).json(posts);
        //}, 3000)

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get Posts"});
    }
};

/*export const getPost = async (req, res) => {
    const id = req.params.id; 

    try {

        const post = await prisma.post.findUnique({
            where: { id },
            include:{
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
            }
        });

        let userId;

        const token = req.cookies?.token;

        if(!token){
            userId= null;
        } else{
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) =>{
                if(err){
                    userId= null;
                }else{
                    userId = payload.id;
                }
            });
        }

        const saved = await prisma.savedPost.findUnique({
            where:{
                userId_postId: {
                    postId: id,
                    userId,
                },
            },
        });

        res.status(200).json({...post, isSaved: saved? true : false});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get Post" });
    }
};

export const getPost = async (req, res) => {
    const id = req.params.id; 

    try {
        // Fetch the post with details and user info
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        let userId = null;

        const token = req.cookies?.token;

        // Verify token and extract userId
        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
                userId = payload.id;
            } catch (err) {
                console.error("JWT Verification Error:", err);
            }
        }

        // Check if the post is saved by the current user
        const saved = userId
            ? await prisma.savedPost.findUnique({
                  where: {
                      userId_postId: {
                          postId: id,
                          userId,
                      },
                  },
              })
            : null;

        // Respond with the post details and saved status
        res.status(200).json({
            ...post,
            isSaved: !!saved, // Convert to boolean
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get Post" });
    }
};
*/
export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        let userId = null;
        const token = req.cookies?.token;

        if (token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
                userId = payload.id;
            } catch (err) {
                console.error("JWT Verification Error:", err);
            }
        }

        const saved = userId
            ? await prisma.savedPost.findUnique({
                  where: {
                      userId_postId: {
                          userId,
                          postId: id,
                      },
                  },
              })
            : null;

        res.status(200).json({
            ...post,
            isSaved: !!saved, // Boolean value
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get Post" });
    }
};


export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;  

    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId, 
                postDetail:{
                    create: body.postDetail,
                },
            },
        });
        res.status(200).json(newPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create post" });
    }
};


/*export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { postData } = req.body;  // Expecting postData to be an object with the post's updated fields

    if (!postData || Object.keys(postData).length === 0) {
        return res.status(400).json({ message: "No data provided to update the post." });
    }

    try {
        // Ensure the id is a number if necessary (for example, if it's being passed as a string)
        const postId = id; // You can parse the id if required (e.g., parseInt(id))

        // Fetch the post from the database
        const post = await prisma.post.findUnique({
            where: { id: postId },  // Prisma expects id to match the type defined in the schema (int or string)
        });

        // If the post does not exist, return a 404 error
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        // Log the incoming postData for debugging
        console.log("Incoming postData:", postData);

        // Proceed with the update operation if the post exists
        const updatedPost = await prisma.post.update({
            where: { id: postId },  // Ensure id is passed as a string or integer (based on your Prisma model)
            data: postData,  // Data object to update the post fields
        });

        // Return the updated post along with a success message
        res.status(200).json({ message: "Post updated successfully", updatedPost });

    } catch (err) {
        // Log the error for debugging
        console.error("Error updating post:", err);

        // Send a more descriptive error message
        res.status(500).json({ message: "Failed to update post. Please check your data and try again." });
    }
};*/
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { postData } = req.body;
    const tokenUserId = req.userId;

    if (!postData || Object.keys(postData).length === 0) {
        return res.status(400).json({ message: "No data provided to update the post." });
    }

    try {
        // Validate that the 'id' is a valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid post ID format." });
        }

        // Proceed with fetching the post
        const post = await prisma.post.findUnique({
            where: { id: id },  // Prisma expects a valid ObjectId
        });

        // If the post does not exist, return a 404 error
        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Not Authorized: You can only update your own posts." });
        }

        // Log the incoming postData for debugging
        console.log("Incoming postData:", postData);

        // Proceed with the update operation if the post exists
        const updatedPost = await prisma.post.update({
            where: { id: id },  // Ensure id is passed as a string or ObjectId (based on your Prisma model)
            data: postData,  // Data object to update the post fields
        });

        // Return the updated post along with a success message
        res.status(200).json({ message: "Post updated successfully", updatedPost });

    } catch (err) {
        // Log the error for debugging
        console.error("Error updating post:", err);

        // Send a more descriptive error message
        res.status(500).json({ message: "Failed to update post. Please check your data and try again." });
    }
};


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId; // Extracted from middleware
  
    try {
      // Find the post
      const post = await prisma.post.findUnique({
        where: { id },
      });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found!" });
      }
  
      // Check if the logged-in user is the owner
      if (post.userId !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized: You can only update your own posts." });
      }
  
      // Delete the post
      await prisma.post.delete({
        where: { id },
      });
  
      res.status(200).json({ message: "Post Successfully Deleted!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete post." });
    }
  };
  

// extra
export const savePost = async (req, res) => {
    const { postId } = req.body; // Assuming postId is passed in the request body
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Decode the token to get the logged-in user's ID
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Save the post for the logged-in user only
        const savedPost = await prisma.savedPost.upsert({
            where: {
                userId_postId: { userId, postId }, // Compound unique key
            },
            update: {}, // If the entry exists, do nothing
            create: { userId, postId }, // Otherwise, create the entry
        });

        res.status(200).json({ message: "Post saved successfully", savedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save post" });
    }
};

export const getSavedPosts = async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Decode the token to get the logged-in user's ID
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch only the saved posts for the logged-in user
        const savedPosts = await prisma.savedPost.findMany({
            where: { userId }, // Filter by logged-in user's ID
            include: {
                post: true, // Include post details if needed
            },
        });

        res.status(200).json(savedPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch saved posts" });
    }
};
