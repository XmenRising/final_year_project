export default function Profile() {
    const user = {
      name: "John Doe",
      email: "john.doe@example.com",
      materialsListed: [
        { id: 1, title: "Introduction to Algorithms", condition: "Good" },
        { id: 2, title: "Clean Code", condition: "Like New" },
      ],
    };
  
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Listed Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.materialsListed.map((material) => (
              <div key={material.id} className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
                <p className="text-gray-600">Condition: {material.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }