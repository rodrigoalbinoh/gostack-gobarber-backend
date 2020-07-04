import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppoinment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppoinment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppoinment.execute({
      date: new Date(),
      user_id: '123132',
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppoinment.execute({
      date: appointmentDate,
      user_id: '123132',
      provider_id: '123123',
    });

    await expect(
      createAppoinment.execute({
        date: appointmentDate,
        user_id: '123132',
        provider_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
