export const logo = {
  order: 1,
  name: 'logo',
  title: 'Logo',
  type: 'Media',
  field: 'orgImageURL',
  updateOptions: 'once',
  mobileRelativeBlock: false,
  volunteerNoEdit: true,
  mobileClassName: 'mobileRelativeBlockTop',
  options: {
    mediaType: 'image',
    image: {
      maxSize: '55px',
      size: 'small',
      borderRadius: 20
    }
  },
  grid: {
    desktop: { i: 'logo', x: 0, y: 0, w: 1, h: 7, enabled: true },
    mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 7, static: true, enabled: false }
  },
};

export const orgName = {
  order: 2,
  name: 'orgName',
  title: 'Organization Name',
  type: 'Text',
  field: 'orgName',
  mobileRelativeBlock: 1,
  volunteerNoEdit: true,
  mobileClassName: 'mobileRelativeBlockTop',
  options: {
    defaultFormat: '<span style="font-size:12px">{{TOKEN}}</span>'
  },
  grid: {
    desktop: { i: 'orgName', x: 1, y: 0, w: 5, h: 1, enabled: true },
    mobile: { i: 'orgName', x: 1, y: 0, w: 5, h: 1, static: true, enabled: false }
  }
};


export const title = {
  order: 3,
  name: 'title',
  title: 'Title',
  type: 'Text',
  nonremovable: true,
  field: 'title',
  updateOptions: 'string',
  updateMax: 256,
  mobileRelativeBlock: 2,
  mobileClassName: 'mobileRelativeBlockTop',
  options: {
    defaultFormat: '<span style="font-size:16px;">{{TOKEN}}</span>'
  },
  grid: {
    desktop: { i: 'title', x: 1, y: 2, w: 5, h: 3, enabled: true },
    mobile: { i: 'title', x: 1, y: 2, w: 5, h: 3, static: true, enabled: false }
  }
};

export const media = {
  order: 4,
  name: 'media',
  title: 'Media',
  type: 'Media',
  nonremovable: true,
  field: 'imageURL',
  updateOptions: 'replace',
  mobileRelativeBlock: 3,
  options: {
    mediaType: 'image',
    image: {
      size: 'medium',
      borderRadius: 5
    },
    video: {
      auto: false
    }
  },
  grid: {
    desktop: { i: 'media', x: 6, y: 0, w: 6, h: 24, enabled: true },
    mobile: { i: 'media', x: 0, y: 8, w: 6, h: 24, enabled: false }
  }
};

export const amounts = {
  order: 5,
  name: 'amounts',
  title: 'Amounts',
  type: 'Amounts',
  nonremovable: true,
  field: 'amounts',
  mobileRelativeBlock: 4,
  options: {
    button: {
      embedAllowed: true,
      enabled: false,
      text: 'Select Amount',
      style: {

      }
    },
    recurring: {
      allowed: true,
      enabled: true
    }
  },
  grid: {
    desktop: { i: 'amounts', x: 0, y: 7, w: 6, h: 22, enabled: true },
    mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 22, static: true, enabled: false }
  }
};

