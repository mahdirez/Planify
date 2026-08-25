import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Pagination from "../Pagination";

describe("Pagination", () => {
    it("renders nothing when there is only one page", () => {
        const { container } = render(
            <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("renders a button for each page when total pages is small", () => {
        render(<Pagination page={2} totalPages={4} onPageChange={vi.fn()} />);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("highlights the current page", () => {
        render(<Pagination page={2} totalPages={4} onPageChange={vi.fn()} />);
        expect(screen.getByText("2")).toHaveClass("bg-brand-500");
    });

    it("shows ellipsis when there are many pages", () => {
        render(<Pagination page={5} totalPages={10} onPageChange={vi.fn()} />);
        expect(screen.getAllByText("...").length).toBeGreaterThan(0);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("disables the previous arrow on the first page", () => {
        render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByText("‹")).toBeDisabled();
        expect(screen.getByText("›")).not.toBeDisabled();
    });

    it("disables the next arrow on the last page", () => {
        render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByText("›")).toBeDisabled();
        expect(screen.getByText("‹")).not.toBeDisabled();
    });

    it("calls onPageChange with the next page number when next arrow is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

        await user.click(screen.getByText("›"));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("calls onPageChange with the clicked page number", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={1} totalPages={4} onPageChange={onPageChange} />);

        await user.click(screen.getByText("3"));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});