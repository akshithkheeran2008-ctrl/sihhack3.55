import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/orca/Navbar";
import Hero from "./components/orca/Hero";
import CoastalMap from "./components/orca/CoastalMap";
import Modules from "./components/orca/Modules";
import AlertCentre from "./components/orca/AlertCentre";
import Fisherman from "./components/orca/Fisherman";
import CitizenReports from "./components/orca/CitizenReports";
import Reasoning from "./components/orca/Reasoning";
import Collaboration from "./components/orca/Collaboration";
import Footer from "./components/orca/Footer";
import { ProjectInformation } from "./components/orca/ProjectInformation";
import { Toaster } from "./components/ui/toaster";

const Home = () => (
  <div id="top" className="App">
    <Navbar />
    <Hero />
    <CoastalMap />
    <Modules />
    <AlertCentre />
    <Fisherman />
    <CitizenReports />
    <Reasoning />
    <Collaboration />
    <ProjectInformation />
    <Footer />
    <Toaster />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
