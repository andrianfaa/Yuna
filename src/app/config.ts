import { YUNA_PROFILE } from "../profiles/yuna";

/**
 * The selected AI profile for the application. This constant is used to define the system message that will be sent to the AI model at the beginning of each session.
 * It is imported from the profiles directory, allowing for easy customization of the AI's behavior and personality.
 *
 * @constant {string} SELECTED_AI_PROFILE - The system message for the AI model, defining its behavior and personality.
 * @default YUNA_PROFILE - The default profile imported from the profiles directory.
 */
export const SELECTED_AI_PROFILE = YUNA_PROFILE;
