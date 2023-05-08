import checkUsername from "@/utils/checkUsername";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams: params } = new URL(req.url);
  
  if (!params || !params.get('username')) {
    return new Response('No username provided', { status: 400 })
  }
  
  const res = await checkUsername(params.get('username') as string)

  return NextResponse.json(res);
}