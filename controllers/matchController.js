const { v4: uuidv4 } = require("uuid");
const express = require('express');
const Match = require("../models/Match");
const mongoose = require('mongoose');


// Create a new match
const createMatch = async (req, res) => {
  try {
    const matchData = req.body;

    // console.log("Incoming match data:", matchData); // Log the incoming payload

    // Validate that exactly two teams are provided
    if (!matchData.teams || matchData.teams.length !== 2) {
      return res.status(400).json({ message: "Exactly two teams are required" });
    }

    // Validate team logos
    for (const team of matchData.teams) {
      if (typeof team.teamLogo !== "string") {
        return res.status(400).json({ message: "Team logo must be a string (URL or base64)" });
      }
    }

    // Validate player types
    for (const team of matchData.teams) {
      for (const player of team.players) {
        if (!player.playerType) {
          return res.status(400).json({ message: "Player type is required for all players" });
        }
      }
    }

    // Generate a unique matchId
    matchData.matchId = uuidv4();

    // Set createdBy to the authenticated user's ID
    matchData.createdBy = req.user.id;

    // Save the match to the database
    const match = new Match(matchData);
    await match.save();

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      match: match,
    });
  } catch (err) {
    console.error("Error creating match:", err); // Log the error for debugging
    res.status(500).json({ success: false, error: "Server error" });
  }
};






// Get all matches
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//Get Matches Based On CreatedByID

const createdByID = async (req, res) => {
  try {
    const { createdById } = req.params;

    // Validate the createdById parameter
    if (!mongoose.Types.ObjectId.isValid(createdById)) {
      return res.status(400).json({ message: 'Invalid createdBy ID' });
    }

    // Create a new ObjectId instance
    const createdByObjectId = new mongoose.Types.ObjectId(createdById);

    // Fetch all matches created by the user
    const matches = await Match.find({ createdBy: createdByObjectId });

    // If no matches are found, return a 404 response
    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: 'No matches found for this user' });
    }

    // Return the matches
    res.status(200).json({ message: 'Matches fetched successfully', data: matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getMatchesByMatchId = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.status(200).json({ message: "Match fetched successfully", data: match });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch match", error: error.message });
  }
};


// GET /teams?tournamentName=Premier+League

const tournamentName=  async (req, res) => {
  const { tournamentName } = req.query;

  // if (!tournamentName) {
  //   return res.status(400).json({ message: 'Tournament name is required' });
  // }

  try {
    const teams = await Match.find({ tournamentName: tournamentName });
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





// Update a match
const updateMatch = async (req, res) => {
  try {
    const { matchId } = req.params; // Extract matchId from URL parameters
    const updateData = req.body; // Extract the updated data from the request body

    // Validate that updateData is provided
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    // Find the match by matchId and update it
    const match = await Match.findOneAndUpdate(
      { matchId }, // Find the match by matchId
      updateData, // Update with the provided data
      { new: true, runValidators: true } // Return the updated match and run schema validators
    );

    // Check if the match exists
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      match: match,
    });
  } catch (err) {
    console.error("Error updating match:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};






//DeleteMatch
const deleteMatch = async (req, res) => {
  try {
    const { matchId } = req.params; // Extract matchId from URL parameters

    // Find the match by matchId and delete it
    const match = await Match.findOneAndDelete({ matchId });

    // Check if the match exists
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
      match: match,
    });
  } catch (err) {
    console.error("Error deleting match:", err); // Log the error for debugging
    res.status(500).json({ success: false, error: "Server error" });
  }
};



module.exports = { createMatch, getMatches, updateMatch, deleteMatch , createdByID, tournamentName,getMatchesByMatchId};
