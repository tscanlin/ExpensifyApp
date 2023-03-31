import Onyx from 'react-native-onyx';
import ONYXKEYS from '../../src/ONYXKEYS';
import formatPhoneNumber from '../../src/libs/formatPhoneNumber';
import waitForPromisesToResolve from '../utils/waitForPromisesToResolve';

const ES_NUMBER = '+34702474537';
const US_NUMBER = '+18332403627';

describe('formatPhoneNumber', () => {
    beforeAll(() => Onyx.init({
        keys: ONYXKEYS,
    }));

    describe('when the current user has a phone number', () => {
        beforeEach(() => Onyx.multiSet({
            [ONYXKEYS.SESSION]: {email: 'current@user.com'},
            [ONYXKEYS.COUNTRY_CODE]: 34,
            [ONYXKEYS.PERSONAL_DETAILS]: {'current@user.com': {phoneNumber: US_NUMBER}},
        }).then(waitForPromisesToResolve));

        afterEach(() => Onyx.clear());

        it('Should display a number from the same region formatted locally', () => {
            expect(formatPhoneNumber(US_NUMBER)).toBe('(833) 240-3627');
        });

        it('Should display a number from another region formatted internationally', () => {
            expect(formatPhoneNumber(ES_NUMBER)).toBe('+34 702 47 45 37');
        });
    });

    describe('when the current user does not have a phone number', () => {
        beforeEach(() => Onyx.multiSet({
            [ONYXKEYS.SESSION]: {email: 'current@user.com'},
            [ONYXKEYS.COUNTRY_CODE]: 34,
            [ONYXKEYS.PERSONAL_DETAILS]: {'current@user.com': {phoneNumber: ''}},
        }).then(waitForPromisesToResolve));

        afterEach(() => Onyx.clear());

        it('should display a number from the same region formatted locally', () => {
            expect(formatPhoneNumber(ES_NUMBER)).toBe('702 47 45 37');
        });

        it('should display a number from another region formatted internationally', () => {
            expect(formatPhoneNumber(US_NUMBER)).toBe('+1 833-240-3627');
        });
    });
});
