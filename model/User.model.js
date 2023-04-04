const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const User = mongoose.model('User', userSchema);

// const profileSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         unique: true
//     }
// })

// const Profile = mongoose.model('Profile', profileSchema);

module.exports = {
    User,
    // Profile
}