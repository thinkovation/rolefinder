const vscode = require('vscode');

function activate(context) {
    // Hello World Command
    let helloWorldCommand = vscode.commands.registerCommand('extension.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(helloWorldCommand);

    // Find HasRight Calls Command
	let findHasRightCommand = vscode.commands.registerCommand('extension.findHasRight', async function () {
		const files = await vscode.workspace.findFiles('**/*.{js,ts,go}'); // Include .ts if needed
		
		const outputChannel = vscode.window.createOutputChannel("HasRight Finder");
		outputChannel.clear();
		outputChannel.show();
	
		let matchesArray = []; // Array to hold match details
		let matchCount = 0;
		outputChannel.appendLine(`Searching in ${files.length} files...`);
		
		for (const file of files) {
			console.log(`Processing file: ${file.fsPath}`);
			const document = await vscode.workspace.openTextDocument(file);
			const text = document.getText();
			const lines = text.split('\n'); // Split the text into lines
			const regex = /HasRight\("([^"]*)"\)/g; // Regex to match HasRight calls
	
			lines.forEach((line, index) => {
				let match;
				while ((match = regex.exec(line)) !== null) { // Use exec for line-wise matching
					matchCount++;
					matchesArray.push({
						match: match[1], // Full match
						file: file.fsPath,
						line: index + 1 // Line numbers are 1-indexed
					});
				}
			});
		}
		outputChannel.appendLine(`Total HasRight calls found: ${matchCount}`);
		// Output results to the channel
		if (matchesArray.length === 0) {
			outputChannel.appendLine("Alas, no matches found.");
		} else {
			outputChannel.appendLine(`Total matches found: ${matchesArray.length}`);
			matchesArray.forEach(({ match, file, line }, index) => {
				outputChannel.appendLine(`Match ${index + 1}: ${match} found in ${file} on line ${line}`);
			});
			const csvContent = matchesArray.map(match => `${match.file},${match.line},"${match.match}"`).join('\n');
			outputChannel.appendLine("CSV -------------------------------------------------------------------------------------------")
			outputChannel.appendLine(csvContent)

		}
	});
	

    context.subscriptions.push(findHasRightCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
