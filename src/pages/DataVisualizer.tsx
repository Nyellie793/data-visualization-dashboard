import FileUploader from "../components/uploads/FileUploader";
import { Link } from "react-router-dom";

const DataVisualizer = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-3">
          Data Visualizer
        </h1>

        <p className="text-gray-600 mb-8">
          Upload a CSV or Excel file and generate
          interactive charts.
        </p>

        <FileUploader />

      </div>
    </div>
  );
};

export default DataVisualizer;