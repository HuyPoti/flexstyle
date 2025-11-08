import { Test, TestingModule } from '@nestjs/testing';
import { DonhangService } from './donhang.service';
import { DonhangRepository } from 'src/repositories/donhang.repository';

describe('DonhangService', () => {
  let service: DonhangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonhangService,
        {
          provide: DonhangRepository,
          useValue: {
            createOrder: jest.fn(),
            findOrderById: jest.fn(),
            findAllOrders: jest.fn(),
            updateOrderStatus: jest.fn(),
            cancelOrder: jest.fn(),
            deleteOrder: jest.fn(),
            getProductDetail: jest.fn(),
            getVoucher: jest.fn(),
            getPromotion: jest.fn(),
            updateProductStock: jest.fn(),
            restoreProductStock: jest.fn(),
            getOrderSummary: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DonhangService>(DonhangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
