import express from 'express';
import { validateTeamFinder } from '../middleware/validation.js';
import { matchTeam } from '../services/difyService.js';

const router = express.Router();

router.post('/', validateTeamFinder, async (req, res, next) => {
  try {
    const { projectIdea, requiredSkills, preferredRoles, availability } = req.body;

    const result = await matchTeam({
      projectIdea,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? [requiredSkills] : []),
      preferredRoles: Array.isArray(preferredRoles) ? preferredRoles : (preferredRoles ? [preferredRoles] : []),
      availability,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
