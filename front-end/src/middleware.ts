import { NextRequest, NextResponse } from 'next/server';
import { getCookieServer } from '@/lib/cookieServer';
import { api } from '@/services/api';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname === '/') {
    return NextResponse.next();
  }

  const token = await getCookieServer();

  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const userData = await validateToken(token);

    if (!userData) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const userRole = userData.role;

    if (pathname === '/dashboard/unauthorized') {
      return NextResponse.next();
    }

    const hasPermission = await checkPermission(userRole, pathname);

    if (!hasPermission) {
      if (pathname === '/dashboard' || pathname === '/dashboard/') {
        const firstAllowedRoute = await getFirstAllowedRoute(userRole);
        return NextResponse.redirect(new URL(firstAllowedRoute, req.url));
      }

      return NextResponse.redirect(new URL('/dashboard/unauthorized', req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

async function validateToken(token: string) {
  if (!token) return null;

  try {
    const response = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    return null;
  }
}

async function checkPermission(
  userRole: string,
  pathname: string
): Promise<boolean> {
  try {
    if (userRole === 'ADMIN') {
      return true;
    }

    const response = await api.get('/permissions/check', {
      params: {
        role: userRole,
        route: pathname,
      },
    });

    return response.data.hasPermission;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
}

async function getFirstAllowedRoute(userRole: string): Promise<string> {
  try {
    const response = await api.get('/permissions/first-route', {
      params: {
        role: userRole,
      },
    });

    return response.data.route;
  } catch (error) {
    console.error('Erro ao obter primeira rota permitida:', error);
    return '/dashboard/unauthorized';
  }
}
