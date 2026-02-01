import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TodoPage } from "@/modules/todo/pages/TodoPage";


export const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<TodoPage />} />
        </Routes>
    </Router>
);