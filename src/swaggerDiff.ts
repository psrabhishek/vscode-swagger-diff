var cssStyles = `
    <style>
      table, th, td {
        border: 1px solid darkgray;
        border-collapse: collapse;
        padding: 5px;
      }
    </style>
`;

var htmlTemplateStart = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swagger Diff</title>` +
    cssStyles +
    `</head>
<body>
`;

var htmlTemplateEnd = `
    </table>
</body>
</html>`;

// This is needed to enable actions like selectAll(ctrl+a), copy (ctrl+c) in the webView iFrame
// Refer: https://github.com/microsoft/vscode/issues/65452#issuecomment-586485815
var enableContextActionsScript = `
    <script type="text/javascript">
        document.addEventListener('keydown', e => {
        const obj = {
            altKey: e.altKey,
            code: e.code,
            ctrlKey: e.ctrlKey,
            isComposing: e.isComposing,
            key: e.key,
            location: e.location,
            metaKey: e.metaKey,
            repeat: e.repeat,
            shiftKey: e.shiftKey
        }
        window.parent.postMessage( JSON.stringify(obj), '*');
    })
    </script>`;

// Construct a HTML Table from the Swagger Diff
export function getSwaggerDiffTable(diff: any) {

    var htmlContent = htmlTemplateStart;
    htmlContent += enableContextActionsScript;
    htmlContent += "\t<h2>ChangeLog</h2>\n" +
        "\t<hr/>\n";

    // Populate the changes tables, level by level
    htmlContent += getDiffTable(diff.errors, "Errors - Breaking Changes");
    htmlContent += getDiffTable(diff.warnings, "Warnings - Smooth Changes");
    htmlContent += getRawDiffTable(diff.unmatchDiffs, "UnCategorized");
    htmlContent += getDiffTable(diff.infos, "Infos");

    return htmlContent + htmlTemplateEnd;
}

function diffReplacer(key: any, value: any) {
    // Filtering out properties
    if (key === 'ruleId' || key === 'message') {
        return undefined;
    }
    return value;
}

function rawDiffReplacer(key: any, value: any) {
    // Filtering out properties
    if (key === 'kind' || key === 'path') {
        return undefined;
    }
    return value;
}

function getChangeType(type: string) {
    if (type === 'N') {
        return "Newly Added";
    }
    if (type === 'D') {
        return "Deleted";
    }
    if (type === 'E') {
        return "Modified";
    }
    if (type === 'A') {
        return "Changes within Array";
    }
    return "Unkown";
}

function getDiffBody(diff: any, indent: string) {
    if (typeof diff === 'string') {
        return diff;
    }
    var body = "";
    var childIndent = indent;
    if (indent === "") {
        childIndent = "└─&nbsp;";
    }
    else {
        body = "<br/>";
    }
    var body = "";
    for (var key in diff) {
        if (key === 'ruleId' || key === 'message') {
            continue;
        }

        body += indent + "<b>" + key + "</b>: " + getDiffBody(diff[key], "&emsp;&ensp;" + childIndent) + "<br/>";
    }

    if (body === "") {
        return "<b>NA</b>";
    }
    if (body === "<br/>") {
        return "";
    }
    return body.replace("<br/><br/>", "<br/>").replace(/\<br\/\>+$/, "");
}

function getRawDiffBody(diff: any, indent: string) {
    if (typeof diff === 'string') {
        return diff;
    }
    var body = "";
    var printKey = "";
    var childIndent = indent;
    if (indent === "") {
        childIndent = "└─&nbsp;";
    }
    else {
        body = "<br/>";
    }

    for (var key in diff) {
        if (key === 'kind' || key === 'path') {
            continue;
        }
        else if (key === "lhs") {
            printKey = "old";
        }
        else if (key === "rhs") {
            printKey = "new";
        }
        else {
            printKey = key;
        }
        body += indent + "<b>" + printKey + "</b>: " + getRawDiffBody(diff[key], "&emsp;&ensp;" + childIndent) + "<br/>";
    }

    if (body === "") {
        return "<b>NA</b>";
    }
    if (body === "<br/>") {
        return "";
    }
    return body.replace("<br/><br/>", "<br/>").replace(/\<br\/\>+$/, "");
}

function getDiffTable(diff: any[], type: string) {
    var len = diff.length;
    if (len === 0) {
        return "";
    }
    var htmlContent = "\t<h3>" + type + "</h3>\n" +
        "\t<table>\n" +
        "\t\t<tr>\n" +
        "\t\t\t<th>Change Type</th>\n" +
        "\t\t\t<th>Shot Description</th>\n" +
        "\t\t\t<th>Description</th>\n" +
        "\t\t</tr>\n";
    var i = 0;
    for (i = 0; i < diff.length; i++) {
        htmlContent += "\t\t<tr>\n" +
            "\t\t\t<td>" + diff[i].ruleId + "</td>\n" +
            "\t\t\t<td>" + diff[i].message + "</td>\n" +
            // "\t\t\t<td>"+JSON.stringify(diff[i], diffReplacer) + "</td>\n"+
            "\t\t\t<td>" + getDiffBody(diff[i], "") + "</td>\n" +
            "\t\t</tr>\n";
    };

    htmlContent += "\t</table>\n";

    return htmlContent;
}

function getRawDiffTable(diff: any[], type: string) {
    var len = diff.length;
    if (len === 0) {
        return "";
    }
    var htmlContent = "\t<h3>" + type + "</h3>\n" +
        "\t<table>\n" +
        "\t\t<tr>\n" +
        "\t\t\t<th>Change Type</th>\n" +
        "\t\t\t<th>Shot Description</th>\n" +
        "\t\t\t<th>Description</th>\n" +
        "\t\t</tr>\n";
    var i = 0;
    for (i = 0; i < diff.length; i++) {
        htmlContent += "\t\t<tr>\n" +
            "\t\t\t<td>" + getChangeType(diff[i].kind) + "</td>\n" +
            "\t\t\t<td>" + diff[i].path.join("/") + "</td>\n" +
            // "\t\t\t<td>"+JSON.stringify(diff[i], rawDiffReplacer) + "</td>\n"+
            "\t\t\t<td>" + getRawDiffBody(diff[i], "") + "</td>\n" +
            "\t\t</tr>\n";
    };

    htmlContent += "\t</table>\n";

    return htmlContent;
}
