import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import TestCases from "@/components/pages/TestCases";
import Bugs from "@/components/pages/Bugs";
import Projects from "@/components/pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="test-cases" element={<TestCases />} />
            <Route path="bugs" element={<Bugs />} />
            <Route path="projects" element={<Projects />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;