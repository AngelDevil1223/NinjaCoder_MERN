import { v4 as uuidv4 } from 'uuid';
import { LOGIN_ACTION } from './types';

export const loginAction = ({ name }) => ({
   type: LOGIN_ACTION,
   payload: {
      id: uuidv4(),
      name
   }
});
