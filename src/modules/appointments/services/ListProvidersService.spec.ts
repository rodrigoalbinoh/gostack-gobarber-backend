import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@example.com',
      password: '123456',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'john_tre@example.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'john_Qua@example.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
