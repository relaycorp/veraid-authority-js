import { jest } from '@jest/globals';

import { MockCommand } from '../../testUtils/MockCommand.js';
import { getPromiseRejection, mockSpy } from '../../testUtils/jest.js';
import { JsonValue } from '../utils/serialisation/JsonValue.js';
import { type PostRequest, HTTP_STATUS_CODES } from '../utils/http.js';

import { AuthorityClient } from './AuthorityClient.js';
import type { AuthorizationHeader } from './AuthorizationHeader.js';
import { ServerError } from './ServerError.js';
import { ClientError } from './ClientError.js';

const mockFetch = mockSpy(jest.spyOn(global, 'fetch'));
beforeEach(() => {
  mockFetch.mockResolvedValue(new Response('{}'));
});

const mockAbortSignalTimeout = mockSpy(jest.spyOn(AbortSignal, 'timeout'));
const mockTimeoutSignal = Symbol('mockTimeoutSignal');
beforeEach(() => {
  mockAbortSignalTimeout.mockReturnValue(mockTimeoutSignal as unknown as AbortSignal);
});

describe('AuthorityClient', () => {
  const baseUrl = 'https://api.veraid-authority.example';
  const authHeader: AuthorizationHeader = {
    scheme: 'Bearer',
    parameters: 'test',
  };

  const request: PostRequest = {
    method: 'POST',
    path: '/orgs',
    body: new JsonValue({ foo: 'bar' }),
  };

  describe('send', () => {
    describe('Request', () => {
      test('Method should be honoured', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);

        await client.send(new MockCommand(request));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ method: request.method }),
        );
      });

      test('Path should be prefixed with API base URL', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);

        await client.send(new MockCommand(request));

        expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}${request.path}`, expect.anything());
      });

      test('Should time out after 3 seconds by default', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);

        await client.send(new MockCommand(request));

        expect(mockAbortSignalTimeout).toHaveBeenCalledWith(3000);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ signal: mockTimeoutSignal }),
        );
      });

      test('Should use client-level timeout if specified', async () => {
        const clientTimeoutMs = 5000;
        const client = new AuthorityClient(baseUrl, authHeader, { timeoutMs: clientTimeoutMs });

        await client.send(new MockCommand(request));

        expect(mockAbortSignalTimeout).toHaveBeenCalledWith(clientTimeoutMs);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ signal: mockTimeoutSignal }),
        );
      });

      test('Should time out after specified timeout if provided', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);
        const timeoutMs = 1000;

        await client.send(new MockCommand(request), { timeoutMs });

        expect(mockAbortSignalTimeout).toHaveBeenCalledWith(timeoutMs);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ signal: mockTimeoutSignal }),
        );
      });

      test('Command-level timeout should override client-level timeout', async () => {
        const clientTimeoutMs = 5000;
        const commandTimeoutMs = 2000;
        const client = new AuthorityClient(baseUrl, authHeader, { timeoutMs: clientTimeoutMs });

        await client.send(new MockCommand(request), { timeoutMs: commandTimeoutMs });

        expect(mockAbortSignalTimeout).toHaveBeenCalledWith(commandTimeoutMs);
        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ signal: mockTimeoutSignal }),
        );
      });

      test.each([
        ['slash', '/'],
        ['slashes', '//'],
      ])('Any trailing %s should be removed from the base URL', async (_type, suffix) => {
        const client = new AuthorityClient(`${baseUrl}${suffix}`, authHeader);

        await client.send(new MockCommand(request));

        expect(mockFetch).toHaveBeenCalledWith(`${baseUrl}${request.path}`, expect.anything());
      });

      describe('Headers', () => {
        test('Content type should be honoured if present', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);
          const contentType = 'application/potato';
          const command = new MockCommand({ ...request, contentType });

          await client.send(command);

          expect(mockFetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              headers: expect.toSatisfy<Headers>(
                (headers) => headers.get('Content-Type') === contentType,
              ),
            }),
          );
        });

        test('Content type should default to JSON', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);

          await client.send(new MockCommand(request));

          expect(mockFetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              headers: expect.toSatisfy<Headers>(
                (headers) => headers.get('Content-Type') === 'application/json',
              ),
            }),
          );
        });

        test('User Agent should be set', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);

          await client.send(new MockCommand(request));

          const expectedUserAgent =
            'VeraId Authority Client (https://github.com/relaycorp/veraid-authority-js)';
          expect(mockFetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              headers: expect.toSatisfy<Headers>(
                (headers) => headers.get('User-Agent') === expectedUserAgent,
              ),
            }),
          );
        });

        test('Authorization should be honoured', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);

          await client.send(new MockCommand(request));

          const expectedHeaderValue = `${authHeader.scheme} ${authHeader.parameters}`;
          expect(mockFetch).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
              headers: expect.toSatisfy<Headers>(
                (headers) => headers.get('Authorization') === expectedHeaderValue,
              ),
            }),
          );
        });
      });

      test('Body should be serialised if present', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);

        await client.send(new MockCommand(request));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ body: request.body.serialise() }),
        );
      });

      test('Body should be unset if absent', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);
        const requestWithoutBody = { ...request, body: undefined };

        await client.send(new MockCommand(requestWithoutBody));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({ body: undefined }),
        );
      });
    });

    describe('Response', () => {
      test('2XX response should be processed by the command', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);
        const responseBody = { foo: 'bar' };
        const response = new Response(JSON.stringify(responseBody), { status: 200 });
        mockFetch.mockResolvedValue(response);

        const output = await client.send(new MockCommand(request));

        expect(output).toMatchObject(responseBody);
      });

      describe('400 response', () => {
        test('400 response should throw ClientError', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);
          mockFetch.mockResolvedValue(new Response('{}', { status: 400 }));

          const error = await getPromiseRejection(
            async () => client.send(new MockCommand(request)),
            ClientError,
          );

          expect(error.message).toBe('Server refused request as invalid: (no reason provided)');
          expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        test('Error should include problem type if present', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);
          const responseBody = { type: 'https://example.com/problem' };
          const response = new Response(JSON.stringify(responseBody), { status: 400 });
          mockFetch.mockResolvedValue(response);

          const error = await getPromiseRejection(
            async () => client.send(new MockCommand(request)),
            ClientError,
          );

          expect(error.message).toBe(`Server refused request as invalid: ${responseBody.type}`);
          expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        test('Error should include message if present', async () => {
          const client = new AuthorityClient(baseUrl, authHeader);
          const responseBody = { message: 'JSON schema validation error here' };
          const response = new Response(JSON.stringify(responseBody), { status: 400 });
          mockFetch.mockResolvedValue(response);

          const error = await getPromiseRejection(
            async () => client.send(new MockCommand(request)),
            ClientError,
          );

          expect(error.message).toBe(`Server refused request as invalid: ${responseBody.message}`);
          expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });
      });

      test('401 response should throw ClientError', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);
        mockFetch.mockResolvedValue(new Response(null, { status: 401 }));

        const error = await getPromiseRejection(
          async () => client.send(new MockCommand(request)),
          ClientError,
        );

        expect(error.message).toBe('Server refused access token');
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
      });

      test('403 response should throw ClientError', async () => {
        const client = new AuthorityClient(baseUrl, authHeader);
        mockFetch.mockResolvedValue(new Response(null, { status: 403 }));

        const error = await getPromiseRejection(
          async () => client.send(new MockCommand(request)),
          ClientError,
        );

        expect(error.message).toBe('Server denied authorisation');
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.FORBIDDEN);
      });

      test.each([402, 404, 499])(
        '%s response should be unsupported and throw ClientError',
        async (status) => {
          const client = new AuthorityClient(baseUrl, authHeader);
          mockFetch.mockResolvedValue(new Response(null, { status }));

          const error = await getPromiseRejection(
            async () => client.send(new MockCommand(request)),
            ClientError,
          );

          expect(error.message).toBe(`Unsupported status code (${status})`);
          expect(error.statusCode).toBe(status);
        },
      );

      test.each([
        ['3XX', 300],
        ['5XX', 500],
      ])('%s response should be unsupported and throw ServerError', async (_name, status) => {
        const client = new AuthorityClient(baseUrl, authHeader);
        mockFetch.mockResolvedValue(new Response(null, { status }));

        await expect(client.send(new MockCommand(request))).rejects.toThrowWithMessage(
          ServerError,
          `Unsupported status code (${status})`,
        );
      });
    });
  });
});
