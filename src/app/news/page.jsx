export default function News() {
    const newsItems = [
      {
        id: 1,
        title: "New Feature: Material Requests",
        description: "Users can now request specific materials they need.",
        date: "October 10, 2023",
      },
      {
        id: 2,
        title: "Upcoming Book Drive",
        description: "Join us on November 15th for our annual book drive.",
        date: "October 5, 2023",
      },
    ];
  
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">News and Updates</h1>
        <div className="space-y-6">
          {newsItems.map((news) => (
            <div key={news.id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h2>
              <p className="text-gray-600 mb-2">{news.description}</p>
              <p className="text-sm text-gray-500">{news.date}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }