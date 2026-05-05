import { getMyProfile, updateUserProfile, updateUserPassword } from "../../src/services/user";
import { vi } from "vitest";
import { describe, expect } from "vitest";

describe("user_service", () => {

  test("getMyProfile returns data when status is 200", async () => {
    localStorage.setItem("token", "test-token");

    const mockData = {

    user: {
      _id: 1,
      email: "test-user@test.com",
      profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      }
    }};

    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );
    const result = await getMyProfile();
    console.log("RR", result)
    expect(result).toEqual(mockData.user);
  });
  test("updateUserProfile updates the state from old to new", async () => {
        localStorage.setItem("token", "test-token");

        const mockOldData = {user: {
        email: "old@test.com",
        profile: {
            firstName: "Test",
            lastName: "User",
            bio: 'testbio'
        }
        }};
        const mockUpdatedData = {     user: {
        email: "updated@test.com"
        }};

        // Create a version of fetch that can return different things in order
        const mockFetch = vi.fn();
        vi.stubGlobal("fetch", mockFetch);

        // 1. First call to getMyProfile returns OLD data
        mockFetch.mockResolvedValueOnce({
        status: 200, ok: true, json: () => Promise.resolve(mockOldData),
        });

        // 2. Second call (the Update) returns NEW data
        mockFetch.mockResolvedValueOnce({
        status: 200, ok: true, json: () => Promise.resolve(mockUpdatedData),
        });

        // 3. Third call (get profile again) returns NEW data
        mockFetch.mockResolvedValueOnce({
        status: 200, ok: true, json: () => Promise.resolve(mockUpdatedData),
        });

        // --- THE ACTION ---
        const initial = await getMyProfile();
        expect(initial.email).toBe("old@test.com"); // Proves it was old

        await updateUserProfile(1, { email: "updated@test.com" });
        
        const final = await getMyProfile();
        expect(final.email).toBe("updated@test.com"); // Proves it is now new
  });
  test("updateUserPassword returns success message when status is 200", async () => {
    localStorage.setItem("token", "test-token");

    // 1. Define the input following your snake_case backend requirement
    const passwordData = {
      current_password: "oldPassword123",
      new_password: "newPassword456"
    };

    // 2. Define exactly what the "Server" will send back
    const mockSuccessResponse = {
      message: "Password updated successfully",
      ok: true
    };

    // 3. MOCK FIRST: Setup the fetch stub
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      }),
    );

    // 4. ACT: Call the service function
    const result = await updateUserPassword(1, passwordData);

    // 5. ASSERT: Check the result
    expect(result.message).toBe("Password updated successfully");
    expect(result.ok).toBe(true);
  });
})
