import dbConnect from '@/lib/dbConnect';
import Book from '@/models/Book';

export async function GET() {
  await dbConnect();
  const books = await Book.find({ status: 'available' }).populate('owner');
  return new Response(JSON.stringify(books));
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const newBook = await Book.create(data);
  return new Response(JSON.stringify(newBook), { status: 201 });
}