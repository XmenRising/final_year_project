export default function Campaigns() {
    const campaigns = [
      {
        id: 1,
        title: "Back-to-School Drive",
        description: "We collected over 500 textbooks for students in need.",
        image: "/images/campaign1.jpg", // Replace with actual image path
      },
      {
        id: 2,
        title: "Community Book Swap",
        description: "A successful event where students exchanged over 300 books.",
        image: "/images/campaign2.jpg", // Replace with actual image path
      },
    ];
  
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Campaigns and Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{campaign.title}</h2>
                <p className="text-gray-600">{campaign.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }