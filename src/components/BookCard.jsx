import Link from 'next/link';

export default function BookCard({ book }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <img
        src={book.images[0]}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{book.title}</h3>
        <p className="text-gray-600">{book.author}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className={`badge ${book.status === 'available' ? 'bg-green-500' : 'bg-gray-500'} text-white px-2 py-1 rounded`}>
            {book.status}
          </span>
          <Link href={`/books/${book._id}`} className="text-blue-600 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}