
// const express = require('express');
// const router = express.Router();
// const MatchScoreboard = require('../models/MatchScoreboard');

// // API to update scoreboard data
// router.post('/update/:matchId', async (req, res) => {
//   try {
//     const { matchId } = req.params;
//     const {
//       currentInnings,
//       team1,
//       team2,
//       totalOvers,
//       innings, // Current innings data from frontend
//       batsmen,
//       bowlers,
//       matchComplete,
//       firstInningsData, // If innings 1 is complete
//     } = req.body;

//     // Prepare the update object
//     const updateData = {
//       matchId,
//       matchName: `${team1} vs ${team2}`, // Dynamic match name
//       team1,
//       team2,
//       totalOvers,
//       status: matchComplete ? 'Completed' : 'In Progress',
//     };

//     // Structure innings data
//     const inningsData = {
//       team: currentInnings === 1 ? team1 : team2,
//       score: innings.score,
//       wickets: innings.wickets,
//       overs: innings.overs,
//       extras: {
//         total: innings.extras,
//         wides: innings.wides,
//         noBalls: innings.noBalls,
//         byes: innings.byes,
//         legByes: innings.legByes,
//       },
//       batsmen,
//       bowlers,
//     };

//     // Assign to appropriate innings
//     if (currentInnings === 1) {
//       updateData.innings1 = inningsData;
//       if (firstInningsData) {
//         updateData.innings1 = firstInningsData; // Use completed first innings if provided
//       }
//     } else if (currentInnings === 2) {
//       updateData.innings2 = inningsData;
//       if (firstInningsData) {
//         updateData.innings1 = firstInningsData; // Ensure first innings is preserved
//       }
//       // Calculate result if match is complete
//       if (matchComplete) {
//         const firstScore = firstInningsData.score;
//         const secondScore = innings.score;
//         if (firstScore > secondScore) {
//           updateData.result = `${team1} won by ${firstScore - secondScore} runs`;
//         } else if (secondScore >= firstScore) {
//           updateData.result = `${team2} won by ${10 - innings.wickets} wickets`;
//         } else {
//           updateData.result = 'Match tied';
//         }
//       }
//     }

//     const scoreboard = await MatchScoreboard.findOneAndUpdate(
//       { matchId },
//       updateData,
//       { upsert: true, new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Scoreboard updated successfully',
//       data: scoreboard,
//     });
//   } catch (error) {
//     console.error('Error updating scoreboard:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update scoreboard',
//       error: error.message,
//     });
//   }
// });

// // API to get scoreboard data
// router.get('/:matchId', async (req, res) => {
//   try {
//     const { matchId } = req.params;
//     const scoreboard = await MatchScoreboard.findOne({ matchId });

//     if (!scoreboard) {
//       return res.status(404).json({
//         success: false,
//         message: 'Scoreboard not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: scoreboard,
//     });
//   } catch (error) {
//     console.error('Error fetching scoreboard:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch scoreboard',
//       error: error.message,
//     });
//   }
// });

// module.exports = router;