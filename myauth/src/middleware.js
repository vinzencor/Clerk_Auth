import { NextResponse } from 'next/server'
import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server'

export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== '/') {
      const orgSelection = new URL('/', req.url)
      return NextResponse.redirect(orgSelection)
    }
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next()
    }
    return NextResponse.next()
  },
})