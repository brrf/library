const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	comments: {
		type: [String],
		required: true,
		default: []
	}
}, {versionKey: false});

bookSchema.virtual('commentcount')
	.get(function() {
		return this.comments.length
	})

bookSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('book', bookSchema);