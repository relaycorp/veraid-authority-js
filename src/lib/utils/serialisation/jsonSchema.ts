import Ajv from 'ajv';
import { type $Compiler, wrapCompilerAsTypeGuard } from 'json-schema-to-ts';

const AJV = new Ajv();

// The initial compiler definition is up to you
// ($Compiler is prefixed with $ to differ from resulting type guard)
const $compile: $Compiler = (schema) => AJV.compile(schema);

export const compileSchema = wrapCompilerAsTypeGuard($compile);
