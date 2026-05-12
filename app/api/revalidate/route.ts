import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * On-Demand Revalidation Endpoint for Sanity CMS.
 * Triggered by Sanity Webhook when a document is published or updated.
 * 
 * Requires SANITY_REVALIDATE_SECRET in environment variables.
 */
export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      const message = "Invalid signature";
      console.warn(message);
      return new NextResponse(message, { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse("Bad Request: Missing _type", { status: 400 });
    }

    // Revalidate by document type tag
    console.log(`[Webhook] Revalidating tag: ${body._type} (ID: ${body._id || "unknown"})`);
    
    // Trigger revalidation
    revalidateTag(body._type, "max");
    
    console.log(`[Webhook] Successfully triggered revalidation for tag: ${body._type}`);

    return NextResponse.json({ 
      revalidated: true, 
      tag: body._type,
      now: Date.now() 
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return new NextResponse("Error revalidating", { status: 500 });
  }
}
