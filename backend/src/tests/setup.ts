import { vi } from "vitest";

process.env["RESEND_API_KEY"] = "re_test_fake_key_for_tests";

vi.mock("resend", () => {
    return {
        Resend: class {
            emails = {
                send: vi.fn().mockResolvedValue({
                    data: {
                        id: "test-email-id",
                    },
                    error: null,
                }),
            };
        },
    };
});