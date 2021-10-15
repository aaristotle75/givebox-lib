import React, {Component} from 'react';
import GBLink from '../../common/GBLink';

class Security extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    const {
      primaryColor
    } = this.props;

    return (
      <div className='modalWrapper'>
        <div className='center'>
          <img className='pciImage' src='https://cdn.givebox.com/givebox/public/images/logo-box.svg' alt='Givebox' height='70px' width='135px' />
        </div>
        <div style={{ paddingBottom: 100 }} className='sectionContent'>
          <h3 style={{ marginBottom: 0 }}>Givebox Security</h3>
          <p>
            The Givebox approach to security is designed to protect both you and your customers. We monitor every transaction, we continuously innovate in fraud prevention, and we protect your data like our business depends on it—because it does. We adhere to industry-leading standards to manage our network, secure our web and client applications, and set policies across our organization.
          </p>
          <h4>Encryption and monitoring</h4>
          <p>
            Givebox enables trusted transactions between you and your customers by making secure payments as simple as possible. We do this by bringing to our sellers the technologies and monitoring that once were only available to the largest of merchants.
          </p>
          <p>
            Givebox encrypts transactions at the point of purchase and tokenizes data once it reaches our servers. We track the purchase as it goes through our software. We monitor your money until it’s deposited into your bank account.
          </p>
          <p>
            In addition, we monitor each transaction to detect suspicious behavior. Givebox uses our algorithms to spot and freeze malicious or suspicious activity. We’re looking out for you and your customers at each step.
          </p>
          <h4>Partners in security</h4>
          <p>
            As the merchant of record for every transaction, which means we’re dedicated to keeping your business safe. We deal with the banks on your behalf and take care of compliance, regulation and processing so you can focus on running your business. We’ll go to bat for you if someone disputes a transaction, and we’ll make sure your money moves quickly and securely into your bank account. Givebox does the heavy lifting. You just focus on your business.
          </p>
          <span className="sectionTitle2">Layered Security</span>
          <p>Card-processing systems adhere to the PCI Data Security Standard (PCI-DSS).</p>
          <h4>Stopping fraud before it happens</h4>
          <p>We stop fraud via live monitoring programs that analyze transactions as they’re happening. This is known as risk visualization. The approach helps us detect and investigate suspicious activity before a fraudulent charge takes place. This method is not only a pioneering way for us to protect merchants, but it’s also a better way to build an automated system to detect criminals that will scale as our business grows.</p>
          <h4>Getting stronger as we grow</h4>
          <p>We’ve designed Givebox to grow stronger the more people transact. The better data set we have to analyze, the smarter our anti-fraud algorithms become. Think of it this way: if cars on a highway drove by only occasionally, it’d be tough to distinguish the ones speeding from the ones travelling within the limit. But on a crowded highway, it’s easy to spot the reckless driver weaving in and out of traffic. Likewise, more Givebox customers allow our proprietary systems to spot the bad guys easily.</p>
          <h4>Secure network, servers, and data</h4>
          <p>Givebox's network and servers are housed in a secure facility monitored around the clock by dedicated security staff.</p>
          <ul>
            <li>Card-processing systems adhere to the PCI Data Security Standard (PCI-DSS).</li>
            <li>Givebox requires sensitive data to be encrypted using industry-leading methods when stored on disk or transmitted over public networks.</li>
            <li>Givebox uses standard, well-reviewed cryptographic protocols and message formats (such as SSL and PGP) when transferring data.</li>
            <li>Givebox requires that cryptographic keys are at least 128 bits long. Asymmetric keys must be at least 2048 bits long.</li>
            <li>Givebox regularly installs security updates and patches on its servers and equipment.</li>
            <li>Security settings of applications and devices are tuned to ensure appropriate levels of protection.</li>
            <li>Networks are strictly segregated according to security level. Modern, restrictive firewalls protect all connections between networks.</li>
          </ul>
          <h4>Web and client application security</h4>
          <p>Givebox's software is developed using industry standard security best practices.</p>
          <ul>
            <li>Card processing applications adhere to PCI Data Security Standard (PCI-DSS) Level 1.</li>
            <li>Givebox prohibits the storage of card numbers, magnetic stripe data, and security codes on client devices.</li>
            <li>Applications developed in-house are subject to strict quality testing and security review.</li>
            <li>Web development follows industry-standard secure coding guidelines, such as those recommended by OWASP.</li>
          </ul>
          <h4>Secure organization from top to bottom</h4>
          <p>Givebox mandates that employees act in accordance with security policies designed to keep merchant data safe.</p>
          <ul>
            <li>Givebox requires sensitive data to be encrypted using industry-standard methods when stored on disk or transmitted over public networks.</li>
            <li>Givebox controls access to sensitive data, application data, and cryptographic keys.</li>
            <li>Two-factor authentication and strong password controls are required for administrative access to systems.</li>
            <li>Security systems and processes are tested on a regular basis by qualified internal and external teams.</li>
            <li>Access to secure services and data is strictly logged, and audit logs are reviewed regularly.</li>
            <li>Security policies and procedures are carefully documented and reviewed on a regular basis.</li>
            <li>Detailed incident response plans have been prepared to ensure proper protection of data in an emergency.</li>
          </ul>
          <h4>Research and Disclosure</h4>
          <p>Givebox recognizes the important contributions that our customers and the security research community can make. We encourage responsible reporting of problems with our service. We also recognize that legitimate and well-intentioned researchers are sometimes blamed for the problems they disclose. In order to encourage responsible reporting practices, we promise not to bring legal action against researchers who point out a problem, provided they:</p>
          <ul>
            <li>Share with us the full details of any problem found.</li>
            <li>Do not disclose the issue to others until we’ve had reasonable time to address it.</li>
            <li>Do not intentionally harm the experience or usefulness of the service to others.</li>
            <li>Never attempt to view, modify, or damage data belonging to others.</li>
          </ul>
          <p>If you believe that you have discovered a vulnerability, please report it at our <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://support.givebox.com')}>Support page</GBLink>.</p>
          <p>If you have any other security issues with your account, contact <a style={{ color: primaryColor }} href="mailto:security@mygivebox.com">security@mygivebox.com</a></p>
        </div>
        <div className='bottomContainer2 flexCenter'>
          <div className='button-group'>
            <GBLink allowCustom={true} customColor={primaryColor} onClick={() => this.props.toggleModal('security', false)}>Close</GBLink>
            <GBLink
              className='button'
              allowCustom={true}
              customColor={primaryColor}
              onClick={() => this.props.toggleModal('security', false)}
              solidColor={true}
            >I FEEL CONFIDENT</GBLink>
          </div>
        </div>
      </div>
    )
  }
};

export default Security;
