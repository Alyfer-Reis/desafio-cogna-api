import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import User from 'src/domain/entity/User';
import UserRepositoryMemory from 'src/infra/repository/memory/user-repository.memory';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepositoryMemory;
  let module: TestingModule;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    repository = new UserRepositoryMemory();

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UserRepositoryInterface',
          useValue: repository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await module.close();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123',
      };

      await service.register(input);

      const user = await repository.findByEmail(input.email);
      expect(user).toBeDefined();
      expect(user?.name).toBe(input.name);
    });

    it('should throw NotFoundException if user already exists', async () => {
      const input = {
        name: 'Existing User',
        email: 'exists@example.com',
        password: 'password',
      };

      const existingUser = await User.create(input);
      await repository.create(existingUser);

      await expect(service.register(input)).rejects.toThrow(
        new NotFoundException('Usuário já existe'),
      );
    });
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      const password = 'correct_password';
      const user = await User.create({
        name: 'Tester',
        email: 'test@login.com',
        password: password,
      });
      await repository.create(user);

      // Act
      const result = await service.login({
        email: 'test@login.com',
        password: password,
      });

      // Assert
      expect(result).toHaveProperty('token', 'mocked-jwt-token');
      expect(result.user.email).toBe('test@login.com');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('should throw UnauthorizedException for non-existent email', async () => {
      await expect(
        service.login({ email: 'wrong@email.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const user = await User.create({
        name: 'Tester',
        email: 'test@wrong-pass.com',
        password: 'correct_password',
      });
      await repository.create(user);

      await expect(
        service.login({
          email: 'test@wrong-pass.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(new UnauthorizedException('Credenciais inválidas'));
    });
  });
});
