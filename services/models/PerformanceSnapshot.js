const mongoose = require('mongoose');

const performanceSnapshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  portfolioValue: {
    type: Number,
    required: true,
    default: 0,
  },
});

const PerformanceSnapshot = mongoose.model('PerformanceSnapshot', performanceSnapshotSchema);

module.exports = PerformanceSnapshot;
