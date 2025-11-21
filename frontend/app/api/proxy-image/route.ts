// /app/api/proxy-image/route.ts

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return new Response("Missing url param", { status: 400 });
    }

    // Fetch ảnh thật từ URL gốc
    const res = await fetch(url, {
      headers: {
        // Bỏ user-agent bot để tránh bị chặn
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch image", { status: 500 });
    }

    const contentType = res.headers.get("Content-Type") || "image/jpeg";
    const buffer = Buffer.from(await res.arrayBuffer());

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Proxy error", { status: 500 });
  }
}
