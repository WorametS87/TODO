import axios from "../axiosInstance";
import { TodoItem } from "@/types/todo";


export const fetchTodos = async (): Promise<TodoItem[]> => {
    const res = await axios.get("/todo");
    return res.data;
};


export const createTodo = async (data: Partial<TodoItem>) => {
    return axios.post("/todo", data);
};