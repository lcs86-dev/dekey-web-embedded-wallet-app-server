const _ = require('lodash');

const CustomDB = require('../../db/custom');
const { updateEthLimit } = require("../../service/rule/rule");

describe('rule service', () => {
  describe('updateEthLimit', () => {
    it('should update auth rule value for target key', async done => {
      const address = 'address'
      const perTx = 2 
      const uid = '1424'
      const user = {
        addresses: {
          [address]: {
            rules: {
              limits: {
                eth: {
                  perTx: 1,
                  perDay: 5,
                }
              }
            }
          }
        }
      }
      const putSpy = jest.spyOn(CustomDB, 'put');
      putSpy.mockImplementation(async () => {});

      const response = await updateEthLimit({uid, user, address, perTx});

      const updatedUser = _.cloneDeep(user)
      updatedUser.addresses[address].rules.limits.eth.perTx = perTx
      expect(putSpy).toHaveBeenCalledTimes(1);
      expect(putSpy).toBeCalledWith(uid, updatedUser);
      expect(response).toEqual(updatedUser);

      putSpy.mockClear();
      done();
    });
  });
})