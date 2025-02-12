import jwt from 'jsonwebtoken';

export function generateJwtToken(user) {  
   
  if (!user.id || !user.accountType) {
    throw new Error("Data not provided");
  }

  const payload = {
     id:user.id,
     accountType:user.accountType,
  };

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not defined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  
  
  return token;
}