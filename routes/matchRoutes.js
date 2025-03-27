const express = require('express');
const router = express.Router();
const { createMatch, getMatches, createdByID, tournamentName, getMatchesByMatchId} = require('../controllers/matchController');
const authMiddleware = require('../middleware/auth');
const {selectPlayersByTeam}=require('../controllers/SelectPlayersByTeam')
const {updateMatch,deleteMatch}=require('../controllers/matchController');
const { scoreUpdate, scoreGet } = require('../controllers/scoreboardController');

// POST /api/matches - Create a new match (protected route)
router.post('/creatematch', authMiddleware, createMatch);


// GET /api/matches - Get all matches
router.get('/getmatch', getMatches);


//get matchess based on MatchId:
router.get('/:matchId',getMatchesByMatchId)


//Select players by team name
router.get("/selectPlayers/:teamName/:matchId", selectPlayersByTeam);


//Select matches based on CreatedById 
router.get('/createdBy/:createdById', createdByID);


//Getting matches based on tournament name
router.get('/match/:tournamentName', tournamentName );
  

// Update a match by matchID
router.put('/:matchId', updateMatch);


//UpdateScpreboard by mtachId
router.put('/:matchId/scoreboard', scoreUpdate)

// API to get scoreboard data
router.get('/:matchId/scoreboard', scoreGet)


// Delete a match by matchId
router.delete('/:matchId',authMiddleware,deleteMatch);




module.exports = router;