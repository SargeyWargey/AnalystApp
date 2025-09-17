import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../core/theme/ThemeProvider';
import { themeStyles } from '../../core/theme/styles';

interface TerminalSession {
  id: string;
  name: string;
  workingDirectory: string;
  isActive: boolean;
  output: string;
}

interface TerminalProps {
  workingDirectory?: string;
  onTerminalReady?: (terminalId: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ workingDirectory, onTerminalReady }) => {
  const { theme } = useTheme();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const createNewSession = async () => {
    if (!window.electronAPI) {
      setError('Terminal functionality is only available in the Electron app');
      return;
    }

    try {
      setError('');
      const id = await window.electronAPI.createTerminal(workingDirectory || process.cwd());
      const sessionName = `Terminal ${sessions.length + 1}`;

      const newSession: TerminalSession = {
        id,
        name: sessionName,
        workingDirectory: workingDirectory || process.cwd(),
        isActive: true,
        output: '',
      };

      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(id);

      if (onTerminalReady) {
        onTerminalReady(id);
      }

    } catch (err) {
      setError(`Failed to start terminal: ${err}`);
    }
  };

  const closeSession = async (sessionId: string) => {
    if (!window.electronAPI) {
      setError('Terminal functionality is only available in the Electron app');
      return;
    }

    try {
      await window.electronAPI.destroyTerminal(sessionId);
      setSessions(prev => {
        const updated = prev.filter(s => s.id !== sessionId);
        if (activeSessionId === sessionId && updated.length > 0) {
          setActiveSessionId(updated[0].id);
        } else if (updated.length === 0) {
          setActiveSessionId('');
        }
        return updated;
      });
    } catch (err) {
      setError(`Failed to close terminal: ${err}`);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && activeSessionId && window.electronAPI) {
      const input = e.currentTarget;
      const command = input.value;

      if (command.trim()) {
        try {
          await window.electronAPI.writeToTerminal(activeSessionId, command + '\r');
          input.value = '';
        } catch (err) {
          setError(`Failed to execute command: ${err}`);
        }
      }
    }
  };

  useEffect(() => {
    // Only set up terminal listeners in Electron environment
    if (window.electronAPI) {
      // Set up terminal output listener
      window.electronAPI.onTerminalData((data: any) => {
        setSessions(prev => prev.map(session => {
          if (session.id === data.terminalId) {
            return {
              ...session,
              output: session.output + data.data,
            };
          }
          return session;
        }));
      });

      return () => {
        // Clean up all sessions on unmount
        sessions.forEach(session => {
          window.electronAPI.destroyTerminal(session.id);
        });
      };
    }
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className={`h-full flex flex-col ${themeStyles.card[theme]} rounded-lg`}>
      {/* Header with controls */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-semibold ${themeStyles.text.primary[theme]}`}>
            Terminal
          </h3>
          <div className="flex gap-2">
            <button
              onClick={createNewSession}
              className="px-3 py-1 text-sm bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-md transition-colors"
            >
              New Terminal
            </button>
            {activeSession && (
              <button
                onClick={() => closeSession(activeSession.id)}
                className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {workingDirectory && (
          <div className={`text-xs ${themeStyles.text.muted[theme]} truncate`}>
            Working directory: {workingDirectory}
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Terminal tabs */}
      {sessions.length > 0 && (
        <div className="flex border-b border-white/10 bg-black/10">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer border-r border-white/10 ${
                session.id === activeSessionId
                  ? 'bg-purple-500/20 text-purple-300'
                  : `${themeStyles.text.secondary[theme]} hover:bg-white/5`
              }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <span className="mr-2">⚡</span>
              <span className="truncate max-w-24">{session.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeSession(session.id);
                }}
                className="ml-2 hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Terminal content */}
      <div className="flex-1 flex flex-col min-h-0" ref={terminalRef}>
        {activeSession ? (
          <>
            <div className={`flex-1 p-4 font-mono text-sm overflow-y-auto ${themeStyles.text.primary[theme]} bg-black/20`}>
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: activeSession.output.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
                }}
              />
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex items-center">
                <span className={`mr-2 ${themeStyles.text.muted[theme]} font-mono text-sm`}>
                  $
                </span>
                <input
                  type="text"
                  placeholder="Type a command..."
                  onKeyDown={handleKeyDown}
                  className={`flex-1 bg-transparent border-none outline-none font-mono text-sm ${themeStyles.text.primary[theme]} placeholder-gray-500`}
                  autoFocus
                />
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${themeStyles.text.muted[theme]}`}>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              {window.electronAPI ? (
                <>
                  <p>Click "New Terminal" to start your first session</p>
                  {workingDirectory && (
                    <p className="text-xs mt-2">Terminal will start in: {workingDirectory}</p>
                  )}
                </>
              ) : (
                <>
                  <p>Terminal functionality is only available in the Electron app</p>
                  <p className="text-xs mt-2">Run `npm run electron:dev` to start the full application</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;