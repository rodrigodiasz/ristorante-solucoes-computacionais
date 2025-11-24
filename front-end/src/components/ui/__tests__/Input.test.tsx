import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";

describe("Input component", () => {
  it("should render input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should handle text input", () => {
    render(<Input />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test input" } });

    expect(input.value).toBe("test input");
  });

  it("should render with placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should handle different input types", () => {
    const { container, rerender } = render(<Input type="email" />);
    let input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="password" />);
    input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("should merge custom className", () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector("input");

    expect(input).toHaveClass("custom-class");
  });

  it("should forward ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("should handle onChange events", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("should accept value prop", () => {
    render(<Input value="controlled value" onChange={() => {}} />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveValue("controlled value");
  });
});
