import Subject from "../../models/subject.js";
import User from "../../models/user.js";

export const addSubject = async(req,res) => {
    try {
        const {name,code,semester} = req.body;
        
        if(!name || !code || !semester){
            return res.status(400).json({
                message : "All fields required",
                success : false
            })
        }

        const sub = await Subject.create({
            name,
            code,
            semester
        })

        const allSub = await Subject.find();

        return res.status(200).json({
            message: "Subject added successfully",
            success : true,
            data : allSub
        })
    } catch (error) {
        console.log("Error while adding subject : ", error);
        return res.status(400).json({
            success:false,
            message:"Subject not added",
        })
    }
}

export const fetchSubjectListForAdmin = async(req,res) => {
    try {
        const subjects = await Subject.find();
        
        return res.status(200).json({
            message : "Subject feyched successfully",
            success : true,
            data : subjects
        })
    } catch (error) {
        console.log("Error while fetching subjects : ", error);
        return res.status(400).json({
            message : "Error while fetching Subjects",
            success : false
        })
    }
}

export const deleteSubject = async(req,res) => {
    try {
        const {id} = req.params;
        
        if(!id){
            return res.status(400).json({
                message : "All fields required",
                success : false
            })
        }

        //check subject exist or not
        const sub = await Subject.findOne({_id:id});
        if(!sub){
            return res.status(400).json({
                message : "Subject not fount",
                success : false
            })
        }

        //delete subject
        await Subject.findOneAndDelete({_id:id});

        //get all subjects
        const subjects = await Subject.find();

        return res.status(200).json({
            subjects,
            message : "Subject deleted successfully",
            success : true,
        }) 
    } catch (error) {
        console.log("Error while deleting subjects : ", error);
        return res.status(400).json({
            message : "Error while deleting Subjects",
            success : false
        })
    }

}

export const updateSubject = async(req,res) => {
    try {
        const {name,code,semester,id} = req.body;
        
        if(!name || !code || !semester){
            return res.status(400).json({
                message : "All fields required",
                success : false
            })
        }

        const sub = await Subject.findByIdAndUpdate(id, {name,code,semester,id})

        return res.status(200).json({
            message: "Subject Updated successfully",
            success : true,
            data : sub
        })
    } catch (error) {
        console.log("Error while updating subject : ", error);
        return res.status(400).json({
            success:false,
            message:"Subject not updated",
        })
    }
}

export const assignTeacherToSubject = async(req,res) => {
    try {
        const {id,email} = req.body
        
        if(!id || !email){
            return res.status(400).json({
                message : "All fields required",
                success : false
            })
        }

        const teacherDetails = await User.findOne({email:email});

        if(!teacherDetails){
            return res.status(404).json({
                message : "No teacher found",
                success : false
            })
        }

        
        //check whether the teacher is already assgined to the subject or not
        const checkAssignment = await Subject.findOne({
            teacherAssigned: { $in: [teacherDetails?._id] },
        })

        if(checkAssignment){
            return res.status(400).json({
                message : "Same teacher cannot be assigned",
                success : false
            })
        }
        // Push teacher's ObjectId into teacherAssigned array
        const result =await Subject.findByIdAndUpdate(
            id,
            { $push: { teacherAssigned: req.user.id } }, // Ensures unique entries
            { new: true }
        )
        
        const subjects = await Subject.find({
            teacherAssigned: { $exists: true, $ne: [] },
        })
            .populate({
                path: "teacherAssigned",
                ref: "User",
                select: "name email _id",
            })
            .exec();

        // Extract and flatten teachers while adding subjectId to each entry
        const AllAssignedTeacher = subjects.flatMap((sub) =>
            sub.teacherAssigned.map((teacher) => ({
                ...teacher.toObject(), // Convert Mongoose document to plain object
                subjectId: sub._id, // Add subjectId to each teacher
            }))
        );

        // console.log(AllAssignedTeacher);

        return res.status(200).json({
            message: "Subject assigned successfully",
            success : true,
            data : AllAssignedTeacher
        })

    } catch (error) {
        console.log("Error while assigning subject : ", error);
        return res.status(400).json({
            success:false,
            message:"Subject not assigned",
        })
    }
}


