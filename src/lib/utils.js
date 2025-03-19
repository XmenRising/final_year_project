export function parseCookies(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    return cookieHeader.split(/;\s*/).reduce((cookies, cookie) => {
      const [name, ...rest] = cookie.split('=');
      if (name?.trim()) {
        cookies[name.trim()] = decodeURIComponent(rest.join('=').trim());
      }
      return cookies;
    }, {});
  } catch (error) {
    console.error('Cookie parsing error:', error);
    return {};
  }
}