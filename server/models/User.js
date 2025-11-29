const { Schema, model } = require('mongoose');

const schema = new Schema(
  {
    name: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String },
    about: String,
    completedMeetings: Number,
    image: String,
    rate: Number,
    sex: { type: String, enum: ['male', 'female', 'other'] },
    profession: { type: Schema.Types.ObjectId, ref: 'Profession' },
    qualities: [{ type: Schema.Types.ObjectId, ref: 'Quality' }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    likesCount: { type: Number, default: 0 },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', schema);
