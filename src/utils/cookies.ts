export const extractCookieFromCookies = (cookiesString: string | undefined, cookieName: string) => {

    if (!cookiesString)
        return null

    const cookies = cookiesString.split("; ")

    for (let i = 0; i < cookies.length; i++) {

        const cookie = cookies[i]

        if (cookie.search(cookieName + '=') > -1)
            return cookie.split("=").at(-1)

    }

    return null

}