const Match = require("../models/Match");

exports.selectPlayersByTeam = async (req, res) => {
  try {
    const { teamName, matchId } = req.params; // Extract teamName & matchId from params

    if (!matchId || !teamName) {
      return res.status(400).json({ error: "Match ID and Team Name are required" });
    }

    // Find the match using matchId
    const match = await Match.findOne({ matchId });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Find the specific team
    const team = match.teams.find(t => t.name.toLowerCase() === teamName.toLowerCase());

    if (!team) {
      return res.status(404).json({ error: "Team not found in this match" });
    }

    // Extract players from the selected team
    const players = team.players.map(player => ({
      name: player.name,
      playerType: player.playerType,
      tag: player.tag
    }));

    res.json({
      matchId: match.matchId,
      teamName: team.name,
      players
    });

  } catch (error) {
    console.error("Error fetching team players:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
