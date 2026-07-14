import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { postId, content, guestName, guestEmail } = await req.json();
    const session = await auth();

    if (!postId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const data: any = {
      content,
      postId,
      status: "APPROVED", // Auto-approve all comments as requested
    };

    if (session?.user) {
      data.authorId = (session.user as any).id;
    } else {
      if (!guestName || !guestEmail) {
        return NextResponse.json({ error: "Missing guest info" }, { status: 400 });
      }
      data.guestName = guestName;
      data.guestEmail = guestEmail;
    }

    const comment = await prisma.comment.create({ data });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Comment Error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
