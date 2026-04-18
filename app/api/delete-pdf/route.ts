import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, id, bucket } = await request.json();

    if (!token || !id || !bucket) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const objectPath = encodeURIComponent(`newsletters/${id}.pdf`);

    // Delete directly via Firebase Storage REST API to bypass Browser CORS restrictions
    const deleteResponse = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${objectPath}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const errBody = await deleteResponse.text();
      throw new Error(`Firebase Storage REST error: ${deleteResponse.status} ${errBody}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
