import { spawn } from "node-pty";
import path from "path";
const SHELL = "bash";

class TerminalManager {
    constructor() {
        this.sessions = {};
    }

    createPty(id, projectID, onData) {
        if (this.sessions[id]) return;
        
        console.log(`Creating terminal session for ID: ${id}`);
        try {
            const term = spawn(SHELL, [], {
                cols: 100,
                name: "xterm",
                cwd: process.env.WORKING_DIRECTORY || '/tmp', // Fallback to a safe default
            });
    
            term.on("data", (data) => onData(data, term.pid));
            term.on("exit", () => {
                console.log(`Terminal session exited for ID: ${id}`);
                this.clear(id);
            });
    
            this.sessions[id] = { terminal: term, projectID };
            return term;
        } catch (err) {
            console.error(`Failed to create terminal session for ID: ${id}. Error: ${err.message}`);
            throw err;
        }
    }
    
    

    write(terminalId, {data}) {
        const session = this.sessions[terminalId];
        if (!session) {
            throw new Error(`No terminal session found on ID: ${terminalId}`);
        }

        session.terminal.write(data);
    }

    clear(terminalId) {
        const session = this.sessions[terminalId];
        if (!session) {
            throw new Error(`No terminal session found on ID: ${terminalId}`);
        }
        console.log(`Clearing terminal session: ${terminalId}`);
        session.terminal.kill();
        delete this.sessions[terminalId];
    }
    
}

export default TerminalManager;
