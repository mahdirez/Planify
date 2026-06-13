import { useState } from "react";

export default function TaskItem({ task, onDelete, onToggle, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.description);

  const handleSave = () => {
    if (text.trim() && text !== task.description) {
      onEdit(task.task_id, text.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center mb-3">
      {isEditing ? (
        <div className="flex gap-2 w-full">
          <input
            className="border p-1 flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <span onClick={() => onToggle(task)} className="cursor-pointer">
            {task.description}
          </span>

          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)}>Edit</button>

            <button onClick={() => onDelete(task.task_id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
