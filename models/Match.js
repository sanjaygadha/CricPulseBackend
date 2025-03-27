
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String },
  playerType: { type: String, enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'], required: true },
  tag: { type: String, enum: ['captain', 'vice-captain', 'player'], default: 'player' },

  // Player Status Object
  status: {
    // Batting stats
    runs: { type: Number, default: 0 },
    sixes: { type: Number, default: 0 },
    fours: { type: Number, default: 0 },
    strikeRate: { type: Number, default: 0 },
    isPlaying: { type: Boolean, default: false },
    isOut: { type: Boolean, default: false },

    // Bowling stats
    wickts: { type: Number, default: 0 },
    wide: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
    givenRuns: { type: Number, default: 0 },
  },
});

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teamLogo: String,
  teamScore:{type:Number},
  players: [PlayerSchema],
});

const MatchSchema = new mongoose.Schema({
  matchId: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  tournamentName:{type:String,required:true, default: null},
  groundName: { type: String, required: true },
  teams: [TeamSchema],
  tossWonBy: String,
  tossDecision: { type: String, enum: ['bat', 'bowl'], required: true },
  matchTime: Date,
  totalOvers: { type: Number, required: true },
  remainingOvers: { type: Number, required: true, default: 0 },
  totalplayers: Number,
  firstInningsEnd:{ type: Boolean, default: false },
  secondInningsStart:{type:Boolean,default:false},
  matchEnd:{ type: Boolean, default: false },
  totalScore:{type:Number}
});

module.exports = mongoose.model('Match', MatchSchema);










