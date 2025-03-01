import BookCard from '@/components/BookCard';

async function getBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
  return res.json();
}

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}