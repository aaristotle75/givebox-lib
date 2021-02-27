import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';
import ModalLink from '../../modal/ModalLink';

class PageContentSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {

    const {
      section,
      page,
      globalPageContent
    } = this.props;

    const content = util.getValue(page, section, globalPageContent);
    const pageSlug = util.getValue(page, 'slug');

    if (!content) return null;

    return (
      <div className={`pageContentSection ${section}`}>
        <ModalLink
          id='orgEditPage'
          type='div'
          className='pageContentContainer orgAdminEdit'
          opts={{
            pageSlug,
            autoFocus: section
          }}
        >
          <button className='tooltip blockEditButton' id='orgEditPage'>
            <span className='tooltipTop'><i />Click to EDIT Content</span>
            <span className='icon icon-edit'></span>
          </button>
        </ModalLink>
        <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(content) }} />
      </div>
    )
  }
}

PageContentSection.defaultProps = {
  section: 'top'
};

function mapStateToProps(state, props) {

  const section = props.section;
  const pageSlug = util.getValue(state, 'gbx3.info.activePageSlug');
  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, pageSlug, {});
  const globalPageContentSlug = util.getValue(state, `gbx3.orgGlobals.pageContent.${section}`);
  const globalPageContent = util.getValue(pages, `${globalPageContentSlug}.${section}`);

  return {
    pageSlug,
    pages,
    page,
    globalPageContent
  }
}

export default connect(mapStateToProps, {
})(PageContentSection);
