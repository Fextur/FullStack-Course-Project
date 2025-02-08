import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/:email', getUser);
router.put('/:email', updateUser);
router.delete('/:email', deleteUser);

export default router;
