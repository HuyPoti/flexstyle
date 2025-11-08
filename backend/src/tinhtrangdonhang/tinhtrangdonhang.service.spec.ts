import { Test, TestingModule } from '@nestjs/testing';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import { TinhtrangDonhangRepository } from 'src/repositories/tinhtrangdonhang.repository';

describe('TinhtrangDonhangService', () => {
  let service: TinhtrangDonhangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TinhtrangDonhangService,
        {
          provide: TinhtrangDonhangRepository,
          useValue: {
            createOrderStatus: jest.fn(),
            findOrderStatusById: jest.fn(),
            findAllOrderStatuses: jest.fn(),
            getOrderStatusHistory: jest.fn(),
            getCurrentOrderStatus: jest.fn(),
            updateOrderStatus: jest.fn(),
            deleteOrderStatus: jest.fn(),
            deleteAllOrderStatuses: jest.fn(),
            getOrderStatusStatistics: jest.fn(),
            orderExists: jest.fn(),
            getOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TinhtrangDonhangService>(TinhtrangDonhangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
