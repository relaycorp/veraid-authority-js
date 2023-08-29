export function mockSpy<
  Return,
  Parameters extends any[],
  MockType extends jest.MockInstance<Return, Parameters>,
>(spy: MockType, mockImplementation?: (...args: Parameters) => Return): MockType {
  beforeEach(() => {
    spy.mockReset();
    if (mockImplementation) {
      spy.mockImplementation(mockImplementation);
    }
  });

  afterAll(() => {
    spy.mockRestore();
  });

  return spy;
}

export async function getPromiseRejection<ErrorType extends Error>(
  rejectingFunction: () => Promise<unknown>,
  expectedErrorType: new (...args: any[]) => ErrorType,
): Promise<ErrorType> {
  let error: ErrorType | undefined;
  try {
    await rejectingFunction();
  } catch (err) {
    error = err as ErrorType;
  }

  expect(error).toBeInstanceOf(expectedErrorType);
  return error!;
}
