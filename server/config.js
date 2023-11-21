module.exports = {
  bucket: 'oss-test1537', //'gunson',
  region: 'oss-cn-hangzhou',
  AccessKeyId: 'LTAI5tLzTyispN7fyysN6cy2',
  AccessKeySecret: 'xuJ3d5OdlHU7qiCJcYoyNqQPIJwIBz',
  RoleArn: 'acs:ram::1535854774907827:role/ramosstest',
  // 建议 Token 失效时间为 1 小时
  TokenExpireTime: '3600',
  PolicyFile: 'policy/all_policy.txt',
};
