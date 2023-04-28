# `@relaycorp/veraid-authority`

[![npm version](https://badge.fury.io/js/@relaycorp%2Fveraid.svg)](https://www.npmjs.com/package/@relaycorp/veraid)

JS client library for the [VeraId Authority](https://github.com/relaycorp/veraid-authority) API.

The latest version can be installed from NPM:

```shell
npm install @relaycorp/veraid-authority
```

## Usage

### Authentication

You need to refer to the documentation from the Authority server's operator on how to obtain access tokens to interact with the API.

For example, if you were to authenticate using OAuth2 client credentials, you could authenticate as follows:

```ts
import { stringify } from 'node:querystring';

import type { AuthorizationHeader } from '@relaycorp/veraid-authority';

const AUTH_ENDPOINT_URL = 'https://auth.example.com/oauth2/token';

export async function authenticate(
  client: string,
  password: string,
): Promise<AuthorizationHeader> {
  const body = {
    grant_type: 'client_credentials',
    client_id: client,
    client_secret: password,
  };
  const response = await fetch(AUTH_ENDPOINT_URL, {
    method: 'POST',
    headers: new Headers([['Content-Type', 'application/x-www-form-urlencoded']]),
    body: stringify(body),
  });
  if (response.status !== 200)
    throw new Error(`Failed to obtain access token (${response.statusText})`);
  }
  const { token_type: scheme, access_token: parameters } = await response.json();
  return { scheme, parameters };
}
```

### Client configuration

You're ready to interact with the Authority API once you've obtained a valid access token: All you need to do is initialise the `AuthorityClient` class with the URL of the API and the access key you obtained from the appropriate OAuth2 server used by the Authority server. For example:

```ts
import { AuthorityClient } from '@relaycorp/veraid-authority';

const API_URL = 'https://veraid-authority.example.com';

export async function makeClient(): Promise<AuthorityClient> {
  const auth = await authenticate(
    process.env.AUTHORITY_CLIENT_ID,
    process.env.AUTHORITY_CLIENT_PASSWORD,
  );
  return new AuthorityClient(API_URL, auth);
}
```

Keep in mind that, since the client is bound to an access token, you'd need to get a new client once the token expires.

### Sending commands

Requests are sent to the Authority API in the form of _commands_, where each operation on the API is represented by a _command_ in this library. For example, this is how you'd create an organisation:

```ts
import { OrgCreationCommand } from '@relaycorp/veraid-authority';

/**
 * Create an organisation with domain `name`.
 * @param name The organisation name (i.e., its domain name).
 * @param client The Authority client to use.
 * @return The URL path to the newly-created organisation
 */
export async function createOrg(name: string, client: AuthorityClient): Promise<string> {
  const command = new OrgCreationCommand({ name });
  const { self } = await client.send(command);
  return self;
}
```

Deletion operations are implemented with a single command: `DeletionCommand`. It can be used as follows to delete an organisation, for example:

```ts
import { DeletionCommand } from '@relaycorp/veraid-authority';

export async function createAndDeleteOrg(name: string, client: AuthorityClient): Promise<void> {
  const orgEndpoint = await createOrg(name, client);
  const command = new DeletionCommand(orgEndpoint);
  await client.send(command);
}
```

An error will be thrown if the command failed for whatever reason.

For detailed documentation on all the commands we support, please refer to the API documentation of this library.

## API Documentation

The API documentation can be found on [docs.relaycorp.tech](https://docs.relaycorp.tech/veraid-authority-js/).

## Supported Environments

This library requires Node.js 18 or later because we use the `fetch` API. Going forward, however, we will follow the Node.js release schedule.

Although not officially supported, this library _may_ also work in the browser.

## Contributions

We love contributions! If you haven't contributed to a Relaycorp project before, please take a minute to [read our guidelines](https://github.com/relaycorp/.github/blob/master/CONTRIBUTING.md) first.
