import { Test, TestingModule } from '@nestjs/testing';
import { GiohangController } from './giohang.controller';
import { GiohangService } from './giohang.service';

describe('GiohangController', () => {
  let controller: GiohangController;
  let service: GiohangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GiohangController],
      providers: [
        {
          provide: GiohangService,
          useValue: {
            addToCart: jest.fn(),
            getCartItems: jest.fn(),
            updateQuantity: jest.fn(),
            removeFromCart: jest.fn(),
            getItemsForPurchase: jest.fn(),
            clearCart: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GiohangController>(GiohangController);
    service = module.get<GiohangService>(GiohangService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TODO: Add more specific tests for each endpoint
});