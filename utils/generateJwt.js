import jwt from 'jsonwebtoken'
export async function generateJwtToken(user){
  if(!user._id||!user.accountTpe){
    return res.status(400).json('data not provide')
  }
const payload ={
  id:user._id,
  role:user.role
}
  const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'})
  return token;
}