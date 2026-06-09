import FunctionChart from "../components/charts/FunctionChart";
import { Link } from "react-router-dom";

const FunctionPlotter = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </Link>

      <FunctionChart />
    </div>
  );
};

export default FunctionPlotter;