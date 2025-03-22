import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import FormPage from "./Pages/CreateFormPage/FormPage";
import ViewPage from "./Pages/ViewPage/ViewPage";
import Response from "./Pages/ResponsePage/Response";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/view/:formId" element={<ViewPage />} />
      <Route path="/edit/:formId" element={<FormPage />} />
      <Route path="/response/:formId" element={<Response />} />
    </Routes>
  );
}
