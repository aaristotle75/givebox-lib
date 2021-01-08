
export const defaultCart = {
  processing: false,
  open: false,
  zeroAmountAllowed: false,
  paymethod: 'creditcard',
  cardType: 'default',
  subTotal: 0,
  total: 0,
  fee: 0,
  passFees: false,
  acceptedTerms: true,
  items: [],
  customer: {},
  cardLength: 0
};

export const defaultConfirmation = {
  email: 'jane_smitht@test.com',
  firstname: 'Jane',
  lastname: 'Smith',
  paymethod: 'creditCard',
  bankName: 'US Bank',
  cardType: 'VISA',
  cartTotal: 100
}

export const defaultStyle = {
  gbxStyle: {
    maxWidth: 850,
    primaryColor: '#4385f5',
    bgColor: '',
    textColor: '#253655',
    pageColor: '#ffffff',
    pageRadius: 10,
    pageOpacity: 1,
    backgroundColor: '#4385f5',
    backgroundOpacity: .6,
    placeholderColor: ''
  },
  button: {
    embedAllowed: false,
    enabled: false,
    type: 'button',
    text: 'Button Example',
    style: {
      textColor: '#ffffff',
      bgColor: '#4385f5',
      fontSize: 16,
      borderRadius: 10,
      width: 200,
      align: 'flexCenter'
    }
  },
  embedButton: {
    autoPop: true,
    type: 'button',
    text: 'Button Text',
    textColor: '#ffffff',
    bgColor: '#4385f5',
    fontSize: 16,
    borderRadius: 10,
    textAlign: 'center',
    padding: '10px 20px;'
  }
}
