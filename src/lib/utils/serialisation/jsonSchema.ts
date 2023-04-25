import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { type $Compiler, wrapCompilerAsTypeGuard } from 'json-schema-to-ts';

const AJV = addFormats(new Ajv());

const $compile: $Compiler = (schema) => AJV.compile(schema);

export const compileSchema = wrapCompilerAsTypeGuard($compile);