export const countdown = {
  order: 4,
  name: 'countdown',
  title: 'Countdown',
  type: 'Countdown',
  nonremovable: true,
  mobileRelativeBlock: 4,
  mobileClassName: 'mobileRelativeBlockTop',
  content: {
    endsAt: null,
    endsAtTime: true
  },
  options: {
  },
  grid: {
    desktop: { i: 'countdown', x: 0, y: 22, w: 6, h: 3, enabled: true },
    mobile: { i: 'countdown', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
  }
};

export const date = {
  order: 4,
  name: 'date',
  title: 'Date',
  type: 'Date',
  nonremovable: false,
  field: 'date',
  updateOptions: '',
  mobileRelativeBlock: 4,
  mobileClassName: 'mobileRelativeBlockTop',
  content: {
    range1: null,
    range2: null,
    range1Label: 'Starts:',
    range2Label: 'Ends:',
    range1Time: true,
    range1DateFormat: '',
    range2Time: true,
    dateFormat: 'MMMM Do, YYYY',
    htmlTemplate: ''
  },
  options: {
    enableTimeOption: true,
    range: true,
    range1Token: '{{startdate}}',
    range1DataField: 'when',
    range1TimeDataField: 'whenShowTime',
    range1Label: 'Event Start Date',
    range2Token: '{{enddate}}',
    range2DataField: 'endsAt',
    range2TimeDataField: 'endsAtShowTime',
    range2Label: 'Event End Date'
  },
  grid: {
    desktop: { i: 'date', x: 0, y: 22, w: 6, h: 3, enabled: true },
    mobile: { i: 'date', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
  }
};

export const where = {
  order: 4,
  name: 'where',
  title: 'Where',
  type: 'Where',
  field: 'where',
  mobileRelativeBlock: 4,
  mobileClassName: 'mobileRelativeBlockTop',
  content: {
    where: {
      address: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      coordinates: {
        lat: null,
        long: null
      }
    },
    htmlTemplate: ''
  },
  options: {
    inputLabel: 'Event Location',
    inputPlaceholder: 'Add Event Location',
    mapLink: true
  },
  grid: {
    desktop: { i: 'where', x: 0, y: 22, w: 6, h: 4, enabled: true },
    mobile: { i: 'where', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
  }
};

export const paymentForm = {
  order: 7,
  name: 'paymentForm',
  title: 'Payment Form Details',
  type: 'Form',
  nonremovable: true,
  noGrid: true,
  options: {
    button: {
      enabled: true,
      text: 'GIVE NOW',
      style: {}
    },
    form: {
      tag: '',
      echeck: false,
      feeOption: true,
      passFees: true,
      addressInfo: 0,
      phoneInfo: 0,
      workInfo: 0,
      noteInfo: 0,
      notePlaceholder: '',
      allowSelection: true,
      allowSharing: true,
      showP2P: true,
      isPublic: true,
      sendEmail: {
        enabled: true, // This enables the message
        allowEmail: false, // This enables the email receipients
        linkText: 'Email Your Message',
        mainLabel: 'Give on Behalf of Someone',
        messageText: 'Add a Message',
        emailText: 'Email Your Message'
      },
      hasCustomGoal: false,
      goal: 50000,
      cartTitle: 'Your Cart',
      shopTitle: 'Browse More Items',
      shopLinkOpensOrgPage: true,
      shopLinkAsButton: false,
      browsePage: '',
      checkoutDonation: false,
      checkoutDonationText: '',
      checkoutDonationAmount: 500,
      checkoutDonationFormID: null,
      checkoutDonationArticleID: null,
      checkoutDonationFormTitle: '',
      checkoutDonationImageURL: '',
      checkoutAmountID: null
    }
  }
};

export const summary = {
  order: 6,
  name: 'summary',
  title: 'Summary',
  type: 'Text',
  subType: 'content',
  field: 'summary',
  updateOptions: 'html',
  mobileRelativeBlock: 5,
  mobileNoUpdateDesktopGrid: true,
  scrollable: false,
  options: {
  },
  grid: {
    desktop: { i: 'summary', x: 6, y: 25, w: 6, h: 2, enabled: true },
    mobile: { i: 'summary', x: 0, y: 48, w: 6, h: 4, enabled: false }
  }
};

export const description = {
  order: 6,
  name: 'description',
  title: 'Description',
  type: 'Text',
  subType: 'content',
  field: 'description',
  updateOptions: 'html',
  mobileRelativeBlock: 5,
  mobileNoUpdateDesktopGrid: true,
  scrollable: true,
  options: {
    button: {
      embedAllowed: true,
      enabled: true,
      text: 'Learn More',
      style: {}
    }
  },
  grid: {
    desktop: { i: 'description', x: 6, y: 26, w: 6, h: 3, enabled: true },
    mobile: { i: 'description', x: 0, y: 48, w: 6, h: 4, enabled: false }
  }
};

export const textBlock = {
  order: 6,
  name: 'textBlock',
  title: 'Short Text',
  type: 'Text',
  multiple: true,
  mobileRelativeBlock: 10,
  options: {
    defaultFormat: '<span>Enter Text</span>'
  },
  grid: {
    desktop: { i: 'textBlock', x: 1, y: 0, w: 12, h: 2, enabled: true },
    mobile: { i: 'textBlock', x: 1, y: 0, w: 6, h: 2, enabled: true }
  }
};

export const contentBlock = {
  order: 6,
  name: 'contentBlock',
  title: 'Text',
  type: 'Text',
  subType: 'content',
  multiple: true,
  overflow: 'visible',
  mobileRelativeBlock: 10,
  mobileNoUpdateDesktopGrid: true,
  scrollable: true,
  options: {
    defaultFormat: '<span>Enter Content</span>'
  },
  grid: {
    desktop: { i: 'contentBlock', x: 0, y: 0, w: 12, h: 4, enabled: true },
    mobile: { i: 'contentBlock', x: 0, y: 0, w: 6, h: 4, enabled: false }
  }
};

export const imageBlock = {
  order: 6,
  name: 'imageBlock',
  title: 'Image',
  type: 'Media',
  multiple: true,
  mobileRelativeBlock: 10,
  options: {
    mediaType: 'image',
    image: {
      size: 'medium',
      borderRadius: 0
    },
    video: {
      auto: true
    }
  },
  grid: {
    desktop: { i: 'imageBlock', x: 6, y: 0, w: 12, h: 24, enabled: true },
    mobile: { i: 'imageBlock', x: 0, y: 2, w: 6, h: 24, enabled: false }
  }
};

export const videoBlock = {
  order: 6,
  name: 'videoBlock',
  title: 'Video',
  type: 'Media',
  multiple: true,
  mobileRelativeBlock: 10,
  options: {
    mediaType: 'video',
    image: {
      size: 'medium',
      borderRadius: 0
    },
    video: {
      auto: true
    }
  },
  grid: {
    desktop: { i: 'videoBlock', x: 6, y: 0, w: 12, h: 24, enabled: true },
    mobile: { i: 'videoBlock', x: 0, y: 2, w: 6, h: 24, enabled: false }
  }
};

export const mainCampaigns = {
  order: 8,
  name: 'mainCampaigns',
  title: 'Main Form List',
  type: 'Campaigns',
  subType: 'main',
  multiple: false,
  mobileRelativeBlock: 10,
  options: {
    maxRecords: 3,
    initiated: false,
    customList: []
  },
  style: {
    borderRadius: 0,
    titleFontSize: 18
  },
  grid: {
    desktop: { i: 'mainCampaigns', x: 0, y: 38, w: 12, h: 52, enabled: true },
    mobile: { i: 'mainCampaigns', x: 0, y: 2, w: 6, h: 24, enabled: false }
  }
};

export const campaignsBlock = {
  ...mainCampaigns,
  order: 8,
  name: 'campaignsBlock',
  title: 'Form List',
  type: 'Campaigns',
  multiple: true,
  mobileRelativeBlock: 10,
  options: {
    maxRecords: 3,
    initiated: true,
    customList: []
  }
};

const articleBlocks = {
  logo,
  title,
  orgName,
  amounts,
  media,
  description,
  paymentForm,
  contentBlock,
  imageBlock,
  videoBlock
}

const fundraiser = {
  ...articleBlocks
};

const event = {
  ...articleBlocks,
  paymentForm: {
    ...paymentForm,
    ...{
      options: {
        ...paymentForm.options,
        form: {
          ...paymentForm.options.form,
          virtualEvent: {
            isEnabled: false,
            APIKey: null,
            videoID: null,
            providerName: 'cinesend'
          }
        }
      }
    }
  },
  amounts: {
    ...amounts,
    ...{
      options: {
        ...amounts.options,
        button: {
          ...amounts.options.button,
          embedAllowed: false,
          enabled: true,
          text: 'Select Tickets'
        },
        extras: {
          maxQuantity: '',
          showInStock: false
        },
        recurring: {}
      },
      grid: {
        desktop: { i: 'amounts', x: 0, y: 19, w: 6, h: 6, enabled: true },
        mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 4, static: true, enabled: false }
      }
    }
  },
  when: {
    ...date,
    name: 'when',
    title: 'When is the Event',
    grid: {
      desktop: { i: 'date', x: 0, y: 8, w: 6, h: 3, enabled: true },
      mobile: { i: 'date', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
    }
  },
  where: {
    ...where,
    title: 'Where is the Event',
    grid: {
      desktop: { i: 'date', x: 0, y: 13, w: 6, h: 5, enabled: true },
      mobile: { i: 'date', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
    }
  },
};

const sweepstake = {
  ...articleBlocks,
  countdown: {
    ...countdown,
    grid: {
      desktop: { i: 'date', x: 0, y: 8, w: 6, h: 10, enabled: true },
      mobile: { i: 'date', x: 0, y: 2, w: 5, h: 3, static: true, enabled: false }
    }
  },
  amounts: {
    ...amounts,
    ...{
      options: {
        ...amounts.options,
        button: {
          ...amounts.options.button,
          embedAllowed: false,
          enabled: true,
          text: 'Select Tickets'
        },
        extras: {
          maxQuantity: '',
          showInStock: false,
          allowPerTicketWinner: null
        },
        recurring: {}
      },
      grid: {
        desktop: { i: 'amounts', x: 0, y: 19, w: 6, h: 6, enabled: true },
        mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 4, static: true, enabled: false }
      }
    }
  },
  description: {
    ...description,
    options: {
      button: {
        embedAllowed: true,
        enabled: true,
        text: 'Sweepstakes Details',
        style: {
          width: 250
        }
      }
    },
  },
  paymentForm: {
    ...paymentForm,
    options: {
      ...paymentForm.options,
      button: {
        enabled: true,
        text: 'ENTER TO WIN',
        style: {}
      }
    }
  }
};

const membership = {
  ...articleBlocks,
  amounts: {
    ...amounts,
    ...{
      options: {
        ...amounts.options,
        button: {
          ...amounts.options.button,
          embedAllowed: false,
          enabled: true,
          text: 'Select Subscription'
        },
        extras: {
          maxQuantity: '',
          showInStock: false
        },
        recurring: {
          recurringIntervals: [],
          recurringDefaultInterval: ''
        }
      },
      grid: {
        desktop: { i: 'amounts', x: 0, y: 10, w: 6, h: 6, enabled: true },
        mobile: { i: 'amounts', x: 0, y: 32, w: 6, h: 4, static: true, enabled: false }
      }
    }
  }
};

const invoice = {
  ...articleBlocks,
  paymentForm: {
    ...paymentForm,
    options: {
      ...paymentForm.options,
      form: {
        ...paymentForm.options.form,
        isPublic: false
      }
    }
  }
};

const emailBlockTemplate = {
  contentBlock,
  orgName: {
    ...orgName,
    order: 2,
    options: {
      defaultFormat: '<p style="text-align:center;font-size:12px">{{TOKEN}}</p>'
    },
  },
  title: {
    ...title,
    order: 1,
    updateOptions: null,
    options: {
      defaultFormat: '<p style="text-align:center;font-size:16px">{{TOKEN}}</p>'
    },
  },
  media: {
    ...media,
    disallowRadius: true,
    updateOptions: null,
    ...{
    options: {
      ...media.options,
      image: {
        ...media.options.image,
        borderRadius: 0
      },
      video: null
    }}
  },
  description: {
    ...description,
    updateOptions: null,
    options: {
      button: {}
    },
  },
  imageBlock: {
    ...imageBlock,
    disallowRadius: true,
    updateOptions: null,
    ...{
    options: {
      ...media.options,
      image: {
        ...media.options.image,
        borderRadius: 0
      },
      video: null
    }}
  }
};

export const blockTemplates = {
  article: {
    fundraiser,
    event,
    invoice,
    membership,
    sweepstake
  },
  receipt: {
    ...emailBlockTemplate
  },
  emailBlast: {
    ...emailBlockTemplate
  },
  org: {
    logo: {
      ...logo,
      mobileRelativeBlock: true,
      field: 'imageURL',
      options: {
        mediaType: 'image',
        image: {
          maxSize: '160px',
          size: 'medium',
          borderRadius: 20
        }
      },
      grid: {
        desktop: { i: 'logo', x: 0, y: 10, w: 12, h: 16, enabled: true },
        mobile: { i: 'logo', x: 0, y: 0, w: 1, h: 7, static: true, enabled: false }
      },
    },
    orgName: {
      ...orgName,
      type: 'Text',
      field: 'name',
      options: {
        defaultFormat: '<p style="text-align:center"><span style="font-weight:300;font-size:24px">{{TOKEN}}</span></p>'
      },
      grid: {
        desktop: { i: 'orgName', x: 0, y: 27, w: 12, h: 4, enabled: true },
        mobile: { i: 'orgName', x: 1, y: 0, w: 6, h: 1, static: true, enabled: false }
      }
    },
    description: {
      ...description,
      options: {
        button: {
          embedAllowed: true,
          enabled: true,
          text: 'About Us',
          style: {
            width: 250
          }
        }
      },
      grid: {
        desktop: { i: 'description', x: 0, y: 32, w: 12, h: 4, enabled: true },
        mobile: { i: 'description', x: 1, y: 0, w: 6, h: 1, static: true, enabled: false }
      }
    },
    mainCampaigns,
    campaignsBlock,
    contentBlock,
    imageBlock,
    videoBlock
  }
};

const articleDefaults = [
  'logo',
  'title',
  'orgName',
  'amounts',
  'media',
  'description',
  'paymentForm'
];

export const defaultBlocks = {
  article: {
    fundraiser: [ ...articleDefaults ],
    invoice: [ ...articleDefaults ],
    event: [ ...articleDefaults, 'when', 'where' ],
    sweepstake: [ ...articleDefaults, 'countdown' ],
    membership: [ ...articleDefaults ]
  },
  receipt: [
    'title',
    'orgName',
    'media',
    'description'
  ],
  emailBlast: [
    'title',
    'orgName',
    'media',
    'description'
  ],
  org: [
    'logo',
    'orgName',
    'description',
    'mainCampaigns'
  ]
}
