import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TaskItem from "../TaskItem";

vi.mock("../../api/attachments.api", () => ({
    getTaskAttachmentsApi: vi.fn(() => Promise.resolve({ data: [] })),
    uploadAttachmentApi: vi.fn(),
    downloadAttachmentApi: vi.fn(),
    deleteAttachmentApi: vi.fn(),
}));

const baseTask = {
    id: 1,
    description: "Buy groceries",
    completed: false,
};

describe("TaskItem", () => {
    let onDelete, onToggle, onSaveEdit;

    beforeEach(() => {
        onDelete = vi.fn();
        onToggle = vi.fn();
        onSaveEdit = vi.fn();
    });

    it("renders the task description", () => {
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    });

    it("applies strikethrough style when task is completed", () => {
        render(
            <TaskItem
                task={{ ...baseTask, completed: true }}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );
        expect(screen.getByText("Buy groceries")).toHaveClass("line-through");
    });

    it("calls onToggle with the task id when the checkbox button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );

        await user.click(screen.getByTitle("Mark complete"));
        expect(onToggle).toHaveBeenCalledWith(1);
    });

    it("calls onDelete with the task id when the delete button is clicked", async () => {
        const user = userEvent.setup();
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );

        await user.click(screen.getByTitle("Delete"));
        expect(onDelete).toHaveBeenCalledWith(1);
    });

    it("switches to edit mode and calls onSaveEdit with the new text", async () => {
        const user = userEvent.setup();
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );

        await user.click(screen.getByTitle("Edit"));

        const input = screen.getByDisplayValue("Buy groceries");
        await user.clear(input);
        await user.type(input, "Buy milk");
        await user.click(screen.getByTitle("Save"));

        expect(onSaveEdit).toHaveBeenCalledWith(1, "Buy milk");
    });

    it("does not call onSaveEdit if the text is unchanged", async () => {
        const user = userEvent.setup();
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={null}
            />,
        );

        await user.click(screen.getByTitle("Edit"));
        await user.click(screen.getByTitle("Save"));

        expect(onSaveEdit).not.toHaveBeenCalled();
    });

    it("disables action buttons while a toggle action is in progress", () => {
        render(
            <TaskItem
                task={baseTask}
                onDelete={onDelete}
                onToggle={onToggle}
                onSaveEdit={onSaveEdit}
                actionLoading={{ id: 1, action: "toggle" }}
            />,
        );

        expect(screen.getByTitle("Mark complete")).toBeDisabled();
        expect(screen.getByTitle("Delete")).toBeDisabled();
    });
});