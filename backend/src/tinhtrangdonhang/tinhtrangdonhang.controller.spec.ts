import { Test, TestingModule } from '@nestjs/testing';
import { TinhtrangDonhangController } from './tinhtrangdonhang.controller';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';

describe('TinhtrangDonhangController', () => {
  let controller: TinhtrangDonhangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TinhtrangDonhangController],
      providers: [
        {
          provide: TinhtrangDonhangService,
          useValue: {
            createOrderStatus: jest.fn(),
            updateOrderStatus: jest.fn(),
            getAllOrderStatuses: jest.fn(),
            getOrderStatusById: jest.fn(),
            getOrderStatusHistory: jest.fn(),
            getCurrentOrderStatus: jest.fn(),
            deleteOrderStatus: jest.fn(),
            deleteAllOrderStatuses: jest.fn(),
            getOrderStatusStatistics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TinhtrangDonhangController>(TinhtrangDonhangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
