

const router = require("express").Router();

const { User, Thought } = require("../../models");


router.get("/", async (req,res) => {
    try {
    const dbUserData = await User.find().select("-__v")
    res.status(200).json(dbUserData);
} catch (err) {
    res.status(500).json(err)
}
});

router.post("/", async (req, res) => {


    try{
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);

    } catch(err) {
        res.status(500).json(err)
    }
    
});

router.get("/:userId", async(req,res) => {
    try {
        const dbUserData = await User.findOne({ _id: req.params.userId }).populate("friends").populate("thoughts")
        if(!dbUserData){
            return res.status(404).json({ message: "No user with this ID!"})
        }
        res.status(200).json(dbUserData);
    } catch(err)  {
        res.status(500).json(err)
    }
})

router.put("/:userId", async (req, res) =>{
    try {
        const dbUserData = await User.findOneAndUpdate(
            {
                _id: req.params.userId,
          },
          {
            $set: req.body,
          },
          {
            runValidators: true,
            new: true,
          }

        );
        if(!dbUserData){
            return res.status(404).json({ Message: "No user with this ID"})
        }
        res.status(200).json(dbUserData)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.delete("/:userId", async (req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId})
        if(!dbUserData) {
            return res.status(404).json({ message: "No user with this ID!"})
        }
        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts }});
        res.status(200).json({message: "User and associated thoughts deleted"})
    }catch (err) {
        res.status(500).json(err)
    }

})



router.post("/:userId/friends/:friendId", async (req,res) => {
    try {
        const dbUserData =await User.findOneAndUpdate( { _id: req.params.userId }, {
            $addToSet: { friends: req.params.friendId },
        },
        {
            new: true
        }
     );
     if(!dbUserData){
        return res.status(404).json({ message: `No user with this ID`})
     }
     res.status(200).json(dbUserData);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.delete("/:userId/friends/:friendId", async(req,res) => {
    try {
        const dbUserData =await User.findOneAndUpdate( {_id: req.params.userId}, { $pull: { friends: req.params.friendId }}, { new: true});
    

if (!dbUserData) {
    return res.status(404).json({ message: `No user with this ID`})
}
res.status(200).json(dbUserData)
} catch (err) {
    res.status(500).json(err)
}




});
module.exports = router;