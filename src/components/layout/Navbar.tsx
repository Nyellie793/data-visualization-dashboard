import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <NavLink 
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-600 hover:text-blue-600"}> SmartViz</NavLink>

        <div className="flex gap-6 text-slate-700 font-medium">
        <NavLink 
          to="/function-plotter"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-600 hover:text-blue-600"}> Function Plotter</NavLink>

<NavLink 
          to="/data-visualizer"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-bold"
              : "text-gray-600 hover:text-blue-600"}>Data Visualizer</NavLink>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;