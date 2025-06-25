import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs'; // Required for file system access

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('images');
  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }
  const uploadDir = path.join(process.cwd(), 'public/assets/images');
  await fs.mkdir(uploadDir, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    if (!(file instanceof File)) continue;
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/assets/images/${filename}`);
  }
  return NextResponse.json({ urls });
} 