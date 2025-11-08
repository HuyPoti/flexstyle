import { Test, TestingModule } from '@nestjs/testing';
import { DonhangController } from './donhang.controller';
import { DonhangService } from './donhang.service';

describe('DonhangController', () => {
  let controller: DonhangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonhangController],
      providers: [
        {
          provide: DonhangService,
          useValue: {
            createOrder: jest.fn(),
            getAllOrders: jest.fn(),
            getOrderById: jest.fn(),
            updateOrderStatus: jest.fn(),
            cancelOrder: jest.fn(),
            deleteOrder: jest.fn(),
            getOrderSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DonhangController>(DonhangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
