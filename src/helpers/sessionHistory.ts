import { BaseMessage, SystemMessage } from "langchain";
import { DEFAULT_AI_PROFILE, SESSION_HISTORY_LIMIT } from "../app/config";

const userSessions: Record<string, BaseMessage[]> = {};

const getSessionHistory = (jid: string): BaseMessage[] => {
  if (!userSessions[jid]) {
    userSessions[jid] = [new SystemMessage(DEFAULT_AI_PROFILE)];
  }

  return userSessions[jid];
};

const addMessageToSession = (jid: string, message: BaseMessage): void => {
  const session = getSessionHistory(jid);

  session.push(message);

  if (session.length > SESSION_HISTORY_LIMIT + 1) {
    userSessions[jid] = [
      session[0],
      ...session.slice(Number(`-${SESSION_HISTORY_LIMIT}`)),
    ];
  }
};

const resetSession = (jid: string): void => {
  userSessions[jid] = [new SystemMessage(DEFAULT_AI_PROFILE)];
};

export const sessionHistory = {
  get: (jid: string): BaseMessage[] => getSessionHistory(jid),
  add: (jid: string, message: BaseMessage): void =>
    addMessageToSession(jid, message),
  reset: (jid: string): void => resetSession(jid),
};
