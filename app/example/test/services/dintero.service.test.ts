import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import dinteroService from '../../src/services/dintero.service';

const mockAxios = new MockAdapter(axios);

describe("DinteroService", () => {
  beforeEach(() => {
    mockAxios.reset();

    process.env.DINTERO_CLIENT_ID = "test-client-id";
    process.env.DINTERO_SECRET = "test-secret";
    process.env.DINTERO_ACCOUNT = "test-account";
    process.env.APP_BASE_URL = "http://localhost:3000";
  });

  afterEach(() => {
    delete process.env.DINTERO_CLIENT_ID;
    delete process.env.DINTERO_SECRET;
    delete process.env.DINTERO_ACCOUNT;
    delete process.env.APP_BASE_URL;
  });

  describe("getToken", () => {
    it("should fetch and return an access token", async () => {
      const mockToken = "mock-access-token";
      mockAxios
        .onPost(`https://test.dintero.com/v1/accounts/test-account/auth/token`)
        .reply(200, { access_token: mockToken });

      const token = await dinteroService.getToken();

      expect(token).toBe(mockToken);
    });

    it("should throw an error if credentials are missing", async () => {
      delete process.env.DINTERO_CLIENT_ID;

      await expect(dinteroService.getToken()).rejects.toThrow(
        "Authorization creadentials are missing"
      );
    });

    it("should throw an error if the API call fails", async () => {
      mockAxios.onPost().reply(500);

      await expect(dinteroService.getToken()).rejects.toThrow(
        "Failed to fetch Dintero token"
      );
    });
  });

  describe("getSessionLink", () => {
    const mockToken = "mock-access-token";
    const mockOrder = {
      id: "test-order-id",
      amount: 10000,
      currency: "NOK",
    };

    it("should return a session link", async () => {
      const mockSessionUrl = "https://checkout.test.dintero.com/v1/view/mock-session";
      mockAxios
        .onPost("https://checkout.test.dintero.com/v1/sessions-profile")
        .reply(200, { url: mockSessionUrl });

      const sessionLink = await dinteroService.getSessionLink(mockToken, mockOrder);

      expect(sessionLink).toBe(mockSessionUrl);
    });

    it("should throw an error if the API call fails", async () => {
      mockAxios.onPost().reply(500);

      await expect(dinteroService.getSessionLink(mockToken, mockOrder)).rejects.toThrow(
        "Failed to create Dintero session"
      );
    });
  });
});
