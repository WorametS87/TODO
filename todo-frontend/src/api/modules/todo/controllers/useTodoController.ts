import { useEffect, useState } from "react";
import { fetchTodos, createTodo } from "../services/todo.service";
import { TodoItem } from "@/types/todo";


export const useTodoController = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);


    const loadTodos = async () => {
        const data = await fetchTodos();
        setTodos(data);
    };


    const addTodo = async (newTodo: Partial<TodoItem>) => {
        await createTodo(newTodo);
        loadTodos();
    };


    useEffect(() => {
        loadTodos();
    }, []);


    return { todos, addTodo };
};