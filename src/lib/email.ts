// Email notifications - no-op until SMTP is configured
export async function sendAdminNotification(_quote: unknown) {}
export async function sendDepositRequest(
  _email: string, _name: string, _url: string, _amount: number, _date: string
) {}
