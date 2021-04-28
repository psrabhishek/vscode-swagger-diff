import * as vscode from 'vscode';
import * as swaggerParser from '@apidevtools/swagger-parser';

export function validateSwagger(filePath: string) {

    swaggerParser.validate(filePath, function (err, api) {
        if (err) {
            console.error("Swagger Diff: swagger-parser error: " + err.name);
            vscode.window.showErrorMessage("Swagger Diff: Please open Valid Swagger 2.0 Spec file(s) before running the command");
        }
        else if (api) {
            console.log("Swagger Diff: API name: %s", api.info.title);
        }
    });
}
