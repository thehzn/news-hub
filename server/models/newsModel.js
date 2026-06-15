const mongoose = require('mongoose');

const NewsPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
  type: String,
  enum: ['general', 'tech', 'business', 'lifestyle', 'entertainment'],
  default: 'general',
  required: true
},
// Add this field inside your NewsPostSchema definition:
imageUrl: {
  type: String,
  default: null
},
  status: {
    type: String,
    enum: ['draft', 'scheduled','in_review', 'published'], 
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    default: null 
  },
  scheduledFor: {
    type: Date,
    default: null,
    required: function() {
      return this.status === 'scheduled';
    }
  }
}, {
  timestamps: true 
});


NewsPostSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('News', NewsPostSchema);