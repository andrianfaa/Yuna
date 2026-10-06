import { BaseMessage, SystemMessage } from "langchain";
import { SELECTED_AI_PROFILE } from "../app/config";

const userSessions: Record<string, BaseMessage[]> = {};

const getSessionHistory = (jid: string): BaseMessage[] => {
  if (!userSessions[jid]) {
    userSessions[jid] = [new SystemMessage(SELECTED_AI_PROFILE)];
  }

  console.log(`Session history for ${jid}:`, userSessions[jid]);

  return userSessions[jid];
};

const addMessageToSession = (jid: string, message: BaseMessage): void => {
  const session = getSessionHistory(jid);

  session.push(message);

  if (session.length > 20) {
    userSessions[jid] = [session[0], ...session.slice(-19)];
  }
};

const resetSession = (jid: string): void => {
  userSessions[jid] = [new SystemMessage(SELECTED_AI_PROFILE)];
};

export const sessionHistory = {
  get: (jid: string): BaseMessage[] => getSessionHistory(jid),
  add: (jid: string, message: BaseMessage): void =>
    addMessageToSession(jid, message),
  reset: (jid: string): void => resetSession(jid),
};
