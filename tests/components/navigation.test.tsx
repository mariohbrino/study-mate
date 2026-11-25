import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Navigation from "@/components/Navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@clerk/nextjs", () => ({
  Show: ({
    when,
    children,
  }: {
    when: "signed-in" | "signed-out";
    children: ReactNode;
  }) => (when === "signed-in" ? <>{children}</> : null),
  SignInButton: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignUpButton: ({ children }: { children: ReactNode }) => <>{children}</>,
  UserButton: () => <div data-testid="user-button" />,
}));

describe("navigation component", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/");
  });

  it("displays all navigation links", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
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
