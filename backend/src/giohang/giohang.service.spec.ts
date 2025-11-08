import { Test, TestingModule } from '@nestjs/testing';
import { GiohangService } from './giohang.service';
import { PrismaService } from 'src/prisma.service';

describe('GiohangService', () => {
  let service: GiohangService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiohangService,
        {
          provide: PrismaService,
          useValue: {
            gIOHANG: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
            cHITIETGIOHANG: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            cHITIETSANPHAM: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GiohangService>(GiohangService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Add more specific tests for each method
});