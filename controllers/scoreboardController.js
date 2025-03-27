// routes/scoreboardRoutes.js
const express = require('express');
const router = express.Router();
const Match = require("../models/Match");
const MatchScoreboard = require('../models/scoreboard');



// API to update scoreboard data
// const scoreUpdate= async (req, res) => {
//     try {
//       const { matchId } = req.params;
//       const {
//         currentInnings,
//         team1,
//         team2,
//         totalOvers,
//         innings,
//         matchComplete,
//         firstInningsData,
//       } = req.body;
  
//       const scoreboardData = {
//         matchId,
//         currentInnings,
//         team1,
//         team2,
//         totalOvers,
//         innings,
//         matchComplete,
//         firstInningsData,
//       };
  
//       const updatedScoreboard = await MatchScoreboard.findOneAndUpdate(
//         { matchId },
//         scoreboardData,
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
  
//       res.json({ message: 'Scoreboard updated successfully', data: updatedScoreboard });
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating scoreboard', error: error.message });
//     }
//   };

const scoreUpdate=async (req, res) => {
  try {
    const { matchId } = req.params;
    const updateData = req.body;

    const existingScoreboard = await MatchScoreboard.findOne({ matchId });

    if (!existingScoreboard) {
      const newScoreboard = new MatchScoreboard({
        ...updateData,
        firstInningsData: updateData.currentInnings === 1 ? updateData.innings : {},
        secondInningsData: updateData.currentInnings === 2 ? updateData.innings : {},
      });
      await newScoreboard.save();
      return res.status(201).json(newScoreboard);
    }

    // Update only the relevant innings
    const updatedScoreboard = await MatchScoreboard.findOneAndUpdate(
      { matchId },
      {
        $set: {
          ...updateData,
          ...(updateData.currentInnings === 1
            ? { firstInningsData: updateData.innings }
            : { secondInningsData: updateData.innings }),
        },
      },
      { new: true }
    );

    res.status(200).json(updatedScoreboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating scoreboard', error });
  }
};

// API to get scoreboard data
const scoreGet= async (req, res) => {
  try {
    const { matchId } = req.params;
    const scoreboard = await MatchScoreboard.findOne({ matchId });

    if (!scoreboard) {
      return res.status(404).json({
        success: false,
        message: 'Scoreboard not found',
      });
    }

    res.status(200).json({
      success: true,
      data: scoreboard,
    });
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scoreboard',
      error: error.message,
    });
  }
};

module.exports = {scoreUpdate, scoreGet}