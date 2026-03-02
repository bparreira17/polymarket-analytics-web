import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Import after mocking
import { api } from "@/lib/api";

describe("API client", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  function mockJsonResponse(data: unknown, status = 200) {
    mockFetch.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? "OK" : "Error",
      json: async () => data,
    });
  }

  describe("fetchAPI", () => {
    it("adds Authorization header when token provided", async () => {
      mockJsonResponse({ plan: "pro", subscriptionStatus: null, currentPeriodEnd: null });

      await api.billing.status("my-jwt-token");

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers?.["Authorization"]).toBe("Bearer my-jwt-token");
    });

    it("does not add header when no token", async () => {
      mockJsonResponse({ data: [] });

      await api.stats();

      const [, options] = mockFetch.mock.calls[0];
      expect(options.headers?.["Authorization"]).toBeUndefined();
    });
  });

  describe("billing", () => {
    it("checkout sends POST with priceId", async () => {
      mockJsonResponse({ url: "https://checkout.stripe.com/test" });

      await api.billing.checkout("price_pro", "jwt-token");

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body)).toEqual({ priceId: "price_pro" });
      expect(url).toContain("/api/billing/checkout");
    });

    it("portal sends POST", async () => {
      mockJsonResponse({ url: "https://billing.stripe.com/session/test" });

      await api.billing.portal("jwt-token");

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method).toBe("POST");
      expect(url).toContain("/api/billing/portal");
    });

    it("status sends GET with token", async () => {
      mockJsonResponse({ plan: "free", subscriptionStatus: null, currentPeriodEnd: null });

      await api.billing.status("jwt-token");

      const [url, options] = mockFetch.mock.calls[0];
      expect(options.method ?? "GET").toBe("GET");
      expect(url).toContain("/api/billing/status");
      expect(options.headers?.["Authorization"]).toBe("Bearer jwt-token");
    });
  });
});
