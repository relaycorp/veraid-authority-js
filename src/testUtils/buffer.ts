function bufferToArrayBuffer(buffer: Uint8Array): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

export function makeBufferResponse(bodyBuffer: Buffer) {
  const body = bufferToArrayBuffer(bodyBuffer);
  return new Response(body);
}
