import { Reflector } from '@nestjs/core';
import { TaiKhoanGuard } from './taikhoan.guard';

describe('TaiKhoanGuard', () => {
  it('should be defined', () => {
    const reflector = {} as Reflector;
    expect(new TaiKhoanGuard(reflector)).toBeDefined();
  });
});
