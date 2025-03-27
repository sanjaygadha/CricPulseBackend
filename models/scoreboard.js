const mongoose = require('mongoose');

const BatsmanSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false }, // Changed from status enum to boolean
});

const BowlerSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  overs: { type: Number, default: 0 }, // Decimal for overs (e.g., 2.3)
  maidens: { type: Number, default: 0 }, // Changed from maidenOvers
  runs: { type: Number, default: 0 }, // Runs conceded
  wickets: { type: Number, default: 0 },
  economy: { type: Number, default: 0 },
});

const InningsSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  extras: {
    total: { type: Number, default: 0 },
    wides: { type: Number, default: 0 },
    noBalls: { type: Number, default: 0 },
    byes: { type: Number, default: 0 },
    legByes: { type: Number, default: 0 },
  },
  batsmen: [BatsmanSchema],
  bowlers: [BowlerSchema],
});

const MatchScoreboardSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  currentInnings: { type: Number, default: 1 }, // Tracks current innings (1 or 2)
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  totalOvers: { type: Number, required: true },
  innings: InningsSchema, // Current innings data
  matchComplete: { type: Boolean, default: false },
  firstInningsData: { type: InningsSchema,default: () => ({}) }, // First innings data (empty object by default)
  secondInningsData: { type: InningsSchema,default: () => ({})}, // Second innings data (empty object by default)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update `updatedAt`
MatchScoreboardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const MatchScoreboard = mongoose.model('MatchScoreboard', MatchScoreboardSchema);

module.exports = MatchScoreboard;
