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

        return res.status(200).json({
            message: "Subject added successfully",
            success : true,
            data : sub
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
        const {id} = req.params

        const deletedSubject = Subject.findByIdAndDelete(id);

        return res.status(200).json({
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

        //check teacher exist or not
        const teacher = await User.findOne({email:email});
        if(!teacher){
            return res.status(400).json({
                message : "Teacher not exist",
                success : false
            })
        }

        // Push teacher's ObjectId into teacherAssigned array
        const result = await Subject.findByIdAndUpdate(
            id,
            { $addToSet: { teacherAssigned: teacher._id } }, // Ensures unique entries
            { new: true }
        ).populate("teacherAssigned"); // Populate for better results

        return res.status(200).json({
            success : true,
            message : "Teacher assigned successfully",
            data : result
        })

    } catch (error) {
        console.log("Error while assigning subject : ", error);
        return res.status(400).json({
            success:false,
            message:"Subject not assigned",
        })
    }
}


export const fetchAssingedTeacher = async(req,res) => {
    try {
        const assignedTeacher = await Subject.find({ teacherAssigned: { $exists: true, $not: { $size: 0 } } }).populate("teacherAssigned");


        return res.status(200).json({
            message : "Assigned Teaher fetched successfully",
            success : true,
            data : assignedTeacher
        })
    } catch (error) {
        console.log("Error while fetching Assigned Teacher : ",error);
        return res.status(400).json({
            success:false,
            message:"Error while fetching Assigned Teacher",
        })
    }
}

export const removeAssignedTecher = async(req,res) => {
    try {
        const {id,email} = req.body;

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

        //check teacher exist or not
        const teacher = await User.findOne({email:email});
        if(!teacher){
            return res.status(400).json({
                message : "Teacher not fount",
                success : false
            })
        }
        const updatedSub = sub?.teacherAssigned?.filter(s => s._id.toString() !== teacher?._id.toString());

        // Remove teacher from subject
        const updateSub = await Subject.findByIdAndUpdate(
            sub._id,  // Ensure you're updating the correct subject ID
            { teacherAssigned: updatedSub }, 
            { new: true }
        );

        return res.status(200).json({
            message : "Assigned Teaher removed successfully",
            success : true,
        }) 


    } catch (error) {
        console.log("Error while removing Assigned Teacher : ",error);
        return res.status(400).json({
            success:false,
            message:"Error while removing Assigned Teacher",
        })
    }
}