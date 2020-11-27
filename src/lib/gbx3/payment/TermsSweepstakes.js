import React, {Component} from 'react';
import GBLink from '../../common/GBLink';
import Collapse from '../../common/Collapse';
import Icon from '../../common/Icon';
import { FiGift } from 'react-icons/fi';

class TermsSweepstakes extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const {
      primaryColor
    } = this.props;

    return (
        <Collapse
          label={'Sweepstakes Terms and Conditions'}
          customIcon={<Icon><FiGift /></Icon>}
          id={'sweepstakes-terms'}
        >
          <div className="sectionContent">
            <h3>Sweepstakes Official Rules</h3>
            <h4>LEGAL STUFF</h4>
            <p>Please review our <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://Givebox.com/privacy')}>Privacy Policy</GBLink>, which also governs your visit to our website, to understand our practices.</p>
            <h4>ELECTRONIC COMMUNICATIONS</h4>
            <p>Part of Givebox is a fundraising platform and SaaS that leverages the power of social impact and technology to radically change charitable giving. Individuals and charities donates incredible prizes and opportunities to raise money for worthy causes, and Givebox Inc. allows anybody to enter a sweepstakes and have an equal chance of winning. And everything is legal and legit. There are lots of laws in place to protect our donors and and ensure everything{`'`}s fair. So please enjoy these long, detailed, official rules so that you have all the information you need before entering any of the sweepstakes or campaigns advertised on our website or using Givebox software.
            </p>
            <p><strong>A few things to note:</strong>
            <ul>
            <li>Certain parts of these rules are required by different laws. To make sure you notice them, we use BIG, SCARY, BOLD CAPITAL LETTERS for those sections</li>
            <li>These official rules apply to every campaign we run”but sometimes we also have extra information or requirements. In those cases, we publish extra rules on the campaign page. Usually those rules work with these, but occasionally, we may need to adjust some of these rules for that campaign. We{`'`}ll tell you about those changes on the campaign page</li>
            </ul>
            </p>
            <p>
            <strong>HERE ARE THE BIG, BOLD, SCARY LETTERS: WHEN YOU MAKE A DONATION, WE GIVE YOU ENTRIES INTO THE DRAWING. IT{`'`}S OUR WAY OF SAYING THANKS. CAMPAIGNS MAY ALSO INCLUDE CAMPAIGN PERKS THAT ARE GUARANTEED, IN ADDITION TO PRIZES THAT ARE REWARDED BY A RANDOM DRAWING. NO PURCHASE NECESSARY TO ENTER ANY SWEEPSTAKES.
            ALL CHARITIES ARE 26 U.S.C. 501(C)(3) NON- PROFIT ORGANIZATIONS RECOGNIZED BY THE I.R.S. VOID WHERE OTHERWISE PROHIBITED OR RESTRICTED BY LAW. ALL FEDERAL, STATE AND LOCAL LAWS AND REGULATIONS APPLY.</strong></p>
            <h4>HOW IT WORKS</h4>
            <p>We use Givebox{`'`}s online platform (our {`"`}Platform{`"`}) or Givebox SaaS (Our {`"`}SaaS{`"`}) to power fundraising campaigns where the Prize Provider (IE Charity) offers experiences and prizes that anybody can enter to win.
            We may also offer certain guaranteed perks and incentives ("Perks). Perks are not part of the sweepstakes”they{`'`}re based on donations. You don{`'`}t have to make a donation to a charity to enter a sweepstakes, but if you do, we will give you entries as a thank you.</p>
            <h4>HOW TO ENTER A SWEEPSTAKES</h4>
            {/*
            <p>Givebox offers several different ways to enter a sweepstakes, and it{`'`}s really easy to do any of the three methods of entry.</p>
            */}
            <p>
              <strong>Make a donation:</strong><br />
              Visit <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://givebox.com')}>Givebox.com</GBLink> or choose a fundraising campaign on one of the many charity websites that Givebox supports. Do a good deed by completing the required fields, and maybe you{`'`}ll give a donation. As a thank you, you get a sweepstakes entry for every donation to the Charity. The charity chooses how to calculate the worth of each entry in increments. The more you donate, the more entries you receive as a Thank you!
            </p>
            {/*
            <p>
              <strong>To enter for free:</strong><br />
              When you visit <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://givebox.com')}>Givebox.com</GBLink> or choose a fundraising campaign on one of the many charity websites that Givebox supports, simply fill out the required fields, without entering your payment information, before the deadline. Then press ENTER TO WIN! And the organization will gift you an entry into the sweepstakes. The organization would appreciate limiting one complimentary entry per guest.
            </p>
            */}
            <h4>RANDOM ENTRY SELECTION</h4>
            <p>We use an algorithm to ensure all entries are treated equally. At the end of a campaign, the algorithm randomly selects an entry as the winner. The organization nor Givebox Inc. selects the winner. The robots handle this aspect of the Sweepstakes to ensure everything is fair.</p>
            <h4>WHO CAN ENTER A CAMPAIGN?</h4>
            <p>Everybody and anybody! however some countries don{`'`}t love sweepstakes. So, we have to restrict entries from those countries. This means that most campaigns are open to legal residents of the 50 United States and the District of Columbia, and most countries around the world, but they{`'`}re void in all countries on the United States list of embargoed countries, as well as in countries where local laws prohibit entry into sweepstakes. We also may have to limit certain campaigns to specific countries. If we do so, we publish that in special rules on the campaign page. Also, to keep things fair, employees of Givebox Inc., Charity, or Prize Provider for the applicable campaign, and members of their immediate families, are not eligible to enter.</p>
            <p>Finally, sometimes your country may allow you to enter a sweepstakes but not allow you to receive a certain Prize. It{`'`}s your responsibility to review any specific restrictions before claiming that Prize or making a donation. In all cases, campaigns are void where prohibited by law.</p>
            <h4>WHEN CAN I ENTER A CAMPAIGN?</h4>
            <p>The start and end date for each campaign is listed on each of the campaign page.</p>
            <h4>HOW DO I KNOW IF I WON?</h4>
            <p>As soon as the Sweepstakes closes, the algorithm that randomly selects an entry as the winner, will send an email to the "Winner and the organization who created the sweepstakes. Depending on the guides of the organization, the winner may need to sign an affidavit of eligibility, liability and where legal, a publicity release and send it back to the organization within seven days of notification, as well as any other documents necessary provided by the organization, such as a background check. Once this is done, the organization will declare them as the winner. If they are required this extra paperwork and don™t get back to the organization, don™t sign one of the required forms, are unable to claim a Prize, or pose a threat to the Prize Provider (Organization), the organization is allowed to disqualify that person and proceed with the next randomly selected person on list.</p>
            <p>
            Travel companions may also required to sign a liability/publicity release prior to issuance of tickets. Contact the organization holding the sweepstakes should you like to know more about the requirements of the winner of that sweepstakes.</p>
            <h4>WHAT ARE THE RESTRICTIONS OR CONDITIONS ON A PRIZE?</h4>
            <p>It is up to the organization to describe each Prize on their campaign page and in any special campaign rules, including the approximate retail value for that Prize. Look at the section called {`"`}Stuff Our Lawyers Want You to Read{`"`} for lots of details or contact the organization for more details.</p>
            <p>Some Prizes may have extra restrictions or conditions. The organization will have to post these in the specific rules for that campaign, too. For all travel Prizes, you have to travel on the dates specified by the organization and all airfare and hotel accommodations must be discussed between the organization and the winner unless otherwise specified. Any meetings with celebrities are subject to security and background checks. For international travel, you are responsible for obtaining all necessary travel authorizations, visas, or other documentation. All other expenses are your responsibility. Travel restrictions, conditions and limitations may apply. The Prize value may vary depending on point of departure, travel dates and fare/rate fluctuations. And because stuff happens, we can™t be responsible for any cancellations, delays, diversions or substitutions, or any act or omission of any third person with respect to the trip. Lost or stolen tickets, travel vouchers or certificates or similar items once they are in your possession, will not be replaced. Winner and guest must travel on same itinerary. If you or your guest are, in the organization™s opinion, obnoxious, threatening, abusive, or harassing we can terminate the trip or Prize, in whole or in part, and you will be asked to you both home with no further compensation.
            Your guest must be of legal age of majority in his/her jurisdiction of residence, or your child or legal ward (unless otherwise approved by us).
            If you live within a one hundred (100) mile radius of the site where the Prize is to be performed, you may have to your own transportation instead.
            The organization spends a lot of time thinking up the most amazing Prizes possible, so Prizes can™t be transferred or substituted, except that we can substitute a Prize of equal or greater value.
            And you might not love taxes, but they™re your responsibility and you have to pay them. The organization may give you a W9 form so you can tell Uncle Sam what you owe. If you feel that you need one, please contact the organization.</p>
            <h4>WINNER PROMOTION</h4>
            <p>
            By accepting the Prize, you agree that Givebox Inc. and the organization can use your name, address (city and state), photograph, voice and/or other likeness and Prize information to tell everyone how awesome the Prize was. This means we can include you in advertising and trade and promotional materials for Givebox Inc., in any form of media (including media that™s not yet known), and that we can do so without any additional compensation. This only applies unless otherwise prohibited by law.
            </p>
            <p>If you prefer to remain anonymous, email <a href="mailto:sweepstakes@givebox.com" style={{ color: primaryColor }}>sweepstakes@Givebox.com</a> and make formal request.
            </p>
            <h4>WHAT ARE THE RESTRICTIONS OR CONDITIONS ON A PRIZE?</h4>
            <p>It is up to the organization to describe each Prize on their campaign page and in any special campaign rules, including the approximate retail value for that Prize. Look at the section called {`"`}Stuff Our Lawyers Want You to Read{`"`} for lots of details or contact the organization for more details.</p>
            <h4>HOW WE USE YOUR INFORMATION</h4>
            <p>We may want to get to know you! And so do the Charities and Prize providers. So when you enter a sweepstakes, we{`'`}ll collect some information about you. Check out our privacy policy at <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://Givebox.com/privacy')}>Privacy Policy</GBLink> to see what we collect and how we use it. If you choose to enter a sweepstakes, you agree to our privacy policy. You can always choose not to enter, but where™s the fun in that?</p>
            <h4>SHOULDN{`'`}T THERE BE MORE LEGAL STUFF?</h4>
            <p>We™re glad you asked! In order to keep our lawyer happy, we have to tell you the following:
            <br />
            <ul>
              <li>Sponsor, Prize Providers, and Charities (the Released Parties) are not responsible for illegible, lost, late, incomplete, misdirected, or undeliverable email; or for any computer, telephone, satellite, cable, network, electronic or internet hardware or software malfunctions, failures, connections, or availability, or garbled, corrupt or jumbled transmissions, service provider/internet/website/use net accessibility, availability, or traffic congestion, or any technical, typographical, or other error, or unauthorized human intervention, or the incorrect or inaccurate capture of registration information, or the failure to capture, or loss of, any such information.</li>
              <li>By entering sweepstakes, you agree: (a) to be bound by these Official Rules and by all applicable laws and decisions of Sponsor, which shall be binding and final; (b) to waive any rights to claim ambiguity with respect to these Official Rules; (c) to waive all of your rights to bring any claim, action, or proceeding against any of the Released Parties in connection with that sweepstakes; and (d) to forever and irrevocably agree to release, defend, indemnify, and hold harmless each of the Released Parties from any and all claims, lawsuits, judgments, causes of action, proceedings, demands, fines, penalties, liability costs and expenses (including, without limitation, reasonable outside attorneys{`'`} fees) that may arise in connection with your participation in a sweepstakes (including any Prize).</li>
              <li>In the event of a dispute regarding entries received from multiple users having the same email account, the authorized subscriber of the email account at the time of entry will be deemed to be the entrant and must comply with these rules. Authorized account subscriber is the natural person who is assigned the email address by the Internet Service Provider (ISP), online service provider, or other organization responsible for assigning email addresses.</li>
            </ul>
            </p>
            <h4>HOW DO YOU KNOW THIS IS FOR REAL?</h4>
            <p>Just send an email to <a href="mailto:sweepstakes@givebox.com" style={{ color: primaryColor }}>sweepstakes@Givebox.com</a> requesting a list of the winners, and we™ll send you a list of the winners!</p>
            <h4>WHAT IF WE DON{`'`}T GET ALONG?</h4>
            <p>We really do love and appreciate you supporting philanthropy. And we hope you always love what we are doing to enable philanthropic fundraising. But if you don™t, you agree that any and all disputes and disagreements between Givebox Inc. will be governed by laws of the State of California and you will bring any claims only in the Federal and State courts located in Los Angeles, California. You also agree that unless you are prohibited from law in doing so, you promise you will bring any and all disputes, claims and causes of action against Givebox Inc. individually, without resort to any form of class action. Finally, unless the law prohibits you from doing so, you agree to waive the right to claim any damages whatsoever, including, but not limited to, punitive, consequential, direct, or indirect damages and participants further waive all rights to have damages multiplied or increased.</p>
            <h4>QUESTIONS</h4>
            <p>Questions regarding our Conditions of Usage, Privacy Policy, or other policy related material can be directed to our support staff by visiting <GBLink allowCustom={true} customColor={primaryColor} onClick={() => window.open('https://support.givebox.com')}>Givebox Customer Support</GBLink>. Or you can email us at:  <a href="mailto:support@mygivebox.com" style={{ color: primaryColor }}>support@mygivebox.com</a></p>
            <p>These Official Rules may not be reprinted or republished in whole or in part without the prior written consent of Givebox INC.</p>
          </div>
        </Collapse>
    )
  }
};

export default TermsSweepstakes;
