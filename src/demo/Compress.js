import React from 'react';
import { connect } from 'react-redux';
import LZString from 'lz-string';

class Compress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
    } = this.props;

    const jsonobj = {"processing":false,"open":true,"zeroAmountAllowed":false,"paymethod":"creditcard","cardType":"default","subTotal":597,"total":"615.77","fee":18.77,"passFees":true,"acceptedTerms":true,"items":[{"unitID":421750,"articleTitle":"Hello World T","articleImageURL":"https://givebox-staging.s3.amazonaws.com/gbx%2Fe8f5b9c14c894174a01a707aabee1e1b%2F2021-01-11%2Fn-philanthropy-large-jpg%2Foriginal","name":"Custom Amount","priceper":3200,"customAmount":true,"quantity":1,"availableQty":10,"maxQuantity":10,"allowQtyChange":false,"allowMultiItems":false,"interval":"once","paymentMax":"","frequency":1,"isPublic":true,"amount":3200,"fees":{"ID":9,"type":"enterprise","pctFee":490,"fixFee":30,"incPctFee":490,"incFixFee":30,"fndPctFee":290,"fndFixFee":29,"amexIncPctFee":490,"amexIncFixFee":30,"amexFndPctFee":350,"amexFndFixFee":35,"debitPctFee":190,"debitFixFee":29,"echeckPctFee":290,"echeckFixFee":29,"applePayPctFee":290,"applePayFixFee":29,"androidPayPctFee":290,"androidPayFixFee":29,"CRFTFeePct":200,"CRFTFeePctMin":100,"CRFTFeePctMax":500,"creditLineInterestFeePct":0,"platformFeePct":0,"createdAt":1518543537,"updatedAt":1610442293},"amountFormatted":32,"articleID":383624,"orgName":"Service Dogs of America","orgID":185,"articleKind":"fundraiser","kindID":382936,"orderBy":1,"passFees":true},{"unitID":421752,"articleTitle":"Hello World 12","articleImageURL":"https://givebox-staging.s3.amazonaws.com/gbx%2F376cd9e74503825e2c4d9d7c5ecd0aec%2F2021-01-07%2Fimg-1793-jpg%2Foriginal","name":"Donation","priceper":10000,"customAmount":false,"quantity":1,"availableQty":10,"maxQuantity":10,"allowQtyChange":false,"allowMultiItems":false,"interval":"once","paymentMax":"","frequency":1,"isPublic":true,"amount":10000,"fees":{"ID":9,"type":"enterprise","pctFee":490,"fixFee":30,"incPctFee":490,"incFixFee":30,"fndPctFee":290,"fndFixFee":29,"amexIncPctFee":490,"amexIncFixFee":30,"amexFndPctFee":350,"amexFndFixFee":35,"debitPctFee":190,"debitFixFee":29,"echeckPctFee":290,"echeckFixFee":29,"applePayPctFee":290,"applePayFixFee":29,"androidPayPctFee":290,"androidPayFixFee":29,"CRFTFeePct":200,"CRFTFeePctMin":100,"CRFTFeePctMax":500,"creditLineInterestFeePct":0,"platformFeePct":0,"createdAt":1518543537,"updatedAt":1610442293},"amountFormatted":100,"articleID":383619,"orgName":"Service Dogs of America","orgID":185,"articleKind":"fundraiser","kindID":382931,"orderBy":2,"passFees":true},{"unitID":471,"articleTitle":"Wine and dine with Buddy","articleImageURL":"https://givebox-staging.s3.amazonaws.com/gbx%2Fb2930be7141229ae016e41e83c27363d%2F2020-04-01%2Fimage-png%2Foriginal","name":"Custom Amount","priceper":3200,"customAmount":true,"quantity":1,"availableQty":10,"maxQuantity":10,"allowQtyChange":false,"allowMultiItems":false,"interval":"once","paymentMax":"","frequency":1,"isPublic":true,"amount":3200,"fees":{"ID":9,"type":"enterprise","pctFee":490,"fixFee":30,"incPctFee":490,"incFixFee":30,"fndPctFee":290,"fndFixFee":29,"amexIncPctFee":490,"amexIncFixFee":30,"amexFndPctFee":350,"amexFndFixFee":35,"debitPctFee":190,"debitFixFee":29,"echeckPctFee":290,"echeckFixFee":29,"applePayPctFee":290,"applePayFixFee":29,"androidPayPctFee":290,"androidPayFixFee":29,"CRFTFeePct":200,"CRFTFeePctMin":100,"CRFTFeePctMax":500,"creditLineInterestFeePct":0,"platformFeePct":0,"createdAt":1518543537,"updatedAt":1610442293},"amountFormatted":32,"articleID":739,"orgName":"Service Dogs of America","orgID":185,"articleKind":"fundraiser","kindID":281,"orderBy":3,"passFees":true},{"unitID":421988,"articleTitle":"Elephant puzzle GBX3 editor","articleImageURL":"https://cdn.givebox.com/givebox/assets/img/fundraiser-cover/original","name":"Test Tick Sale","hasMax":true,"quantity":4,"availableQty":10,"maxQuantity":10,"allowQtyChange":true,"allowMultiItems":true,"thumbnailURL":"","priceper":100,"interval":null,"paymentMax":"","frequency":1,"isPublic":true,"amount":400,"fees":{"ID":9,"type":"enterprise","pctFee":490,"fixFee":30,"incPctFee":490,"incFixFee":30,"fndPctFee":290,"fndFixFee":29,"amexIncPctFee":490,"amexIncFixFee":30,"amexFndPctFee":350,"amexFndFixFee":35,"debitPctFee":190,"debitFixFee":29,"echeckPctFee":290,"echeckFixFee":29,"applePayPctFee":290,"applePayFixFee":29,"androidPayPctFee":290,"androidPayFixFee":29,"CRFTFeePct":200,"CRFTFeePctMin":100,"CRFTFeePctMax":500,"creditLineInterestFeePct":0,"platformFeePct":0,"createdAt":1518543537,"updatedAt":1610442293},"amountFormatted":4,"articleID":390920,"orgName":"Service Dogs of America","orgID":185,"articleKind":"event","kindID":274,"orderBy":4,"passFees":true},{"unitID":422000,"articleTitle":"New Event","articleImageURL":"https://cdn.givebox.com/givebox/assets/img/fundraiser-cover/original","name":"Event Ticket","hasMax":true,"quantity":3,"availableQty":10,"maxQuantity":10,"allowQtyChange":true,"allowMultiItems":true,"thumbnailURL":"","priceper":14300,"interval":null,"paymentMax":"","frequency":1,"isPublic":true,"amount":42900,"fees":{"ID":9,"type":"enterprise","pctFee":490,"fixFee":30,"incPctFee":490,"incFixFee":30,"fndPctFee":290,"fndFixFee":29,"amexIncPctFee":490,"amexIncFixFee":30,"amexFndPctFee":350,"amexFndFixFee":35,"debitPctFee":190,"debitFixFee":29,"echeckPctFee":290,"echeckFixFee":29,"applePayPctFee":290,"applePayFixFee":29,"androidPayPctFee":290,"androidPayFixFee":29,"CRFTFeePct":200,"CRFTFeePctMin":100,"CRFTFeePctMax":500,"creditLineInterestFeePct":0,"platformFeePct":0,"createdAt":1518543537,"updatedAt":1610442293},"amountFormatted":429,"articleID":390929,"orgName":"Service Dogs of America","orgID":185,"articleKind":"event","kindID":280,"orderBy":5,"passFees":true}],"customer":{},"cardLength":0,"CRFTFee":null};

    const compressed = LZString.compressToUTF16(JSON.stringify(jsonobj));
    const decompressed = LZString.decompressFromUTF16(compressed);

    console.log('execute -> ', compressed, decompressed);

    return (
      <div>
        Compress {jsonobj.paymethod}
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
  }
}

export default connect(mapStateToProps, {
})(Compress);
