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

    it("renders page info when there are multiple pages", () => {
        render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />);
        expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    });

    it("disables the Previous button on the first page", () => {
        render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByText("Previous")).toBeDisabled();
        expect(screen.getByText("Next")).not.toBeDisabled();
    });

    it("disables the Next button on the last page", () => {
        render(<Pagination page={3} totalPages={3} onPageChange={vi.fn()} />);
        expect(screen.getByText("Next")).toBeDisabled();
        expect(screen.getByText("Previous")).not.toBeDisabled();
    });

    it("calls onPageChange with the next page number when Next is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

        await user.click(screen.getByText("Next"));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("calls onPageChange with the previous page number when Previous is clicked", async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();
        render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);

        await user.click(screen.getByText("Previous"));
        expect(onPageChange).toHaveBeenCalledWith(1);
    });
});