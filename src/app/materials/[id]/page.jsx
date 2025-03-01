export default function MaterialDetails({ params }) {
    const material = {
      id: params.id,
      title: "Introduction to Algorithms",
      description: "A comprehensive guide to algorithms, covering a wide range of topics.",
      condition: "Good",
      owner: "John Doe",
      contact: "john.doe@example.com",
    };
  
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{material.title}</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="text-gray-600 mb-4">{material.description}</p>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Condition:</strong> {material.condition}</p>
            <p className="text-gray-600"><strong>Owner:</strong> {material.owner}</p>
            <p className="text-gray-600"><strong>Contact:</strong> {material.contact}</p>
          </div>
        </div>
      </div>
    );
  }