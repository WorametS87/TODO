import { TodoItem } from "@/types/todo";


export const TodoCard = ({ todo }: { todo: TodoItem }) => (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
        <h3>{todo.title}</h3>
        <p>{todo.description}</p>
    </div>
);