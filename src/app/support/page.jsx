export default function Support() {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Us</h1>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Bank Account Details</h2>
          <p className="text-gray-600">Account Name: Textbook Exchange</p>
          <p className="text-gray-600">Account Number: 1234567890</p>
          <p className="text-gray-600">Bank: Example Bank</p>
        </div>
        <form className="mt-6">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Tell us how you'd like to support us..."
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }