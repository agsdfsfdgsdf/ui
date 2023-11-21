const express = require('express');
const { STS } = require('ali-oss');
const fs = require('fs');

const app = express();
const path = require('path');
const conf = require('./config');

app.get('/sts', (req, res) => {
  console.log(conf);
  let policy;
  if (conf.PolicyFile) {
    policy = fs.readFileSync(path.resolve(__dirname, conf.PolicyFile)).toString('utf-8');
  }

  const client = new STS({
    accessKeyId: conf.AccessKeyId,
    accessKeySecret: conf.AccessKeySecret,
  });

  client
    .assumeRole(conf.RoleArn, policy, conf.TokenExpireTime)
    .then((result) => {
      console.log(result);
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-METHOD', 'GET');
      res.json({
        region: conf.region,
        bucket: conf.bucket,
        AccessKeyId: result.credentials.AccessKeyId,
        AccessKeySecret: result.credentials.AccessKeySecret,
        SecurityToken: result.credentials.SecurityToken,
        Expiration: result.credentials.Expiration,
        // region: 'oss-cn-beijing',//conf.region,
        // bucket: 'ycccccc',//conf.bucket,
        // AccessKeyId: 'STS.NSjMfE7GYvH7ngYM8xHYbJHXt',//result.credentials.AccessKeyId,
        // AccessKeySecret: '4Z9UrEbqB4dpfX7DtAodFKFRBarn9YjMERynFBTfXfPT',//result.credentials.AccessKeySecret,
        // SecurityToken: 'CAIS7QF1q6Ft5B2yfSjIr5DfBtzx2ph4wYrcbEHoqTgtRNZOpY3zljz2IHFNe3lhBe8fsP00mmhQ7v8clq5oV4QAQlffNSj5QnrVqVHPWZHInuDox55m4cTXNAr+Ihr/29CoEIedZdjBe/CrRknZnytou9XTfimjWFrXWv/gy+QQDLItUxK/cCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Ig1DMit/zmmZPDtUGG3GeXkLFF+97DRbG/dNRpMZtFVNO44fd7bKKp0lQLukEVpPYq0/UaoGyZ5onFWgdLjA6aKK/T6cZ/uIKor3W0nscagAFuouPz0/LWSLA1CUhVMONIpERlbzV7zKcTEKrNn3wEXIHHwtSPp/O+9/+Fmn2uTtgKcCWZkgUZWXPWtPrwy5k5Zc7r2FZUVmPx/lASxvqqK14h7c3mWsxkXXE5wn1su7jvINE/vf44GGAsS7bEeWMatqLwr3oztVPM04Z7o8lMTg==',//result.credentials.SecurityToken,
        // Expiration: 1800//result.credentials.Expiration,
        // region: 'oss-cn-hangzhou',
        // bucket: 'gunson',
        // AccessKeyId: 'STS.NTdjvKNdCjCiFe9BH92QDJFqW',
        // AccessKeySecret: 'AtuXq413cxw2bMKr91tH1oDeTgvRXaJhXjRAJGrRBWDi',
        // SecurityToken: 'CAIS8wF1q6Ft5B2yfSjIr5fRIcz/o7ti3YGCREOIpkhsPt5opYPatTz2IHlFf3lgAuwcsv8+mW1W5vwdlqNpQppCXlfYYNBstj72IOIjO9ivgde8yJBZor/HcDHhJnyW9cvWZPqDP7G5U/yxalfCuzZuyL/hD1uLVECkNpv74vwOLK5gPG+CYCFBGc1dKyZ7tcYeLgGxD/u2NQPwiWeiZygB+CgE0D4ktPTinpLDtkuG0w2gldV4/dqhfsKWCOB3J4p6XtuP2+h7S7HMyiY46WIRrfYt3PwfpW2b5YDAXgcBuUqcUfDd99p0NxN0fbQqwCGPNjAPIJcagAEVzFb+FKyvzUZ1GaSF1qtvstzm0l4MjSy3GA2ZmSKWm5E28WOXO2HaFk07mWhoAhmfL6YU5xJN4BosgWLzh8gmiLtUkFgF5bNLdb4VQTELAoJQK2IeSZWUr+wk1H/Ou20vxY6+eyHamHGzagEiKFk6cKxlzE93R+FxG1VwvXyI0Q==',
        // Expiration: 1800
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

app.use('/static', express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

app.listen(9000, () => {
  console.log('App started.');
});
