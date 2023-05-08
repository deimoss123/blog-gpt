import checkUsername from "@/utils/checkUsername";
import db from "@/utils/db";
import getCurrentUser from "@/utils/getCurrentUser";
import validateUsername from "@/utils/validateUsername";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { session, currentUser } = await getCurrentUser()
  const body = await req.json();
  const { newUsername } = body;
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!body || !newUsername || !validateUsername(newUsername).valid) {
    return new Response('Invalid username', { status: 400 });
  }
  
  const { isTaken } = await checkUsername(newUsername)
  
  if (isTaken) {
    return new Response('Username taken', { status: 400 })
  }
  
  await db.user.update({
    where: {
      id: currentUser?.id
    },
    data: {
      username: newUsername
    }
  })
  
  return NextResponse.json({ message: 'Successfully changed username'})
}