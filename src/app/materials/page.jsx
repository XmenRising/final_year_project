import MaterialCard from '@/components/MaterialCard';

export default function Materials() {
  const materials = [
    { id: 1, title: 'Introduction to Algorithms', description: 'A comprehensive guide to algorithms.', condition: 'Good' },
    { id: 2, title: 'Clean Code', description: 'Best practices for writing clean code.', condition: 'Like New' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Materials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
}