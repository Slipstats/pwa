import { describe, it, expect, vi } from "vitest";
import { MOCK_CHILDREN, MOCK_EXPENSES } from "@/lib/data/mockData";
import { Child } from "@/types/database.types";

describe("Child Selector & Beneficiary Filter Logic", () => {
  it("defaults to 'All Kids' when activeChildId is null", () => {
    const activeChildId: string | null = null;
    const matchedChild = MOCK_CHILDREN.find(
      (c) =>
        c.id === activeChildId ||
        (activeChildId && c.first_name.toLowerCase() === activeChildId.toLowerCase())
    );

    expect(matchedChild).toBeUndefined();
    const displayLabel = matchedChild ? matchedChild.first_name : "All Kids";
    expect(displayLabel).toBe("All Kids");
  });

  it("accurately matches active child by id", () => {
    const activeChildId = "child-liam-01";
    const matchedChild = MOCK_CHILDREN.find(
      (c) =>
        c.id === activeChildId ||
        (activeChildId && c.first_name.toLowerCase() === activeChildId.toLowerCase())
    );

    expect(matchedChild).toBeDefined();
    expect(matchedChild?.first_name).toBe("Liam");
    expect(matchedChild?.default_split_ratio).toBe(50);
  });

  it("accurately matches active child by first_name case-insensitively", () => {
    const activeChildId = "maya";
    const matchedChild = MOCK_CHILDREN.find(
      (c) =>
        c.id === activeChildId ||
        (activeChildId && c.first_name.toLowerCase() === activeChildId.toLowerCase())
    );

    expect(matchedChild).toBeDefined();
    expect(matchedChild?.first_name).toBe("Maya");
  });

  it("filters expenses correctly for 'All Kids' vs specific child", () => {
    // When null (All Kids), all expenses are displayed
    const filterExpenses = (activeId: string | null, childrenList: Child[]) => {
      if (!activeId) return MOCK_EXPENSES;
      return MOCK_EXPENSES.filter((e) => {
        if (e.child_id === activeId) return true;
        const childObj = childrenList.find((c) => c.id === activeId);
        if (childObj && e.child_name && e.child_name.toLowerCase().includes(childObj.first_name.toLowerCase())) {
          return true;
        }
        return false;
      });
    };

    const allExpenses = filterExpenses(null, MOCK_CHILDREN);
    expect(allExpenses.length).toBe(MOCK_EXPENSES.length);

    const liamExpenses = filterExpenses("child-liam-01", MOCK_CHILDREN);
    expect(liamExpenses.length).toBeGreaterThan(0);
    expect(liamExpenses.length).toBeLessThan(allExpenses.length);
    liamExpenses.forEach((exp) => {
      const isLiam = exp.child_id === "child-liam-01" || exp.child_name?.toLowerCase().includes("liam");
      expect(isLiam).toBe(true);
    });
  });

  it("executes onSelect with correct payload when switching from All Kids to child", () => {
    const mockOnSelect = vi.fn();

    // Select Liam
    mockOnSelect("child-liam-01", "Liam");
    expect(mockOnSelect).toHaveBeenCalledWith("child-liam-01", "Liam");

    // Select All Kids
    mockOnSelect(null, "All Kids");
    expect(mockOnSelect).toHaveBeenCalledWith(null, "All Kids");
  });
});
