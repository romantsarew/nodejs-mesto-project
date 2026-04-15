import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;
