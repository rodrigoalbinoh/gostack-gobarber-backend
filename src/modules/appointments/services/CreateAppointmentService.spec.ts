import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppoinment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const appointment = await createAppoinment.execute({
      date: new Date(),
      provider_id: '123123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');

  });

  it('should not be able to create a two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppoinment = new CreateAppointmentService(
      fakeAppointmentsRepository
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    const appointment = await createAppoinment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    });

    expect(createAppoinment.execute({
      date: appointmentDate,
      provider_id: '123123123',
    })).rejects.toBeInstanceOf(AppError);

  });

});
