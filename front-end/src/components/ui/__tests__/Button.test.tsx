import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("Button component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("should apply variant classes correctly", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector("button");

    expect(button).toHaveClass("bg-destructive");
  });

  it("should apply size classes correctly", () => {
    const { container } = render(<Button size="lg">Large button</Button>);
    const button = container.querySelector("button");

    expect(button).toHaveClass("h-11");
  });

  it("should merge custom className", () => {
    const { container } = render(
      <Button className="custom-class">Test</Button>
    );
    const button = container.querySelector("button");

    expect(button).toHaveClass("custom-class");
  });

  it("should forward ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("should render as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    );

    expect(
      screen.getByRole("link", { name: /link button/i })
    ).toBeInTheDocument();
  });
});
