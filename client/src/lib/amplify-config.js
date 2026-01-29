import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_WChsS4PoO',
      userPoolClientId: '36per9ig50f4ac9o5scso0s493',
      signUpVerificationMethod: 'code'
    }
  },
  Storage: {
    S3: {
      region: 'us-east-1',
      bucket: 'digital-vault-user-images-placeholder',
    }
  }
}, { ssr: true });