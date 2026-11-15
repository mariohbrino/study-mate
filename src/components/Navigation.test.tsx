import Navigation from "@/components/Navigation";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Navigation", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/");
  });

  it("displays all navigation links", () => {
    render(<Navigation />);

    const navigation = screen.getByRole("navigation", {
      name: "Main navigation",
    });

    expect(
      within(navigation).getByRole("link", { name: "Home" }),
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("link", { name: "Assignments" }),
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("link", { name: "Courses" }),
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("link", { name: "Study Planner" }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu when clicking the Study Mate logo", async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    await user.click(screen.getByRole("link", { name: "Study Mate" }));

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("marks the current page as active", () => {
    vi.mocked(usePathname).mockReturnValue("/assignments");

    render(<Navigation />);

    expect(screen.getByRole("link", { name: "Assignments" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("opens the mobile navigation menu", async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu after selecting a link", async () => {
    const user = userEvent.setup();

    render(<Navigation />);

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });

    await user.click(
      within(mobileNavigation).getByRole("link", { name: "Assignments" }),
    );

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });
});
