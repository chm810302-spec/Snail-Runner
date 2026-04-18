import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const token = formData.get('token') as string;
    const id = formData.get('id') as string;
    const bucket = formData.get('bucket') as string;

    if (!file || !token || !id || !bucket) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const objectPath = encodeURIComponent(`newsletters/${id}.pdf`);
    const arrayBuffer = await file.arrayBuffer();

    // Upload directly via Firebase Storage REST API to bypass Browser CORS restrictions
    const uploadResponse = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${objectPath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'application/pdf',
      },
      body: arrayBuffer,
    });

    if (!uploadResponse.ok) {
      const errBody = await uploadResponse.text();
      if (uploadResponse.status === 404) {
        throw new Error(`Firebase Storage bucket not found (404). Please go to Firebase Console > left menu > Storage, and click 'Get Started' to initialize the storage bucket.`);
      }
      throw new Error(`Firebase Storage REST error: ${uploadResponse.status} ${errBody}`);
    }

    // Construct the public download URL. Using alt=media acts identically to getDownloadURL()
    const pdfUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${objectPath}?alt=media`;

    return NextResponse.json({ pdfUrl });
  } catch (error: any) {
    console.error("Upload proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
