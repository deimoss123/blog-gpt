import db from "./db";

export default async function checkUsername(username: string) {
  const res = await db.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true
    }
  })
  
  return { isTaken: !!res }
}