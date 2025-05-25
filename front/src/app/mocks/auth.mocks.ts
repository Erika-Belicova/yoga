import { LoginRequest } from '../features/auth/interfaces/loginRequest.interface';
import { RegisterRequest } from '../features/auth/interfaces/registerRequest.interface';

export const mockRegisterRequest: RegisterRequest = { 
  email: 'claire@perret.com',
  firstName: 'Claire',
  lastName: 'Perret',
  password: 'password'
};

export const mockLoginRequest: LoginRequest = { 
  email: 'claire@perret.com',
  password: 'password'
};