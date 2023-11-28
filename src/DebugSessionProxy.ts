import { DebugSession } from "vscode";

export class DebugSessionProxy {
	private _activeStackFrameId: number | undefined;

	constructor(public readonly session: DebugSession) {}

	public async getStackTrace(args: {
		threadId: number;
		startFrame?: number;
		levels?: number;
	}): Promise<StackTraceInfo> {
		try {
			const reply = (await this.session.customRequest("stackTrace", {
				threadId: args.threadId,
				levels: args.levels,
				startFrame: args.startFrame || 0,
			})) as { totalFrames?: number; stackFrames: StackFrame[] };
			return reply;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	/**
	 * Evaluates the given expression.
	 * If context is "watch", long results are usually shortened.
	 */

	public async evaluate(args: {
		expression: string;
		frameId: number | undefined;
		context: "watch" | "repl" | "copy";
	}): Promise<{ result: string; variablesReference: number }> {
		const reply = await this.session.customRequest("evaluate", {
			expression: args.expression,
			frameId: args.frameId,
			context: args.context,
		});
		return {
			result: reply.result,
			variablesReference: reply.variablesReference,
		};
	}
}

export interface StackTraceInfo {
	totalFrames?: number;
	stackFrames: StackFrame[];
}

export interface StackFrame {
	id: number;
	name: string;
	source: { name: string; path: string };
}
