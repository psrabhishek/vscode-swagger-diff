[![](https://vsmarketplacebadge.apphb.com/version-short/AbhishekPSR.vscode-swagger-diff.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.vscode-swagger-diff)
[![](https://vsmarketplacebadge.apphb.com/downloads/AbhishekPSR.vscode-swagger-diff.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.vscode-swagger-diff)
[![](https://vsmarketplacebadge.apphb.com/rating-short/AbhishekPSR.vscode-swagger-diff.svg)](https://marketplace.visualstudio.com/items?itemName=AbhishekPSR.vscode-swagger-diff)

# VSCode Swagger Diff

This is a Visual Studio Code Extension that compares the changes made to a `Swagger 2.0` spec and shows the Breaking and other changes in a table format.

It will help Developers to know the impact of the changes they applied.

#### Working Changes:
![workingChangesView Diff - Gif](images/workingChangesView.gif)

#### Side By Side:
![sideBySideView Diff - Gif](images/sideBySideView.gif)

#### Diff View (works with [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) also):
![diffView Diff - Gif](images/diffView.gif)

> side by side and diff view's might take a bit more time, based on the file size

<br>

## How To Use

### To view the changes:

- Open any Swagger 2.0 spec file with working changes <br>(or) Open 2 Swagger 2.0 spec files in a split view (i.e. side-by-side)<br> (or) Open diff for a Swagger 2.0 spec file (also supports viewing diff from older commits using [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens))
- Open Command Palette ( `ctrl` + `shift` + `p` ) and run the command `Swagger Diff`
- Or use the keyboard shortcut `shift` + `alt` + `d`
- The results will be shown in a new `WebViewPanel`

### To Copy the Output:

- Click anywhere in the result panel
- click `ctrl` + `a` (or `cmd` + `a` for mac) to select all contents
- click `ctrl` + `c` (or `cmd` + `c` for mac) to copy the selected contents



## Reading the Diff

There are 2 types of changes:
- breaking change
- smooth change

### Breaking changes

Examples:
- Delete path
- Rename path operationId
- Delete/Rename parametters
- Add a constraint on a parametter (like isRequired)
- Modify a response item

> In the extension the breaking changes are considered as `Error level`

### Smooth changes

Examples:
- Add a path
- Add a param
- Add response item
- Add/Update descriptions

> In the extension the smooth changes are considered as `Warning level`

> In some Scenarios the utility may be unable to categorize the change, they will be coming under `UnCategorized level`

 
## Requirements

- It works for Swagger 2.0 specs only
- The file must be a part of a git repository

## Release Notes

### 0.0.2

-  Added a default Keyboard Shortcut
-  Added new functionality to compare 2 swagger files opened side by side (also works for git diff and [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens))

### 0.0.1

-  Initial release


## Credits

Swagger Viewer utilizes the following open source projects

-  [`swagger-parser`](https://www.npmjs.com/package/@apidevtools/swagger-parser)
-  [`swagger-diff`](https://www.npmjs.com/package/swagger-diff)