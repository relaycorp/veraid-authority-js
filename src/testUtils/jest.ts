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
