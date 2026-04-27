import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "ZUWAndaku Backend API is running!"', () => {
      expect(appController.getHello()).toBe('ZUWAndaku Backend API is running!');
    });
  });
});
