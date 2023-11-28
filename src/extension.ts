import * as vscode from 'vscode';
import { DebuggerProxy } from "./DebuggerProxy";
import { DebuggerViewProxy } from "./DebuggerViewProxy";

const debuggr = new DebuggerProxy();
let debuggerView: DebuggerViewProxy;
let timeout: NodeJS.Timeout;
let enabled = true;
let debug_enabled = false;

function openPreview(imgPath: string) {
	const openedTabs = vscode.window.tabGroups.all.flatMap(
		({ tabs }) => tabs.map(tab => tab.label));
	const imgName = imgPath.split("/").at(-1);
	if (imgName !== undefined) {
		if (!openedTabs.includes(imgName)) {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.file(imgPath));
			vscode.commands.executeCommand('moveActiveEditor', { to: "right", by: "group" });
		}
	}
}

function show(variableStr: string) {
	if (!debuggerView) {
		//vscode.window.showInformationMessage("No active debug session.")
		return;
	}
	const activeDebugSession = debuggerView.activeDebugSession;
	if (!activeDebugSession) {
		//vscode.window.showInformationMessage("No active debug session.")
		return;
	}
	const imgPath = activeDebugSession.session.configuration.workspaceFolder
		+ '/_torchshow/debugtshow.png';
	const frameId = debuggerView.getActiveStackFrameId(activeDebugSession);
	if (!frameId) {
		vscode.window.showErrorMessage("Could not get frame id.");
		return;
	}
	// Theme figure
	const themeKind = vscode.window.activeColorTheme.kind;
	const pltTheme = ((themeKind === 1) ? 'default' : 'dark_background');
	activeDebugSession.evaluate({
		expression: `import matplotlib.pyplot as plt; plt.style.use("${pltTheme}")`,
		frameId: frameId,
		context: "repl"
	});
	// Execute torchshow command
	activeDebugSession.evaluate({
		expression: `import torchshow as ts\nts.save(${variableStr}, "${imgPath}", show_axis=True, suptitle="\\nshape : "+str(list((${variableStr}).shape)))`,
		frameId: frameId,
		context: "repl"
	})
		.then(() => openPreview(imgPath))
		.catch(er => {
			if (debug_enabled) { vscode.window.showInformationMessage(String(er)); }
		});
}

export function activate(context: vscode.ExtensionContext) {
	// When debug session is active, wrap the degugger so that we can execute custom commands
	context.subscriptions.push(vscode.debug.onDidChangeActiveDebugSession(event => {
		debuggerView = new DebuggerViewProxy(debuggr);
	}));
	// When some text selected, plot the image
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(event => {
		if (!enabled) {
			return;
		}
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const selection = editor.selection;
		if (selection.isEmpty) {
			return;
		}
		const selectedText = editor.document.getText(selection);
		clearTimeout(timeout);
		timeout = setTimeout(() => show(selectedText), 200);
	}));
	// Register a command for quick enable
	context.subscriptions.push(vscode.commands.registerCommand("debugtshow.enable", () => {
		enabled = true;
	}));
	// Register a command to quick disable
	context.subscriptions.push(vscode.commands.registerCommand("debugtshow.disable", () => {
		enabled = false;
	}));
	// Register a command for debug msg enable
	context.subscriptions.push(vscode.commands.registerCommand("debugtshow.debug_enable", () => {
		debug_enabled = true;
	}));
	// Register a command for debug msg  disable
	context.subscriptions.push(vscode.commands.registerCommand("debugtshow.debug_disable", () => {
		debug_enabled = false;
	}));
}



