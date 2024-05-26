const router = require("express").Router();
const { User, Thought } = require("../../models");


router.get("/", async (req,res) => {
    try{
        const dbThoughtData = await Thought.find().sort({ createdAt: -1})
        res.status(200).json(dbThoughtData);
    } catch(err) {
        res.status(500).json(err)
    }
        
})

router.post("/", async (req, res) => {
    try {
       const dbThoughtData = await Thought.create(req.body)
       const dbUserData=await User.findOneAndUpdate({
        username: req.body.username,
       },
       {
        $push: { thoughts: dbThoughtData._id}
       },
       {
        new: true
       }
    );
    if (!dbUserData) {
        return res.status(404).json({
            message: `Thought created but no user with this id!`
        })
    }
       res.status(200).json({dbThoughtData, message: `Thought successfully created`});
    } catch (err) {
       res.status(500).json(err);
    }
})

router.get("/:thoughtId", async (req, res) => {
try {
    const thought=await Thought.findById(req.params.thoughtId)
    if(!thought){return res.status(404).json("No thought find with that ID")}
    res.status(200).json(thought)
} catch (error) {
    res.status(500).json(error.message)
}
})

router.put("/:thoughtId", async (req, res) => {
    try {
        const thought=await Thought.findByIdAndUpdate(req.params.thoughtId,{$set:req.body},{runValidators:true,new:true})
        if(!thought){return res.status(404).json("No thought find with that ID")}
    res.status(200).json(thought)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.delete("/:thoughtId", async (req, res) => {
    try {
        const thought=await Thought.findOneAndDelete({_id:req.params.thoughtId})
        if(!thought){return res.status(404).json("No thought find with that ID")}
        const user=await User.findOneAndUpdate({username:thought.username},{$pull:{thoughts:thought._id}},{new:true})
        if(!user){return res.status(404).json("Thought deleted but no user found with that ID")}
    res.status(200).json("thought deleted")
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.post("/:thoughtId/reaction", async (req,res) => {
    try {
        const thought=await Thought.findByIdAndUpdate(req.params.thoughtId,{$push:{reactions:req.body}},{runValidators:true,new:true})
        if(!thought){return res.status(404).json("No thought find with that ID")}
        res.status(200).json(thought)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.delete("/:thoughtId/reactions/:reactionId", async (req,res) => {
    try {
        const thought=await Thought.findByIdAndUpdate(req.params.thoughtId,{$pull:{reactions:{reactionId:req.params.reactionId}}},{new:true})
    if(!thought){return res.status(404).json("No thought find with that ID")}
        res.status(200).json(thought)
    } catch (error) {
        res.status(500).json(error.message)
    }
    
})
module.exports = router;