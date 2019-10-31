import { Test, TestingModule } from '@nestjs/testing';
import { HelloworldService } from './helloworld.service';

describe('ConnectormanagementService', () => {
  let service: HelloworldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloworldService],
    }).compile();

    service = module.get<HelloworldService>(HelloworldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
