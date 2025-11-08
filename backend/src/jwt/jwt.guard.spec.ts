import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    const jwtService = {} as JwtService;
    expect(new JwtAuthGuard(jwtService)).toBeDefined();
  });
});
