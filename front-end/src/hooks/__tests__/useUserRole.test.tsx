import { renderHook, waitFor } from "@testing-library/react";
import { useUserRole } from "../useUserRole";
import { getCookieClient } from "@/lib/cookieClient";

// Mock das dependências
jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("@/lib/cookieClient");

// Importar após o mock
import { api } from "@/services/api";

const mockApi = api as jest.Mocked<typeof api>;
const mockGetCookieClient = getCookieClient as jest.MockedFunction<
  typeof getCookieClient
>;

describe("useUserRole hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null role and loading true initially", () => {
    mockGetCookieClient.mockResolvedValue(null);

    const { result } = renderHook(() => useUserRole());

    expect(result.current.userRole).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  it("should fetch user role when token exists", async () => {
    const mockToken = "mock-token-123";
    const mockUserData = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "ADMIN" as const,
    };

    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: mockUserData,
    } as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe("ADMIN");
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isManager).toBe(false);
    expect(result.current.isWaiter).toBe(false);
    expect(result.current.isKitchen).toBe(false);
  });

  it("should handle ADMIN role correctly", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: { role: "ADMIN" },
    } as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe("ADMIN");
    expect(result.current.isAdmin).toBe(true);
  });

  it("should handle GERENTE role correctly", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: { role: "GERENTE" },
    } as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe("GERENTE");
    expect(result.current.isManager).toBe(true);
  });

  it("should handle GARCOM role correctly", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: { role: "GARCOM" },
    } as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe("GARCOM");
    expect(result.current.isWaiter).toBe(true);
  });

  it("should handle COZINHA role correctly", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: { role: "COZINHA" },
    } as any);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe("COZINHA");
    expect(result.current.isKitchen).toBe(true);
  });

  it("should return null role when no token exists", async () => {
    mockGetCookieClient.mockResolvedValue(null);

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe(null);
    expect(mockApi.get).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockRejectedValue(new Error("API Error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useUserRole());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.userRole).toBe(null);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should set loading to false after fetch completes", async () => {
    const mockToken = "mock-token-123";
    mockGetCookieClient.mockResolvedValue(mockToken);
    mockApi.get.mockResolvedValue({
      data: { role: "USER" },
    } as any);

    const { result } = renderHook(() => useUserRole());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
