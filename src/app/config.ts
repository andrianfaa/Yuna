import {
  YUNA_FEATURES_AND_TOOLS,
  YUNA_PROFILE,
  YUNA_STICKER_PACK,
} from "../profiles/yuna";

/**
 * DEFAULT_AI_PROFILE is the default AI profile used in the application. It is set to YUNA_PROFILE, which defines the characteristics and behavior of the AI assistant named "Yuna".
 */
export const DEFAULT_AI_PROFILE = YUNA_PROFILE;

/**
 * DEFAULT_FEATURES_AND_TOOLS is the default set of features and tools used in the application. It is set to YUNA_FEATURES_AND_TOOLS, which defines the available features and tools for the AI assistant named "Yuna".
 */
export const DEFAULT_FEATURES_AND_TOOLS = YUNA_FEATURES_AND_TOOLS;

/**
 * DEFAULT_STICKER_PACK is the default sticker pack used in the application. It is set to YUNA_STICKER_PACK, which defines the sticker pack created by the AI assistant named "Yuna".
 */
export const DEFAULT_STICKER_PACK = YUNA_STICKER_PACK;

/**
 * SESSION_HISTORY_LIMIT defines the maximum number of messages to retain in the session history for each user. When the limit is exceeded, older messages will be removed to maintain the specified limit.
 */
export const SESSION_HISTORY_LIMIT = 19;
