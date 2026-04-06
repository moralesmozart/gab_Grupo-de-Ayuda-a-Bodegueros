import { Route, Routes } from "react-router-dom";
import BookReservaPage from "./components/BookReservaPage";
import HomePage from "./components/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reserva" element={<BookReservaPage />} />
    </Routes>
  );
}
