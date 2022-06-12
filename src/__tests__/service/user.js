const CustomDB = require('../../db/custom');
const { lockAccount, unlockAccount } = require('../../service/user');

describe('user service', () => {
  describe('lock', () => {
    it('should add accessToken', async done => {
      const user = {lockedSessionJwts: []}
      const uid = 'uid'
      const accessToken = 'access-token'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return user
      });
      putSpy.mockImplementation(async () => {});

      const response = await lockAccount({uid, accessToken});

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toBeCalledWith(uid);
      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).not.toBeCalledWith(uid, user);
      expect(response).toEqual(undefined);

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });

    it('should not add accessToken', async done => {
      const accessToken = 'access-token'
      const user = {lockedSessionJwts: [accessToken]}
      const uid = 'uid'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return user
      });
      putSpy.mockImplementation(async () => {});

      try {
        const response = await lockAccount({uid, accessToken});
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toBeCalledWith(uid);
        expect(putSpy).toHaveBeenCalledTimes(0);
        expect(response).toEqual(undefined);
      } catch (error) {
        expect(error).toEqual(Error('Given accessToken is already in locked jwt list'));
      }

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });

    it('should return error response', async done => {
      const accessToken = 'access-token'
      const uid = 'uid'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return null
      });
      putSpy.mockImplementation(async () => {});

      try {
        await lockAccount({uid, accessToken});
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toBeCalledWith(uid);
        expect(putSpy).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(error).toEqual(Error('User not found'));
      }

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });
  });

  describe('unlock', () => {
    it('should remove locked token', async done => {
      const accessToken = 'access-token'
      const user = {lockedSessionJwts: [accessToken]}
      const uid = 'uid'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return user
      });
      putSpy.mockImplementation(async () => {});

      const response = await unlockAccount({uid, accessToken});

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toBeCalledWith(uid);
      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).toBeCalledWith(uid, {lockedSessionJwts: []});
      expect(response).toEqual(undefined);

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });

    it('should NOT remove locked token', async done => {
      const accessToken = 'access-token'
      const user = {lockedSessionJwts: [accessToken]}
      const uid = 'uid'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return user
      });
      putSpy.mockImplementation(async () => {});

      try {
        await unlockAccount({uid, accessToken: 'another-token'});
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toBeCalledWith(uid);
        expect(putSpy).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(error).toEqual(Error('Given accessToken is NOT in locked jwt list'));
      }

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });

    it('should return error response', async done => {
      const accessToken = 'access-token'
      const uid = 'uid'

      const getSpy = jest.spyOn(CustomDB, 'get');
      const putSpy = jest.spyOn(CustomDB, 'put');
      getSpy.mockImplementation(async (key) => {
        return null
      });
      putSpy.mockImplementation(async () => {});

      try {
        await lockAccount({uid, accessToken});
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toBeCalledWith(uid);
        expect(putSpy).toHaveBeenCalledTimes(0);
      } catch (error) {
        expect(error).toEqual(Error('User not found'));
      }

      getSpy.mockClear();
      putSpy.mockClear();
      done();
    });
  });
})