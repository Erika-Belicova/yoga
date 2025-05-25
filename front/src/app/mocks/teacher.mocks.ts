import { Teacher } from '../interfaces/teacher.interface';

export const mockTeacher: Teacher = {
  id: 1,
  lastName: 'Anna',
  firstName: 'Perret',
  createdAt: new Date('2025-01-25T14:00:00'),
  updatedAt: new Date('2025-01-26T15:00:00')
};

export const mockTeachers: Teacher[] = [
  {
    id: 1,
    lastName: 'Jean',
    firstName: 'Dupont',
    createdAt: new Date('2025-01-25T14:00:00'),
    updatedAt: new Date('2025-01-26T15:00:00')
  },
  {
    id: 2,
    lastName: 'Thomas',
    firstName: 'Martin',
    createdAt: new Date('2025-01-25T14:00:00'),
    updatedAt: new Date('2025-01-27T16:00:00')
  },
  {
    id: 3,
    lastName: 'Claire',
    firstName: 'Beaumont',
    createdAt: new Date('2025-01-25T14:00:00'),
    updatedAt: new Date('2025-01-28T17:00:00')
  }
];