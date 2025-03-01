// src/components/MaterialCard.jsx
export default function MaterialCard({ material }) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800">{material.title}</h3>
        <p className="text-gray-600">{material.description}</p>
        <p className="text-sm text-gray-500">Condition: {material.condition}</p>
      </div>
    );
  }