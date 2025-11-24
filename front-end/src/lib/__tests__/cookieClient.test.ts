import { getCookieClient } from "../cookieClient";
import { getCookie } from "cookies-next";

// Mock cookies-next
jest.mock("cookies-next", () => ({
  getCookie: jest.fn(),
}));

const mockGetCookie = getCookie as jest.MockedFunction<typeof getCookie>;

describe("getCookieClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return token when cookie exists", async () => {
    const mockToken = "mock-session-token-123";
    mockGetCookie.mockReturnValue(mockToken);

    const result = await getCookieClient();

    expect(result).toBe(mockToken);
    expect(mockGetCookie).toHaveBeenCalledWith("session");
  });

  it("should return null when cookie does not exist", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const result = await getCookieClient();

    expect(result).toBe(null);
    expect(mockGetCookie).toHaveBeenCalledWith("session");
  });

  it("should return null when cookie is empty string", async () => {
    mockGetCookie.mockReturnValue("");

    const result = await getCookieClient();

    expect(result).toBe(null);
  });

  it("should handle null cookie value", async () => {
    mockGetCookie.mockReturnValue(null as any);

    const result = await getCookieClient();

    expect(result).toBe(null);
  });
});
