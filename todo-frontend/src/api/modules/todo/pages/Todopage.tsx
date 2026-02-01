import { useTodoController } from "../controllers/useTodoController";
import { TodoCard } from "../components/TodoCard";

export const TodoPage = () => {
    const { todos } = useTodoController();


    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1>TODO List</h1>
            {todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
            ))}
        </div>
    );
};