import { User } from '../interfaces/user.interface';

export const mockUser: User = {
  id: 1,
  email: 'anna@perret.com',
  lastName: 'Perret',
  firstName: 'Anna',
  admin: false,
  password: 'password',
  createdAt: new Date('2025-08-25T14:00:00'),
};