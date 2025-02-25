class TokenExpiration {
  private static readonly SECOND = 1000;
  private static readonly MINUTE = this.SECOND * 60;
  private static readonly HOUR = this.MINUTE * 60;
  private static readonly DAY = this.HOUR * 24;

  static generate(
    value: number,
    unit: 'seconds' | 'minutes' | 'hours' | 'days',
  ) {
    let ms: number;

    switch (unit) {
      case 'seconds':
        ms = value * this.SECOND;
        break;
      case 'minutes':
        ms = value * this.MINUTE;
        break;
      case 'hours':
        ms = value * this.HOUR;
        break;
      case 'days':
        ms = value * this.DAY;
        break;
    }

    return {
      expiresIn: this.msToJwtFormat(value, unit),
      expiresInMs: ms,
    };
  }

  private static msToJwtFormat(value: number, unit: string): string {
    return `${value}${unit.charAt(0)}`; // 1h, 14d 등의 형식
  }
}

export const AUTH_CONSTANTS = {
  ACCESS_TOKEN: TokenExpiration.generate(1, 'minutes'),
  REFRESH_TOKEN: TokenExpiration.generate(2, 'minutes'),
  COOKIE_OPTIONS: {
    httpOnly: true,
    sameSite: 'lax' as const,
  },
} as const;
