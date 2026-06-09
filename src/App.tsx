import {  Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import FunctionPlotter from "./pages/FunctionPlotter";
import DataVisualizer from "./pages/DataVisualizer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/function-plotter"
          element={<FunctionPlotter />}/>
        <Route
          path="/data-visualizer"
          element={<DataVisualizer />}/>
      </Routes>
    </>
  );
};

export default App;