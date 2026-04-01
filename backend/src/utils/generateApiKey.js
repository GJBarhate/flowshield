import { v4 as uuidv4 } from 'uuid';

export const generateApiKey = () => `fshield_${uuidv4().replace(/-/g, '')}`;
