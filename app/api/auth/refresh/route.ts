import { NextRequest, NextResponse } from 'next/server';
import { baseURL } from '@/config';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token manquant' },
        { status: 400 }
      );
    }

    // Appeler l'API backend pour refresh le token
    const response = await fetch(`${baseURL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: 'Échec du refresh du token', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
  } catch (error) {
    console.error('Erreur lors du refresh du token:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}