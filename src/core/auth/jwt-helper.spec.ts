import {inject, TestBed} from '@angular/core/testing';

import {addDays, getTime, subDays} from 'date-fns';

import {JwtHelperService} from './jwt-helper';

declare const CryptoJS: any;

describe('JwtHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtHelperService]
    });
  });

  it(
    'should decode base64 econded strings',
    inject([JwtHelperService], (service: JwtHelperService) => {
      expect(service.urlBase64Decode('dGVzdCBzdHJpbmc=')).toEqual('test string');
    })
  );

  it(
    'should decode a valid JWT',
    inject([JwtHelperService], (service: JwtHelperService) => {
      const token = createToken();
      const decoded = service.decodeToken(token)!;
      expect(decoded.user_id).toEqual(1337);
    })
  );

  it(
    'should extract expiration date from a JWT token',
    inject([JwtHelperService], (service: JwtHelperService) => {
      const exp = addDays(new Date(), 1);
      const token = createToken(getTime(exp));
      const exp1 = Math.floor(+service.getTokenExpirationDate(token)!.getTime() / 1000);
      const exp2 = Math.floor(+exp.getTime() / 1000);
      expect(exp1).toEqual(exp2);
    })
  );

  it(
    'should detect if a token is expired',
    inject([JwtHelperService], (service: JwtHelperService) => {
      const token1 = createToken(getTime(addDays(new Date(), 1)));
      const token2 = createToken(getTime(subDays(new Date(), 1)));
      expect(service.isTokenExpired(token1)).toBeFalsy();
      expect(service.isTokenExpired(token2)).toBeTruthy();
    })
  );
});

function base64url(source: any) {
  // Encode in classical base64
  let encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');

  return encodedSource;
}

function createToken(exp: number = 0) {
  const header = {alg: 'HS256', typ: 'JWT'};

  const data: any = {user_id: 1337, scopes: [], exp};

  const secret = 'My very confidential secret!!!';

  const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  const encodedHeader = base64url(stringifiedHeader);

  const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  const encodedData = base64url(stringifiedData);

  const signature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedData, secret);
  const encodedSignature = base64url(signature);

  return `${encodedHeader}.${encodedData}.${encodedSignature}`;
}
