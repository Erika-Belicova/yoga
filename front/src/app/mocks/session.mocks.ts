import { Session } from '../features/sessions/interfaces/session.interface';

export const mockSession: Session = {
  id: 1,
  name: 'Session',
  description: 'A session description',
  date: new Date(),
  teacher_id: 1,
  users: [1, 2],
  createdAt: new Date('2025-02-12T14:00:00'),
  updatedAt: new Date('2025-02-12T15:00:00')
};

export const mockSessions: Session[] = [
  {
    id: 1,
    name: 'Session 1',
    description: 'A session description 1',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date('2025-02-15T14:00:00'),
    updatedAt: new Date('2025-02-18T15:00:00')
  },
  {
    id: 2,
    name: 'Session 2',
    description: 'A session description 2',
    date: new Date(),
    teacher_id: 1,
    users: [3, 4],
    createdAt: new Date('2025-02-20T14:00:00'),
    updatedAt: new Date('2025-02-21T16:00:00')
  },
  {
    id: 3,
    name: 'Session 3',
    description: 'A session description 3',
    date: new Date(),
    teacher_id: 1,
    users: [5, 6],
    createdAt: new Date('2025-02-24T14:00:00'),
    updatedAt: new Date('2025-02-26T17:00:00')
  }
];

export const mockUpdatedSession: Session = {
  id: 1,
  name: 'Updated Session',
  description: 'Updated description',
  date: new Date(),
  teacher_id: 1,
  users: [1,2]
};