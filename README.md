
# VSCode Swagger Diff

This is a Visual Studio Code Extension that compares the Working Tree changes made to a `Swagger 2.0` spec and shows the Breaking and other changes in a table format.

It will help Developers to know the impact of the changes they applied.

  

![Swagger Diff - Gif](images/overview.gif)

  

## How To Use

  

To view the changes:

- Open any Swagger 2.0 spec file with working changes

- Open Command Palette ( `ctrl` + `shift` + `p` )

- Run the command `Swagger Diff`

- The results will be shown in a new `WebViewPanel`

To Copy the Output:

- Click anywhere in the result panel

- click `ctrl` + `a` (or `cmd` + `a` for mac) to select all contents

- click `ctrl` + `c` (or `cmd` + `c` for mac) to copy the contents

  

Add a keyboard shortcut for convenience, example:

  

[![enter image description here](https://vscode.readthedocs.io/en/latest/getstarted/images/keybinding/keyboard-shortcuts.gif)](https://vscode.readthedocs.io/en/latest/getstarted/keybindings/)

  

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

  

In the extension the breaking changes are considered as `Error level`

  

### Smooth changes

Examples:

  

- Add a path

- Add a param

- Add response item

- Add/Update descriptions

In the extension the smooth changes are considered as `Warning level`

  

In some Scenarios the utility may be unable to categorize the change, they will be coming under `UnCategorized level`

  

## Requirements

  

- It works for Swagger 2.0 specs only

- The file must be a part of a git repository

- It will only compare the working tree changes, i.e changes made relative to the index (staging area for the next commit)

  

## Release Notes

### 0.0.1

Initial release

  
  

## Credits

  

Swagger Viewer utilizes the following open source projects
-  [`swagger-parser`](https://www.npmjs.com/package/@apidevtools/swagger-parser)
-  [`swagger-diff`](https://www.npmjs.com/package/swagger-diff) 