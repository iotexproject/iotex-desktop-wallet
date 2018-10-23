export class DIALOGUE_ACTIONS {

  static get SHOW_MESSAGE() {
    return 'show_message';
  }

}

export function showMessage(message) {
  return {
    type: DIALOGUE_ACTIONS.SHOW_MESSAGE,
    payload: {
      message,
    },
  };
}
