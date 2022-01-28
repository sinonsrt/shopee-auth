const { HmacSHA256 } = require('crypto-js');
require('dotenv').config();

const partner_id = process.env.PARTNER_ID;
const partner_token = process.env.PARTNER_TOKEN;
const shop_id = process.env.SHOP_ID;
const code = process.env.CODE;
const base_url = 'https://partner.shopeemobile.com';
const test_base_url = 'https://partner.test-stable.shopeemobile.com';
const timestamp = Math.floor(new Date().getTime() / 1000);

const PATH = {
  auth: '/api/v2/shop/auth_partner',
  accessToken: '/api/v2/auth/token/get',
  refreshToken: '/api/v2/auth/access_token/get',
};

const getUrl = ({ url, path, redirect, sign }) =>
  `${url}${path}?partner_id=${partner_id}&timestamp=${timestamp}${
    redirect ? `&redirect=${redirect}` : ''
  }&sign=${sign}`;
const getSignature = (...params) => {
  const baseString = params.reduce(
    (prev, current) => `${prev}${current}`,
    `${partner_id}`
  );

  const sign = HmacSHA256(baseString, partner_token).toString();

  return sign;
};

(async () => {
  const authSign = getSignature(PATH.auth, timestamp);
  const accessTokenSign = getSignature(
    PATH.accessToken,
    timestamp,
    test_base_url
  );
  const refreshTokenSign = getSignature(PATH.refreshToken, timestamp);

  const authUrl = getUrl({
    url: test_base_url,
    path: PATH.auth,
    sign: authSign,
  });

  const accessTokenURL = getUrl({
    url: test_base_url,
    path: PATH.accessToken,
    sign: accessTokenSign,
    redirect: test_base_url,
  });

  const refreshTokenURL = getUrl({
    url: test_base_url,
    path: PATH.refreshToken,
    sign: refreshTokenSign,
  });

  console.log({ authUrl, accessTokenURL, refreshTokenURL });
})();

// axios
//   .get(getOrderList_url, {
//     params: {
//       time_range_field: 'create_time',
//       time_from: '1643028232',
//       time_to: '1643201040',
//       page_size: 20,
//       response_optional_fields: 'order_status',
//     },
//   })
//   .then((data) => {
//     console.log('RESPOSTA ---> ', JSON.stringify(data.data, null, 2));
//   })
//   .catch((error) => {
//     console.log('ERRO ---> ', error.response.data);
//   });

//https://seller.shopee.com.br/edu/article/6516
