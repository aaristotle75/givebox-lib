import React from 'react';
import { connect } from 'react-redux';
import * as util from '../../common/utility';

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
      page
    } = this.props;

    const content = util.getValue(page, section);
    if (!content) return null;

    return (
      <div className={`pageContentSection ${section}`}>
        <div dangerouslySetInnerHTML={{ __html: util.cleanHtml(content) }} />
      </div>
    )
  }
}

PageContentSection.defaultProps = {
  section: 'top'
};

function mapStateToProps(state, props) {

  const pageSlug = util.getValue(state, 'gbx3.info.activePageSlug');
  const pages = util.getValue(state, 'gbx3.orgPages', {});
  const page = util.getValue(pages, pageSlug, {});

  return {
    pageSlug,
    pages,
    page
  }
}

export default connect(mapStateToProps, {
})(PageContentSection);
