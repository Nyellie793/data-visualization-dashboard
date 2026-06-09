import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <main className="bg-slate-50 min-h-screen pt-10">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
          Visualize Data & Math
          <span className="text-blue-600"> Instantly</span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          A smart visualization tool that transforms mathematical functions
          and raw datasets into interactive charts using Chart.js.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/function-plotter"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Plotting
          </Link>

          <Link
            to="/data-visualizer"
            className="border border-slate-300 px-6 py-3 rounded-lg hover:bg-white transition"
          >
            Upload Data
          </Link>
        </div>
      </section>

      {/* Small Description Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-2xl font-semibold text-slate-800">
          Built for Students, Developers & Researchers
        </h2>

        <p className="mt-4 text-slate-600">
          Whether you're exploring mathematical patterns or analyzing datasets,
          SmartViz helps you visualize insights faster and cleaner.
        </p>
      </section>

    </main>
  );
};

export default Dashboard;