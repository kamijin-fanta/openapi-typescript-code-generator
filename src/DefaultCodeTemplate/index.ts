import ts from "typescript";

import * as TypeScriptCodeGenerator from "../CodeGenerator";
import type * as Converter from "../Converter";
import * as ApiClientArgument from "./ApiClientArgument";
import * as ApiClientClass from "./ApiClientClass";

export const rewriteCodeAfterTypeDeclaration: Converter.v3.CodeGenerator.RewriteCodeAfterTypeDeclaration = (
  context: ts.TransformationContext,
  codeGeneratorParamsList: Converter.v3.CodeGeneratorParams[],
  option: Converter.v3.CodeGenerator.Option,
): ts.Statement[] => {
  const statements: ts.Statement[] = [];
  const factory = TypeScriptCodeGenerator.Factory.create(context);
  codeGeneratorParamsList.forEach(codeGeneratorParams => {
    if (codeGeneratorParams.hasRequestBody) {
      statements.push(ApiClientArgument.createRequestContentTypeReference(factory, codeGeneratorParams));
    }
    if (codeGeneratorParams.responseSuccessNames.length > 0) {
      statements.push(ApiClientArgument.createResponseContentTypeReference(factory, codeGeneratorParams));
    }
    const typeDeclaration = ApiClientArgument.create(factory, codeGeneratorParams);
    if (typeDeclaration) {
      statements.push(typeDeclaration);
    }
  });
  ApiClientClass.create(factory, codeGeneratorParamsList, option).forEach(newStatement => {
    statements.push(newStatement);
  });
  return statements;
};
