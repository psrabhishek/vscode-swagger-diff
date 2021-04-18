// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { validateSwagger } from './validateSwagger';
import { getSwaggerDiffTable } from './swaggerDiff';
const swaggerDiff = require('swagger-diff');

const tempFileName = "swagger-diff.txt";
const tempFilePath = path.join(process.cwd(), tempFileName);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-swagger-diff" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-swagger-diff.generateDiff', () => {

		if (vscode.window.activeTextEditor) {
			// Variable to store the data related to open/active file
			var currentlyOpenDocument = vscode.window.activeTextEditor.document;
			var currentlyOpenTabfileUri = currentlyOpenDocument.uri;
			var currentlyOpenTabfilePath = currentlyOpenDocument.fileName;
			var currentlyOpenTabfileName = path.basename(currentlyOpenTabfilePath);
			var currentlyOpenTabfileDir = path.dirname(currentlyOpenTabfilePath);

			console.log("Swagger Diff: Running on file - " + currentlyOpenTabfilePath);

			// Validate the file to check if it is Swagger 2.0 spec and populate error message
			// To Be Handled: since this is asynchronous, the program will still continue
			// and another error message will also be shown stating the extenstion failed.
			validateSwagger(currentlyOpenTabfilePath);

			try {
				// Load the Swagger Spec file (Working Changes)
				var newSwaggerContent = currentlyOpenDocument.getText();
				var newSwagger = JSON.parse(newSwaggerContent);
				var noOfLines = newSwaggerContent.split("\n").length * 2;
			}
			catch (error) {
				console.error(error);
				return;
			}

			// Use a git diff command to store the diff in a temp file to use this command 
			//we need to know the no of lines to output entire file instead of just 3 lines
			// so it is easy to construct the actual index file (ol swagger file)
			var gitDiffCommand = "git -C " + currentlyOpenTabfileDir + " diff -U" + noOfLines + " -- " + currentlyOpenTabfilePath + " > " + tempFileName;
			console.log("Swagger Diff: git diff command - " + gitDiffCommand);
			try{
				execSync(gitDiffCommand);
			}
			catch(error){
				console.error("Swagger Diff: Error during Git Diff Command");
				vscode.window.showErrorMessage("Swagger Diff: Unable to perform 'git diff' on the file");
				return;
			}

			// Load the old Swagger (index) from temp file
			var diffContent = readFileSync(tempFilePath, { encoding: 'utf-8' });
			var oldSwaggerContent = "";
			var bodyStart = false;

			// construct the Old file 
			var lines = diffContent.split("\n");
			lines.forEach(function (line) {
				if (line.startsWith("@@")) {
					bodyStart = true;
				}
				if (bodyStart && (line.startsWith(" ") || line.startsWith("-"))) {
					oldSwaggerContent = oldSwaggerContent + line.substr(1);
				}
			});

			if (oldSwaggerContent) {
				var oldSwagger = JSON.parse(oldSwaggerContent);

				// Check if there are any Working Changes
				if (newSwaggerContent === oldSwaggerContent) {
					console.log("Swagger Diff: no Working Changes found");
					vscode.window.showInformationMessage("Swagger Diff: No Working Changes found for '" + currentlyOpenTabfileName + "'");
					return;
				}

				// Default Config for swagger-diff, breaking changes are Error and Smooth(ex: newly Added) are Warning
				var config = {
					"changes": {
						"breaks": 3,
						"smooths": 2
					}
				};
				// Get the Swagger Diff
				swaggerDiff(oldSwagger, newSwagger, config).then(function (diff: any) {
					// Create a WebView to show the results
					const panel = vscode.window.createWebviewPanel('swaggerDiff', 'Swagger Diff: ' + currentlyOpenTabfileName, vscode.ViewColumn.One, {});
					// And set its HTML content
					panel.webview.html = getSwaggerDiffTable(diff);
				});

			}
			else{
				// git diff command will have no output when there is no change, hence oldSwaggerContent is empty
				console.log("Swagger Diff: no Working Changes found");
				vscode.window.showInformationMessage("Swagger Diff: No Working Changes found for '" + currentlyOpenTabfileName + "'");
				return;
			}

		}
		else {
			vscode.window.showErrorMessage('SwaggerDiff: No Active Text Editor Found! Please open a Valid Swagger Spec file before running the command');
		}

	});

	context.subscriptions.push(disposable);
}


// this method is called when your extension is deactivated
export function deactivate() {
	console.log("Swagger Diff: Deactivating");
	// Delete the temp file upon deactivation of extension
	deleteFile(tempFilePath);
}


function deleteFile(filePath: string) {
	try {
		unlinkSync(filePath);
		console.log("Swagger Diff: File is deleted.");
	} catch (error) {
		console.log(error);
	}
	return;
}