import { registerUser, RegisterUserInput, TAGS } from "@ditch/lib";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const authData: RegisterUserInput = await req.json();

    const cartId = cookies().get("cartId")?.value;

    const { user, cart } = await registerUser({ ...authData }, cartId);

    cookies().set("userId", user.id);
    cookies().set("cartId", cart.id);

    revalidateTag(TAGS.CART);

    return NextResponse.json(
      { message: "User authenticated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 400 }
    );
  }
}
