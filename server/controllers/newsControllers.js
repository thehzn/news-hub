const News= require("../models/newsModel");

exports.getPublicFeed=async(req,res)=>{
    try{
        const {category} =req.query;
        let query={status:'published'};

        if(category){
            query.category=category;

        }

        const publicPosts= await News.find(query)
        .select('title content imageUrl category publishedAt')
        .sort({publishedAt:-1});

        res.status(200).json({
            success:true,
            message:"posts fteched successfully",
            publicPosts,
        });
    }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicFeedPostById=async(req,res)=>{
    try{
        const {id}=req.params;
        
        const post = await News.findOne({_id:id,status:'published'});
        
        if(!post){
            return res.status(404).json({ message: "Article not found or not yet available" });
        }
         res.status(200).json({
            success:true,
            message:"post fteched successfully",
            post,
        });
    }catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getPostById=async(req,res)=>{
    try{
        const {id}=req.params;
        
        const post = await News.findOne({_id:id});
        
        if(!post){
            return res.status(404).json({ message: "Article not found" });
        }
         res.status(200).json({
            success:true,
            message:"post fteched successfully",
            post,
        });
    }catch (error) {
    res.status(500).json({ error: error.message });
    console.log("ERROR NAME:", error.name);      // ← add
  console.log("ERROR MESSAGE:", error.message);

  }
};

exports.createPost=async(req,res)=>{
    try{
        const {title,content,imageUrl,status,category}=req.body;
         console.log("REQ BODY:", req.body);
        const authorId=req.userId;
        console.log('req.id',authorId);
        if (!title || !content || !category) {
      return res.status(400).json({ 
        message: `Validation Failed: Missing required fields. Received Title: "${title}", Category: "${category}"` 
      });
    }
        
        if (!authorId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found in session" });
    }
      let publishedAt=null;
      if(status=='published'){
        publishedAt=new Date();

      }
      const newPost = new News({
        title,
      content,
      status,
      category,
      imageUrl, publishedAt,
      author: authorId
      });
      await newPost.save();
      res.status(201).json({ success:true,message: "Post created successfully", post: newPost });
    }
    catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
    console.log("ERROR NAME:", error.name);      // ← add
  console.log("ERROR MESSAGE:", error.message); 
  }
};


// update-post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, imageUrl, status, scheduledFor } = req.body;

  
    let updateData = { title, content, category, imageUrl };

    if (status) {
      updateData.status = status;

      if (status === 'scheduled') {
  
        updateData.scheduledFor = scheduledFor; 
        updateData.publishedAt = null; 
        
      } else if (status === 'published') {
        updateData.publishedAt = new Date(); 
        updateData.scheduledFor = null;    
        
      } else {
    
        updateData.publishedAt = null;
        updateData.scheduledFor = null;
      }
    }

    const updatedPost = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } 
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.log("ERROR NAME:", error.name);      // ← add
  console.log("ERROR MESSAGE:", error.message);

    res.status(400).json({ message: "Update failed", error: error.message });
  }
};


exports.getPosts=async(req,res)=>{
    try{
        const id=req.userId;
        if (!id) {
      return res.status(401).json({ success: false, message: "Unauthorized dashboard access" });
    }
    const { tab } = req.query;
    let filter = { author: id };
    if (tab && tab !== "all") {
  filter.status = tab;  
}

        const posts=await News.find(filter)
        .select("title status category views createdAt updatedAt")
        .sort({updatedAt:-1});

        res.json({
            success:true,
            posts
        })
    } catch (error) {
    res.status(500).json({ message: "fetching posts failed", error: error.message });
  }
}


exports.deletePost=async(req,res)=>{
    try{
         const adminId=req.userId;
        if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized dashboard access" });
    }
        const {id}=req.params;
        const deletedpost = await News.findById(id);
        if(!deletedpost){
             return res.status(404).json({ message: "Post not found" }); 
        } 
        await deletedpost.deleteOne();
        res.status(200).json({
            success:true,
            message:"post deleted successfully",
            
        });
    }
    catch (error) {
    res.status(400).json({ message: "deleting posts failed", error: error.message });
     console.log("ERROR NAME:", error.name);      // ← add
  console.log("ERROR MESSAGE:", error.message); 
  }
}