export const fetchAssingedTeacher  = async (req, res) => {
    try {
        // Find subjects with at least one assigned teacher
        const subjects = await Subject.find({
            teacherAssigned: { $exists: true, $ne: [] },
        })
            .populate({
                path: "teacherAssigned",
                ref: "User",
                select: "name email _id",
            })
            .exec();

        // Extract and flatten teachers while adding subjectId to each entry
        const AllAssignedTeacher = subjects.flatMap((sub) =>
            sub.teacherAssigned.map((teacher) => ({
                ...teacher.toObject(), // Convert Mongoose document to plain object
                subjectId: sub._id, // Add subjectId to each teacher
            }))
        );

        // console.log(AllAssignedTeacher);
        

        return res.status(200).json({
            message: "Assigned Teachers fetched successfully",
            success: true,
            data: AllAssignedTeacher,
        });
    } catch (error) {
        console.log("Error while fetching Assigned Teachers:", error);
        return res.status(400).json({
            success: false,
            message: "Error while fetching Assigned Teachers",
        });
    }
};


export const removeAssignedTecher = async(req,res) => {
    try {
        const {id,email} = req.body;
        // console.log(id,email);
        
        if(!id || !email){
            return res.status(400).json({
                message : "All fields required",
                success : false
            })
        }
        // console.log(id,email);
        
        //check subject exist or not
        const sub = await Subject.findOne({_id:id});
        if(!sub){
            return res.status(400).json({
                message : "Subject not fount",
                success : false
            })
        }
        // console.log("subject",sub);
        
        //check teacher exist or not
        const teacher = await User.findOne({email:email});
        if(!teacher || teacher?.accountType !== "teacher"){
            return res.status(400).json({
                message : "Teacher not found",
                success : false
            })
        }
        const updatedSub = sub?.teacherAssigned?.filter(s => s._id.toString() !== teacher?._id.toString());
        // console.log(updatedSub);
        
        // Remove teacher from subject
        await Subject.findByIdAndUpdate(
            sub._id,  // Ensure you're updating the correct subject ID
            { teacherAssigned: updatedSub }, 
            { new: true }
        );

        // Find subjects with at least one assigned teacher
        const subjects = await Subject.find({
            teacherAssigned: { $exists: true, $ne: [] },
        })
            .populate({
                path: "teacherAssigned",
                ref: "User",
                select: "name email _id",
            })
            .exec();

         // Extract and flatten teachers while adding subjectId to each entry
         const AllAssignedTeacher = subjects.flatMap((sub) =>
            sub.teacherAssigned.map((teacher) => ({
                ...teacher.toObject(), // Convert Mongoose document to plain object
                subjectId: sub._id, // Add subjectId to each teacher
            }))
        );

        // console.log(AllAssignedTeacher);
        

        return res.status(200).json({
            message: "Assigned Teachers removed successfully",
            success: true,
            data: AllAssignedTeacher,
        });


    } catch (error) {
        console.log("Error while removing Assigned Teacher : ",error);
        return res.status(400).json({
            success:false,
            message:"Error while removing Assigned Teacher",
        })
    }
}


//get teacher email suggestion
export const suggestTeacherEmail = async(req,res) => {
    try {
        const {query} = req.body;

        if(!query){
            return res.status(400).json({
                message : "Query required",
                success : false
            })
        }
        // console.log(query);
        
        //add condition that it will retrive the email of teachers only
        const suggestions = await User.find({
            email: { $regex: `^${query}`, $options: 'i' },
            accountType: "teacher" // Ensure only teachers are fetched
          }).limit(5); // Limit to top 5 suggestions
        
        console.log(suggestions);
        return res.status(200).json({
            message : "Suggestions fetched successfully",
            success : true,
            data : suggestions
        })
    } catch (error) {
        console.log("Error while removing Assigned Teacher : ",error);
        return res.status(400).json({
            success:false,
            message:"Error while removing Assigned Teacher",
        })
    }
}