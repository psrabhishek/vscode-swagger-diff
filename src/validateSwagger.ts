import * as vscode from 'vscode';
import * as swaggerParser from '@apidevtools/swagger-parser';

export function validateSwagger(filePath: string) {

    swaggerParser.validate(filePath, function (err, api) {
        if (err) {
            console.error(err);
            vscode.window.showErrorMessage("Swagger Diff: Please open a Valid Swagger 2.0 Spec file before running the command");
        }
        else if (api) {
            console.log("Swagger Diff: API name: %s", api.info.title);
        }
    });
}
