import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const width = parseInt(formData.get('width') as string, 10);

    if (!file || !width) {
      return NextResponse.json({ error: 'Missing image or width.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resizedBuffer = await sharp(buffer)
      .resize({ width: width })
      .toBuffer();

    return new NextResponse(resizedBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.type,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error processing image.' }, { status: 500 });
  }
}
