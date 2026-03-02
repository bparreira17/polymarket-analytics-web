import { describe, it, expect, vi } from "vitest";

// We test the hook's logic without React Query rendering,
// by verifying the queryFn behavior directly.

const mockGetToken = vi.fn();
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mockGetToken,
    isSignedIn: true,
  }),
}));

// Mock the API module
const mockBillingStatus = vi.fn();
vi.mock("@/lib/api", () => ({
  api: {
    billing: {
      status: (...args: unknown[]) => mockBillingStatus(...args),
    },
  },
}));

// Mock react-query to capture the queryFn
let capturedQueryFn: (() => Promise<unknown>) | null = null;
vi.mock("@tanstack/react-query", () => ({
  useQuery: (opts: { queryFn: () => Promise<unknown> }) => {
    capturedQueryFn = opts.queryFn;
    return { data: undefined, isLoading: true };
  },
}));

describe("useUserPlan", () => {
  it("returns plan from API response", async () => {
    // Import after mocks are set
    const { useUserPlan } = await import("@/hooks/use-user");

    mockGetToken.mockResolvedValue("test-jwt-token");
    mockBillingStatus.mockResolvedValue({
      plan: "pro",
      subscriptionStatus: "active",
      currentPeriodEnd: "2026-04-01",
    });

    // Call the hook to capture queryFn
    useUserPlan();

    expect(capturedQueryFn).toBeTruthy();
    const result = await capturedQueryFn!();

    expect(mockBillingStatus).toHaveBeenCalledWith("test-jwt-token");
    expect(result).toEqual({
      plan: "pro",
      subscriptionStatus: "active",
      currentPeriodEnd: "2026-04-01",
    });
  });

  it("throws when not authenticated (no token)", async () => {
    const { useUserPlan } = await import("@/hooks/use-user");

    mockGetToken.mockResolvedValue(null);

    useUserPlan();

    await expect(capturedQueryFn!()).rejects.toThrow("Not authenticated");
  });
});
