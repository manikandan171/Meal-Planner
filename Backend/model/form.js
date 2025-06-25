import mongoose from 'mongoose'; 

const FormSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    department:String
});

export const form = mongoose.model('forms', FormSchema);