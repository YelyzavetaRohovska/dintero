import { Request, Response, NextFunction } from 'express';
import { requestWrap } from '../../src/utils/requestWrap';

describe("requestWrap", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should call the wrapped function successfully", async () => {
    const mockHandler = jest.fn(async (req: Request, res: Response) => {
      res.status(200).json({ success: true });
    });

    const wrappedHandler = requestWrap(mockHandler);

    await wrappedHandler(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it("should catch an error and call next with it", async () => {
    const error = new Error("Test error");
    const mockHandler = jest.fn(async () => {
      throw error;
    });

    const wrappedHandler = requestWrap(mockHandler);

    await wrappedHandler(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
